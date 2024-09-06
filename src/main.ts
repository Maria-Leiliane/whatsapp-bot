import { NestFactory } from '@nestjs/core';
import { AppModule } from './whatsapp/whatsapp.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar microservice RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // URL do RabbitMQ
      queue: 'whats_queue', // Nome da fila
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices(); // Iniciar microservice RabbitMQ
  await app.listen(3002); // Iniciar API
}
bootstrap();
