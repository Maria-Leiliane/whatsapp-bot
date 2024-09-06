import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  async sendToQueue(queue: string, message: string): Promise<void> {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Mensagem enviada para a fila ${queue}: ${message}`);
    } catch (error) {
      console.error('Erro ao conectar com o RabbitMQ:', error);
    }
  }
}
