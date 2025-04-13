import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';

const SYSTEM_PROMPT = `You are Kavach.AI, a specialized security analysis assistant. Your purpose is to:
1. Help users understand security scan results and potential threats
2. Explain malware behavior and security concepts
3. Provide recommendations for addressing security issues
4. Use technical but clear language
5. Be concise and accurate in your responses
6. Focus only on cybersecurity and malware analysis topics

If asked about anything unrelated to cybersecurity or malicious software analysis, respond with: "I can only assist with security analysis and malware-related topics."`;

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: SYSTEM_PROMPT
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <Paper elevation={2} sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #0B4F6C 0%, #00B4D8 100%)',
        color: 'white',
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ 
            width: 48, 
            height: 48,
            bgcolor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.5)'
          }}>
            <SmartToy />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Security Assistant
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Ask me about security analysis and threats
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{
        flex: 1,
        p: 3,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
        },
      }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Card
              elevation={1}
              sx={{
                bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                borderRadius: msg.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" spacing={1.5} alignItems="start">
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: msg.role === 'user' ? 'primary.dark' : 'secondary.main',
                    }}
                  >
                    {msg.role === 'user' ? 'U' : <SmartToy fontSize="small" />}
                  </Avatar>
                  <Typography
                    color={msg.role === 'user' ? 'white' : 'text.primary'}
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.95rem',
                      lineHeight: 1.5
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      <Paper
        component="form"
        elevation={3}
        sx={{
          p: 2,
          mx: 3,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask about security analysis..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          variant="standard"
          InputProps={{ 
            disableUnderline: true,
            sx: { fontSize: '0.95rem' }
          }}
        />
        <IconButton 
          color="primary" 
          onClick={handleSend} 
          disabled={!input.trim() || loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
            },
          }}
        >
          <Send />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default ChatBot;
