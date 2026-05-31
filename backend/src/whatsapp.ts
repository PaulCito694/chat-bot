import { create, Client } from '@open-wa/wa-automate';
import { getChatCompletion } from './ai.js';

export async function startWhatsApp() {
  try {
    const client: Client = await create({
      sessionId: "SALES_CHATBOT",
      authTimeout: 60,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: 'es' as any,
      logConsole: false,
      popup: true,
      qrTimeout: 0, // 0 means it will wait forever for you to scan the qr code
    });

    client.onMessage(async (message: any) => {
      if (message.body && !message.isGroupMsg) {
        console.log(`Received message from ${message.from}: ${message.body}`);

        // Start typing indicator
        await client.simulateTyping(message.from, true);

        const aiResponse = await getChatCompletion(message.body);

        // Stop typing indicator
        await client.simulateTyping(message.from, false);

        await client.sendText(message.from, aiResponse);
      }
    });

    console.log('WhatsApp client is ready!');
    return client;
  } catch (error) {
    console.error('Error starting WhatsApp client:', error);
    throw error;
  }
}
