import { NestFactory } from '@nestjs/core';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WhatsAppModule);

  // Configurar o microservice RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'whats_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002);
  console.log('API rodando na porta 3002');
}

bootstrap();
