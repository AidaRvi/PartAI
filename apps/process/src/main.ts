import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const rabbitMQURL = configService.get('rabbitmq.url');
  const rabbitMQQueue = configService.get('rabbitmq.queue');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQURL],
      queue: rabbitMQQueue,
      queueOptions: {
        durable: true,
      },
      noAck: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(port, () => {
    console.log(`==> Process is running on port ${port}`);
  });
}
bootstrap();
