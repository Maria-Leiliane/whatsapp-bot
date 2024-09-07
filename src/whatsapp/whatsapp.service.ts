import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private client: Client;

  private readonly webhookUrl: string = process.env.WEBHOOK_URL;

  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  async onModuleInit() {
    // Gera o QR Code para autenticação no WhatsApp
    this.client.on('qr', (qr: string) => {
      qrcode.generate(qr, { small: true });
    });

    // Quando o cliente estiver pronto
    this.client.on('ready', () => {
      console.log('WhatsApp Client is ready!');
    });

    // Quando uma nova mensagem for criada no WhatsApp
    this.client.on('message_create', async (message: Message) => {
      // Lida apenas com mensagens recebidas que não foram enviadas pelo próprio bot
      if (!message.fromMe) {
        await this.handleIncomingMessage(message);
      }
    });

    // Inicializa o cliente do WhatsApp
    this.client.initialize();
  }

  // Função para enviar mensagem via WhatsApp
  async sendMessage(number: string, message: string): Promise<void> {
    const chatId = `${number}@c.us`; // Formata o número no padrão do WhatsApp
    await this.client.sendMessage(chatId, message);
  }

  // Função para lidar com mensagens recebidas e notificar o webhook
  private async handleIncomingMessage(message: Message): Promise<void> {
    const msgBody = message.body.toLowerCase();

    // Envia notificação para o webhook
    try {
      await axios.get(this.webhookUrl, {
        params: {
          from: message.from,
          body: message.body,
          timestamp: message.timestamp,
        },
      });

      console.log('Notificação enviada ao webhook com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar notificação para o webhook:', error);
    }

    // Responder à mensagem com base no conteúdo
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
    } else if (msgBody.includes('encerrar') || msgBody.includes('tchau')) {
      await this.client.sendMessage(
        message.from,
        'Conversa encerrada. Caso precise de mais ajuda, estou à disposição!',
      );
    } else {
      await this.client.sendMessage(
        message.from,
        'Desculpe, não entendi sua mensagem. Posso ajudar em algo específico?',
      );
    }
  }
}
