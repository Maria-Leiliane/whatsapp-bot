import { Controller, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  // Rota para enviar mensagens via WhatsApp
  @Post('send')
  async sendMessage(
    @Body('number') number: string,
    @Body('message') message: string,
  ) {
    if (!number || !message) {
      return { error: 'Número e mensagem são obrigatórios!' };
    }

    try {
      // Envia a mensagem para o cliente via WhatsApp
      await this.whatsappService.sendMessage(number, message);
      return { status: 'Mensagem enviada ao WhatsApp' };
    } catch (error) {
      return {
        error: 'Erro ao enviar a mensagem',
        details: error.message,
      };
    }
  }
}
