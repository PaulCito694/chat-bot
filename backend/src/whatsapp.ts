import { create, Client, ConfigObject, ev } from '@open-wa/wa-automate';
import { Server } from 'socket.io';
import { getChatCompletion } from './ai.js';

let waClient: Client | null = null;

export function getWhatsAppClient() {
  return waClient;
}

export async function startWhatsApp(io: Server) {
  try {
    const config: ConfigObject = {
      sessionId: "SALES_CHATBOT",
      authTimeout: 0,
      qrTimeout: 0,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: 'es' as any,
      logConsole: true,
      useChrome: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    };

    console.log('Initializing WhatsApp client with config:', JSON.stringify(config, null, 2));

    ev.on('qr.**', (qr, sessionId) => {
        if (sessionId === config.sessionId) {
            console.log('QR Code generated');
            io.emit('qr', qr);
        }
    });

    ev.on('status.**', (status, sessionId) => {
        if (sessionId === config.sessionId) {
            console.log('WhatsApp status change:', status);
            io.emit('status', status);
        }
    });

    const client: Client = await create(config);

    waClient = client;

    client.onMessage(async (message: any) => {
      // Emit new message to frontend
      io.emit('new_message', message);

      if (message.body && !message.isGroupMsg && !message.fromMe) {
        console.log(`Received message from ${message.from}: ${message.body}`);

        // Start typing indicator
        await client.simulateTyping(message.from, true);

        const aiResponse = await getChatCompletion(message.body);

        // Stop typing indicator
        await client.simulateTyping(message.from, false);

        await client.sendText(message.from, aiResponse);
      }
    });

    client.onStateChanged((state) => {
        io.emit('status', state);
    });

    console.log('WhatsApp client is ready!');
    return client;
  } catch (error) {
    console.error('Error starting WhatsApp client:', error);
    throw error;
  }
}
