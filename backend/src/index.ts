import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { startWhatsApp, getChats, getMessages, sendMessage } from './whatsapp.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/chats', async (req, res) => {
  try {
    const chats = await getChats();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

app.get('/chats/:id/messages', async (req, res) => {
  try {
    const messages = await getMessages(req.params.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/chats/:id/messages', async (req, res) => {
  try {
    const { body } = req.body;
    const result = await sendMessage(req.params.id, body);
    res.json(result);

    // Also emit the message to the frontend via socket
    io.emit('new_message', {
      id: result,
      from: 'me',
      to: req.params.id,
      body: body,
      fromMe: true,
      timestamp: Math.floor(Date.now() / 1000),
      chatId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected to socket');
});

httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await startWhatsApp(io);
  } catch (error) {
    console.error('Failed to start WhatsApp client on startup:', error);
  }
});
