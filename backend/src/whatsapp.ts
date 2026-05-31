import { create, Client, ConfigObject } from '@open-wa/wa-automate';
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
      authTimeout: 60,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: 'es' as any,
      logConsole: false,
      popup: false,
      qrTimeout: 0,
    };

    // Use any to bypass type checking for the second argument if it's not in the type definition but supported by the library
    const client: Client = await (create as any)(config, (base64Qr: string) => {
        io.emit('qr', base64Qr);
    });

    waClient = client;

    io.emit('status', 'connected');

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
