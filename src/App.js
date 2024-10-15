import React, { useState, useEffect } from 'react';
import "./App.css";
import { Box, Button, Grid, TextField, Typography, Paper, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CodePane = ({ label, value, onChange, readOnly, onActionClick, actionIcon, actionAlt, placeholder }) => {
  return (
    <Box sx={{ position: 'relative', flexGrow: 1, marginBottom: '20px' }}>
      <Typography variant="h6">{label}</Typography>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        InputProps={{
          readOnly: readOnly,
          autoComplete: 'off',
          spellCheck: false,
          style: {
            color: '#ffffff',
            fontSize: '13px',
            fontFamily: 'Courier New, monospace',
            overflowX: 'auto',
            dataEnableGrammarly: 'false',
            dataGramm: 'false',
            dataGramm_editor: 'false',
          },
          sx: {
            backgroundColor: '#2e2e2e',
            color: '#ffffff',
            fontFamily: 'Courier New, monospace',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cccccc',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#aaaaaa',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#aaaaaa',
            },
          },
        }}
        inputProps={{
          spellCheck: false,
          style: {
            overflowX: 'auto',
            dataEnableGrammarly: 'false',
            dataGramm: 'false',
            dataGramm_editor: 'false',
          },
        }}
        sx={{
          whiteSpace: 'nowrap',
          flexGrow: 1,
          '& .MuiInputBase-root': {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
          },
        }}
      />
      <IconButton
        onClick={onActionClick}
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: '#ffffff',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#555555', // Gray background on hover
          },
        }}
      >
        {actionIcon}
      </IconButton>
    </Box>
  );
};

const App = () => {
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [updatedCode, setUpdatedCode] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [model, setModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('openaiApiKey') || '');

  useEffect(() => {
    const handleResize = () => {
      window.location.reload();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (apiKey) {
      sessionStorage.setItem('openaiApiKey', apiKey);
    }
  }, [apiKey]);

  const handleSubmit = async () => {
    if (!code && !prompt) {
      setError('One of the fields must be filled');
      return;
    } else if (!apiKey) {
      setError('API key is required');
      return;
    } else {
      setError('');
    }

    try {
      setProcessing(true);
      const response = await fetch('http://backend:8080/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey};`,
        },
        body: JSON.stringify({ prompt, code, model }),
      });
      setProcessing(false);

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setUpdatedCode(data.updatedCode);
    } catch (error) {
      setProcessing(false);
      setError('Request Error: ' + error.message);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(updatedCode);
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          width: '95%',
          height: '85%',
          position: 'relative',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <Grid container spacing={2} sx={{ height: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
          {/* Top section: Prompt input */}
          <Grid item xs={12}>
            <TextField
              placeholder="Enter your prompt"
              multiline
              fullWidth
              variant="outlined"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '14px',
                borderRadius: '4px',
                marginBottom: '1rem',
              }}
              inputProps={{
                style: {
                  height: 'auto',
                  minHeight: '1.5rem',
                },
              }}
            />
          </Grid>

          {/* Row for API Key, Model Selection, and Submit Button */}
          <Grid item container xs={12} spacing={2}>
            <Grid item xs={6}>
              <TextField
                placeholder="OpenAI API Key"
                fullWidth
                variant="outlined"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '14px',
                  borderRadius: '4px',
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Select
                  labelId="model-select-label"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <MenuItem value="gpt-4o">gpt-4o</MenuItem>
                  <MenuItem value="gpt-4o-mini">gpt-4o-mini</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                disabled={processing}
                fullWidth
                onClick={handleSubmit}
                sx={{ padding: '1rem', fontSize: '1rem' }}
                style={{
                  backgroundColor: processing ? '#cccccc' : '#1976d2',
                }}
              >
                Submit
              </Button>
              {/* Display error if fields are empty */}
              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ marginTop: '0.5rem', textAlign: 'center' }}
                >
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Left section: Code input */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <CodePane
              label="Input Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onActionClick={handlePaste}
              actionIcon={<ContentPasteIcon />}
              actionAlt="Paste code"
              placeholder="Enter your code"
            />
          </Grid>

          {/* Right section: Output Code */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <CodePane
              label="Output Code"
              value={updatedCode}
              readOnly
              onActionClick={handleCopy}
              actionIcon={<ContentCopyIcon />}
              actionAlt="Copy code"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default App;
