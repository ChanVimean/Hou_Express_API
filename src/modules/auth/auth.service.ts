import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new ConflictException('Email already registered');

    // Find default role
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'User' },
    });

    if (!defaultRole) {
      throw new InternalServerErrorException(
        'Default User role has not been configured',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        hashPassword: hashedPassword,
        role: {
          connect: { id: defaultRole.id },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      message: 'Registration successful',
      data: user,
    };
  }

  // LOGIN

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    if (user.status !== 1)
      throw new UnauthorizedException('Account is inactive');

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.hashPassword,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    const permissions = user.role.permissions.map(
      (item) => item.permission.slug,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
        permissions,
      },
    };
  }

  // LOGOUT
  async logout(userId: string) {
    return { message: 'Logout successful.' };
  }

  // ME
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role.name,
    };
  }
}
