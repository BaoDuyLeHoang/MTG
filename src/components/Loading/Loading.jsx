import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const Loading = ({ 
  text = "Đang tải...",
  size = 56,
  color = '#4F46E5',
  fullScreen = false 
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...(fullScreen ? {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: theme.zIndex.modal + 1,
        } : {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
        }),
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.9)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      >
        {/* Background Circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={4}
          sx={{
            color: theme.palette.grey[200],
          }}
        />
        {/* Primary Progress */}
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
            '@keyframes pulse': {
              '0%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.6,
              },
              '100%': {
                opacity: 1,
              },
            },
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: color,
          marginTop: 2,
          fontWeight: 500,
          letterSpacing: '0.5px',
          opacity: 0.9,
          animation: 'slideUp 0.5s ease-out',
          '@keyframes slideUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(10px)',
            },
            '100%': {
              opacity: 0.9,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default Loading;