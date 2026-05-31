import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

interface Message {
  id: string;
  body: string;
  fromMe: boolean;
  timestamp: number;
}

interface ChatWindowProps {
  messages: Message[];
  chatName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, chatName }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#e5ddd5' }}>
      <Paper elevation={1} sx={{ p: 2, bgcolor: '#075e54', color: 'white', borderRadius: 0 }}>
        <Typography variant="h6">{chatName}</Typography>
      </Paper>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                justifyContent: msg.fromMe ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  maxWidth: '70%',
                  bgcolor: msg.fromMe ? '#dcf8c6' : 'white',
                  borderRadius: 2,
                }}
              >
                <ListItemText
                  primary={msg.body}
                  secondary={new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatWindow;
