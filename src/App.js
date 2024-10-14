import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper, IconButton } from '@mui/material';
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

  // Function to handle submit
  const handleSubmit = async () => {
    if (!code && !prompt) {
      setError('One of the fields must be filled');
      return;
    } else {
      setError('');
    }

    try {
      setProcessing(true);
      const response = await fetch('http://localhost:8080/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, code }),
      });
      setProcessing(false);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUpdatedCode(data.updatedCode);
    } catch (error) {
      setError('An error occurred while processing the request: ' + error.message);
    }
  };

  // Function to paste clipboard content to code input
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  // Function to copy output code to clipboard
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
          'box-shadow': 'none',
        }}
      >
        <Grid container spacing={2} sx={{ height: '100%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          {/* Top section: Prompt input and Submit button */}
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
                resize: 'none',
                overflow: 'hidden',
              }}
              inputProps={{
                style: {
                  height: 'auto',
                  minHeight: '1.5rem', // Default for a single line
                },
              }}
              onInput={(e) => {
                e.target.style.height = 'auto'; // Reset height
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust based on content
              }}
            />

            <Button
              variant="contained"
              color="primary"
              disabled={processing}
              fullWidth
              onClick={handleSubmit}
              sx={{ padding: '1rem', fontSize: '1rem', marginBottom: '1rem' }}
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
