import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service'; // Certifique-se de que o caminho está correto

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
