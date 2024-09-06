📱 WhatsApp Bot API com NestJS e RabbitMQ
Este projeto é uma API desenvolvida em NestJS que permite enviar e receber mensagens do WhatsApp através da integração com o whatsapp-web.js. A API também utiliza o RabbitMQ para gerenciar a fila de mensagens, proporcionando escalabilidade e confiabilidade na entrega de mensagens.

🚀 Funcionalidades
Envio de mensagens do WhatsApp via API.
Recebimento de mensagens e processamento automático de comandos como !ping e !info.
Integração com RabbitMQ para envio de mensagens para uma fila, permitindo o uso de sistemas de mensageria.
Geração de QR Code para autenticação do WhatsApp Web.
📂 Estrutura do Projeto
bash
Copiar código
src/
  ├── whatsapp/
  │   ├── whatsapp.module.ts        # Módulo de integração com o WhatsApp
  │   ├── whatsapp.service.ts       # Lógica de envio/recebimento de mensagens do WhatsApp
  │   ├── whatsapp.controller.ts    # Controlador para lidar com requisições HTTP
  ├── rabbitmq/
  │   ├── rabbitmq.module.ts        # Módulo de integração com o RabbitMQ
  │   ├── rabbitmq.service.ts       # Lógica de envio de mensagens para a fila RabbitMQ
main.ts                             # Arquivo principal para inicializar a aplicação NestJS
🛠️ Pré-requisitos
Node.js (v14+)
npm ou yarn
NestJS CLI (opcional)
Docker (opcional, para rodar o RabbitMQ)
🧰 Tecnologias Utilizadas
NestJS: Framework Node.js para construir aplicações escaláveis.
whatsapp-web.js: Biblioteca para interagir com a API do WhatsApp Web.
RabbitMQ: Broker de mensagens para filas e processamento assíncrono.
TypeScript: Linguagem de tipagem estática para JavaScript.
🔧 Configuração
1. Clone o repositório
bash
Copiar código
git clone https://github.com/seu-usuario/whatsapp-bot-api.git
cd whatsapp-bot-api
2. Instale as dependências
Com npm:

bash
Copiar código
npm install
Ou com yarn:

bash
Copiar código
yarn install
3. Configure o RabbitMQ
Você pode rodar o RabbitMQ localmente ou usar o Docker para simplificar:

bash
Copiar código
docker run -d --hostname my-rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
O RabbitMQ estará acessível na URL: amqp://localhost.

4. Inicie a aplicação
Execute o servidor NestJS:

bash
Copiar código
npm run start
A API estará rodando em http://localhost:3001.

📱 Endpoints
Enviar mensagem
Endpoint para enviar uma mensagem do WhatsApp.

URL: POST /whatsapp/send-message

Exemplo de corpo da requisição:

json
Copiar código
{
  "number": "5511999999999",
  "message": "Olá, mundo!"
}
Resposta:

json
Copiar código
{
  "status": "Mensagem enviada para a fila!"
}
Webhooks e Recebimento de Mensagens
O bot processa automaticamente comandos recebidos como !ping e !info.

!ping: Retorna pong.
!info: Retorna informações sobre o bot.
Logs de Mensagens
Todas as mensagens recebidas e enviadas pelo WhatsApp são registradas no console para monitoramento e debug.

🔄 Como funciona
Autenticação no WhatsApp: No primeiro uso, a API gera um QR Code que deve ser escaneado no WhatsApp para vincular a sessão. O código é exibido no terminal.
Envio de Mensagens: A API recebe uma requisição com o número do destinatário e o conteúdo da mensagem, que é enviada para a fila do RabbitMQ.
Fila RabbitMQ: As mensagens são publicadas em uma fila RabbitMQ (whatsapp_messages), que pode ser usada para processar mensagens de forma assíncrona.
Recebimento de Mensagens: O bot ouve todas as mensagens recebidas no WhatsApp, permitindo o processamento automático de comandos.
🐳 Usando com Docker
Se preferir, você pode rodar a aplicação completa com Docker.

1. Build da imagem
bash
Copiar código
docker build -t whatsapp-bot-api .
2. Subir o container
bash
Copiar código
docker run -p 3001:3001 whatsapp-bot-api
A API estará acessível em http://localhost:3001.

🛠️ Troubleshooting
Problemas com o QR Code do WhatsApp: Certifique-se de que o WhatsApp Web não está bloqueado na sua rede e que você tem uma conexão estável de internet.
Erro de conexão com o RabbitMQ: Verifique se o RabbitMQ está rodando corretamente e acessível via amqp://localhost.
🤝 Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou issue.

📝 Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
