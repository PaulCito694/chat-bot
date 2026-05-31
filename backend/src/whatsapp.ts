import { create, Client } from '@open-wa/wa-automate';
import { getChatCompletion } from './ai.js';
import { Server } from 'socket.io';

let waClient: Client | null = null;

export async function startWhatsApp(io: Server) {
  try {
    waClient = await create({
      sessionId: "SALES_CHATBOT",
      authTimeout: 60,
      blockCrashLogs: true,
      disableSpins: true,
      headless: true,
      hostNotificationLang: 'es' as any,
      logConsole: false,
      popup: true,
      qrTimeout: 0,
    });

    // Handle connection status
    io.emit('status', 'CONNECTED');

    waClient.onMessage(async (message: any) => {
      if (message.body && !message.isGroupMsg) {
        console.log(`Received message from ${message.from}: ${message.body}`);

        // Notify frontend of new message
        io.emit('new_message', {
          id: message.id,
          from: message.from,
          body: message.body,
          fromMe: message.fromMe,
          timestamp: message.t,
          chatId: message.chatId,
          sender: message.sender.pushname || message.from
        });

        await waClient?.simulateTyping(message.from, true);
        const aiResponse = await getChatCompletion(message.body);
        await waClient?.simulateTyping(message.from, false);

        const sentMsg: any = await waClient?.sendText(message.from, aiResponse);

        // Notify frontend of AI response
        io.emit('new_message', {
          id: sentMsg,
          from: 'me',
          to: message.from,
          body: aiResponse,
          fromMe: true,
          timestamp: Math.floor(Date.now() / 1000),
          chatId: message.chatId
        });
      }
    });

    console.log('WhatsApp client is ready!');
    return waClient;
  } catch (error) {
    console.error('Error starting WhatsApp client:', error);
    io.emit('status', 'ERROR');
    throw error;
  }
}

export async function getChats() {
  if (!waClient) return [];
  return await waClient.getAllChats();
}

export async function getMessages(chatId: any) {
  if (!waClient) return [];
  const messages = await waClient.getAllMessagesInChat(chatId, true, true);
  return messages.map((m: any) => ({
    id: m.id,
    from: m.from,
    to: m.to,
    body: m.body,
    fromMe: m.fromMe,
    timestamp: m.t,
    chatId: m.chatId
  }));
}

export async function sendMessage(chatId: any, body: string) {
  if (!waClient) throw new Error('WhatsApp client not initialized');
  return await waClient.sendText(chatId, body);
}
