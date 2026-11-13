import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { GetProductsQueryDto } from './dto/get-products-query.dto.js';
import { PrismaService } from '../../database/prisma.service.js';
import { Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(query: GetProductsQueryDto) {
    const { page = 1, limit = 10, search, categoryId, status } = query;

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        title: {
          contains: search,
        },
      }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          images: {
            where: {
              variantId: null,
              isPrimary: true,
            },
            take: 1,
          },
          variants: {
            select: {
              id: true,
              sku: true,
              price: true,
              salePrice: true,
              status: true,
            },
          },
        },
      }),

      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
