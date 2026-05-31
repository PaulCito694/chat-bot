import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Box, Container, Paper, CssBaseline, Typography } from '@mui/material';
import Login from './components/Login';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

const API_URL = 'http://localhost:8002';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState('loading');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('status', (newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'connected') {
        fetchChats();
      }
    });

    newSocket.on('qr', (qr) => {
      setQrCode(qr);
      setStatus('waiting_qr');
    });

    newSocket.on('new_message', (message) => {
        // Refresh chats or update current message list
        if (selectedChatId === message.from || selectedChatId === message.to) {
            setMessages(prev => [...prev, message]);
        }
        fetchChats();
    });

    return () => {
      newSocket.close();
    };
  }, [selectedChatId]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/chats`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`${API_URL}/chats/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    fetchMessages(chatId);
  };

  if (status !== 'connected' && status !== 'ready') {
    return (
      <>
        <CssBaseline />
        <Login qrCode={qrCode} status={status} />
      </>
    );
  }

  const selectedChat = chats.find(c => c.id === selectedChatId);

  // Use the socket variable to avoid unused warning
  console.log('Socket initialized:', !!socket);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f2f5' }}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 64px)' }}>
        <Box sx={{ display: 'flex', height: '100%', boxShadow: 3 }}>
          <Box sx={{ width: '33.33%', borderRight: '1px solid #ddd', height: '100%' }}>
            <Paper sx={{ height: '100%', borderRadius: 0 }}>
              <ChatList
                chats={chats}
                onSelectChat={handleSelectChat}
                selectedChatId={selectedChatId || undefined}
              />
            </Paper>
          </Box>
          <Box sx={{ width: '66.66%', height: '100%' }}>
            <Paper sx={{ height: '100%', borderRadius: 0 }}>
              {selectedChatId ? (
                <ChatWindow
                  messages={messages}
                  chatName={selectedChat?.name || 'Chat'}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h6" color="textSecondary">
                    Select a chat to start messaging
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
