import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.enableCors({
    origin: true,

    // origin: ['http://localhost:3003', 'https://accounts.google.com'],
    credentials: true,
  });

  // app.use(express.json());

  // configure CORS
  // app.use(cors({
  //   origin: true,
  //   credentials: true
  // }));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();

// app.use(
//   cors({
//     origin: ['http://localhost:3003', 'https://accounts.google.com'],
//     credentials: true, // Set this to true if you need to send cookies or headers with the request
//   }),
// );
