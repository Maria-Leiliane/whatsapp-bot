import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private client: Client;

  constructor(private readonly rabbitMQService: RabbitMQService) {
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
        await this.handleCommand(message);
      }
    });

    this.client.initialize();
  }

  async sendMessage(number: string, message: string): Promise<void> {
    const chatId = `${number}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  private async handleCommand(message: Message): Promise<void> {
    const msgBody = message.body.toLowerCase();

    if (msgBody === '!ping') {
      await this.client.sendMessage(message.from, 'pong');
    } else if (msgBody === '!info') {
      const infoMsg = `Este é um bot de teste para o WhatsApp Web API.\n\nComandos disponíveis:\n- !ping: Retorna 'pong'.\n- !info: Exibe esta mensagem de informações.`;
      await this.client.sendMessage(message.from, infoMsg);
    }
  }
}
