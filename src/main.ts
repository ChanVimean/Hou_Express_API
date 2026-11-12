import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

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
