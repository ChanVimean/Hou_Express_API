import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Enable CORS for your Next.js frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Local Front-End
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Required for cookies/authorization headers
  });

  // Configure Session middleware
  app.use(cookieParser());

  // WebSocket adapter
  app.useWebSocketAdapter(new WsAdapter(app));

  // Global API prefix
  // app.setGlobalPrefix('api');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT!;
  const localhost = process.env.LOCALHOST!;

  await app.listen(port);

  console.log(`Server is running at http://${localhost}:${port}/`);
}

await bootstrap();
