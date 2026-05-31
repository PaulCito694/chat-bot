import React from 'react';
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Divider, Typography } from '@mui/material';

interface Chat {
  id: string;
  name: string;
  lastMessage?: {
    body: string;
  };
}

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, selectedChatId }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto', height: '100%' }}>
      {chats.map((chat) => (
        <React.Fragment key={chat.id}>
          <ListItemButton
            alignItems="flex-start"
            selected={selectedChatId === chat.id}
            onClick={() => onSelectChat(chat.id)}
          >
            <ListItemAvatar>
              <Avatar alt={chat.name}>{chat.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                  noWrap
                >
                  {chat.lastMessage?.body || 'No messages'}
                </Typography>
              }
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ChatList;
