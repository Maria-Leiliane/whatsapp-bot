import { Controller, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Post('send-message')
  async sendMessage(
    @Body('number') number: string,
    @Body('message') message: string,
  ) {
    if (!number || !message) {
      return { error: 'Número e mensagem são obrigatórios!' };
    }

    const messageBody = JSON.stringify({ number, message });

    // Publicar a mensagem na fila do RabbitMQ
    await this.rabbitMQService.sendToQueue('whatsapp_messages', messageBody);

    return { status: 'Mensagem enviada para a fila!' };
  }
}
