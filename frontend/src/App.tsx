import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  TextField,
  Button,
  Avatar,
  CircularProgress
} from '@mui/material';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8002');

interface Message {
  id?: string;
  from: string;
  to?: string;
  body: string;
  sender?: any;
  fromMe: boolean;
  timestamp: number;
  chatId: string;
}

interface Chat {
  id: {
    _serialized: string;
  };
  name: string;
  lastMessage?: any;
}

const App: React.FC = () => {
  const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTED' | 'ERROR'>('DISCONNECTED');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('status', (newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'CONNECTED') {
        setQrCode(null);
        fetchChats();
      }
    });

    socket.on('qr', (qr) => {
      setQrCode(qr);
    });

    socket.on('new_message', (msg) => {
      if (selectedChat && (msg.chatId === selectedChat || msg.from === selectedChat || msg.to === selectedChat)) {
        setMessages((prev) => [...prev, msg]);
      }

      // Update last message in chats list
      setChats((prevChats) =>
        prevChats.map(chat =>
          chat.id._serialized === msg.chatId
            ? { ...chat, lastMessage: msg }
            : chat
        )
      );
    });

    return () => {
      socket.off('status');
      socket.off('qr');
      socket.off('new_message');
    };
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:8002/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setSelectedChat(chatId);
      const response = await axios.get(`http://localhost:8002/chats/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await axios.post(`http://localhost:8002/chats/${selectedChat}/messages`, {
        body: newMessage
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (status === 'DISCONNECTED') {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Conectando a WhatsApp...</Typography>
          {qrCode ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>Escanea el código QR para iniciar sesión:</Typography>
              <img src={qrCode} alt="WhatsApp QR Code" style={{ width: '100%', maxWidth: '300px' }} />
            </Box>
          ) : (
            <>
              <CircularProgress sx={{ my: 2 }} />
              <Typography variant="body2">
                Iniciando motor de WhatsApp. Por favor, espera...
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: '80vh', display: 'flex' }}>
      <Paper elevation={3} sx={{ width: '30%', height: '100%', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>Chats</Typography>
        <List>
          {chats.map((chat) => (
            <React.Fragment key={chat.id._serialized}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedChat === chat.id._serialized}
                  onClick={() => fetchMessages(chat.id._serialized)}
                >
                  <Avatar sx={{ mr: 2 }}>{chat.name ? chat.name[0] : '?'}</Avatar>
                  <ListItemText
                    primary={chat.name || 'Sin nombre'}
                    secondary={chat.lastMessage?.body?.substring(0, 30)}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ width: '70%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', backgroundColor: '#e5ddd5' }}>
          {selectedChat ? (
            <>
              {messages.map((msg, index) => (
                <Box
                  key={msg.id || index}
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: msg.fromMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper sx={{ p: 1, maxWidth: '70%', backgroundColor: msg.fromMe ? '#dcf8c6' : '#fff' }}>
                    <Typography variant="body1">{msg.body}</Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'right' }}>
                      {new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="textSecondary">Selecciona un chat para empezar</Typography>
            </Box>
          )}
        </Box>
        {selectedChat && (
          <Box sx={{ p: 2, backgroundColor: '#f0f0f0', display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escribe un mensaje"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              size="small"
              sx={{ mr: 1, backgroundColor: '#fff' }}
            />
            <Button variant="contained" color="primary" onClick={handleSend}>Enviar</Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
