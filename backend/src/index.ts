import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { startWhatsApp, getWhatsAppClient } from './whatsapp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/chats', async (req, res) => {
  const client = getWhatsAppClient();
  if (!client) {
    return res.status(503).json({ error: 'WhatsApp client not ready' });
  }
  try {
    const chats = await client.getAllChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

app.get('/chats/:id/messages', async (req, res) => {
  const client = getWhatsAppClient();
  if (!client) {
    return res.status(503).json({ error: 'WhatsApp client not ready' });
  }
  try {
    const messages = await client.getAllMessagesInChat(req.params.id as any, true, true);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await startWhatsApp(io);
  } catch (error) {
    console.error('Failed to start WhatsApp client on startup:', error);
  }
});
