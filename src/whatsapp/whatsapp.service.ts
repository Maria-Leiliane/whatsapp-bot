import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private client: Client;

  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  async onModuleInit() {
    this.client.on('qr', (qr: string) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp Client is ready!');
    });

    this.client.on('message_create', async (message: Message) => {
      if (!message.fromMe) {
        await this.handleIncomingMessage(message);
      }
    });

    this.client.initialize();
  }

  async sendMessage(number: string, message: string): Promise<void> {
    const chatId = `${number}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  // Função para lidar com mensagens recebidas e responder com boas-vindas ou encerrar a conversa
  private async handleIncomingMessage(message: Message): Promise<void> {
    const msgBody = message.body.toLowerCase();

    // Boas-vindas para "oi", "bom dia", "boa tarde", "boa noite"
    if (msgBody.includes('oi')) {
      await this.client.sendMessage(
        message.from,
        'Olá! Como posso te ajudar hoje?',
      );
    } else if (msgBody.includes('bom dia')) {
      await this.client.sendMessage(
        message.from,
        'Bom dia! Espero que seu dia seja ótimo!',
      );
    } else if (msgBody.includes('boa tarde')) {
      await this.client.sendMessage(
        message.from,
        'Boa tarde! Como posso ajudar você nesta tarde?',
      );
    } else if (msgBody.includes('boa noite')) {
      await this.client.sendMessage(
        message.from,
        'Boa noite! Desejo uma ótima noite para você!',
      );
    }
    // Comando para encerrar a conversa
    else if (msgBody.includes('encerrar') || msgBody.includes('tchau')) {
      await this.client.sendMessage(
        message.from,
        'Conversa encerrada. Caso precise de mais ajuda, estou à disposição!',
      );
    } else {
      // Caso a mensagem não se encaixe nas categorias anteriores, você pode enviar uma resposta padrão
      await this.client.sendMessage(
        message.from,
        'Desculpe, não entendi sua mensagem. Posso ajudar em algo específico?',
      );
    }
  }
}
