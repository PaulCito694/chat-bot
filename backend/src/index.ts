import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startWhatsApp } from './whatsapp.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await startWhatsApp();
  } catch (error) {
    console.error('Failed to start WhatsApp client on startup:', error);
  }
});
