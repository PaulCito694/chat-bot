import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

interface LoginProps {
  qrCode: string | null;
  status: string;
}

const Login: React.FC<LoginProps> = ({ qrCode, status }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" gutterBottom>
          WhatsApp Login
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
          {status === 'loading'
            ? 'Initializing WhatsApp client...'
            : 'Scan the QR code with your phone to start.'}
        </Typography>

        {qrCode ? (
          <Box
            component="img"
            src={qrCode}
            alt="QR Code"
            sx={{ width: 256, height: 256, border: '1px solid #ddd' }}
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256, width: 256 }}>
            <CircularProgress />
          </Box>
        )}

        <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
          Status: {status}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
