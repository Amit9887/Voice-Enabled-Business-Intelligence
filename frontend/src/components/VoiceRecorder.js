import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Mic,
  MicOff,
  Stop,
  PlayArrow,
  Download,
  Refresh
} from '@mui/icons-material';
import { voiceApi } from '../services/api';

const VoiceRecorder = ({ onReportGenerated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Voice recognition started');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (transcript.trim()) {
          processVoiceCommand(transcript);
        }
      };
    } else {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, [transcript]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setError('');
      setTranscript('');
      setResponse(null);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  };

  const processVoiceCommand = async (command) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    setLastCommand(command);
    
    try {
      const result = await voiceApi.processVoiceCommand({ command });
      setResponse(result.data);
      
      if (result.data.success) {
        speak(`Report generated successfully. Found ${result.data.salesData?.length || 0} records.`);
        onReportGenerated(result.data);
      } else {
        speak(`Error: ${result.data.message}`);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      setError('Failed to process voice command. Please try again.');
      speak('Sorry, I could not process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextCommand = () => {
    if (transcript.trim()) {
      processVoiceCommand(transcript);
    }
  };

  const exampleCommands = [
    "Generate report from January 1st to March 31st",
    "Show me sales data from last month",
    "Create report for electronics category",
    "Generate report for North region from January to February",
    "Show sales data from December 2023 to February 2024"
  ];

  const invalidCommandExamples = [
    "Hello there", // Too generic
    "What's the weather", // Not report-related
    "Play music", // Not business-related
    "Open browser", // Not valid command
    "Tell me a joke" // Not report-related
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🎤 Voice-Enabled Report Generation
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Click the microphone button and speak your report request. The system will automatically 
        extract dates, categories, and regions from your voice command.
      </Typography>

      {!isSupported && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Voice recognition is not supported in this browser. Please use Chrome or Edge for the best experience.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voice Command Interface
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
                  <IconButton
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!isSupported || isProcessing}
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: isRecording ? 'error.main' : 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: isRecording ? 'error.dark' : 'primary.dark',
                      },
                      animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                    }}
                  >
                    {isRecording ? <Stop /> : <Mic />}
                  </IconButton>
                </Tooltip>

                <Box>
                  <Typography variant="h6">
                    {isRecording ? "Listening..." : "Click to speak"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isProcessing ? "Processing your command..." : "Say something like 'Generate report from January to March'"}
                  </Typography>
                </Box>

                {isProcessing && <CircularProgress size={24} />}
              </Box>

              <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Command:
                </Typography>
                <Typography variant="body1">
                  {transcript || "No command recorded yet"}
                </Typography>
              </Paper>

              <Button
                variant="contained"
                onClick={handleTextCommand}
                disabled={!transcript.trim() || isProcessing}
                startIcon={<PlayArrow />}
                sx={{ mr: 2 }}
              >
                Process Command
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setTranscript('');
                  setResponse(null);
                  setError('');
                }}
                startIcon={<Refresh />}
              >
                Clear
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Example Commands
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {exampleCommands.map((cmd, index) => (
                  <Chip
                    key={index}
                    label={cmd}
                    variant="outlined"
                    onClick={() => setTranscript(cmd)}
                    sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Help Section */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                ✅ Valid Commands
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use these keywords in your commands:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {["generate", "create", "show", "report", "sales", "data"].map((word) => (
                  <Chip key={word} label={word} size="small" color="primary" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                ❌ Invalid Commands
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These won't work (click to try):
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {invalidCommandExamples.map((cmd, index) => (
                  <Chip
                    key={index}
                    label={cmd}
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setTranscript(cmd)}
                    sx={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {response && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Command Result
            </Typography>
            
            <Alert severity={response.success ? "success" : "error"} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {response.message}
              </Typography>
            </Alert>

            {response.success && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Interpreted Command: {response.interpretedCommand}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={`From: ${response.startDate}`} color="primary" variant="outlined" />
                  <Chip label={`To: ${response.endDate}`} color="primary" variant="outlined" />
                  {response.category && <Chip label={`Category: ${response.category}`} color="secondary" variant="outlined" />}
                  {response.region && <Chip label={`Region: ${response.region}`} color="secondary" variant="outlined" />}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Found {response.salesData?.length || 0} sales records
                </Typography>

                {response.reportUrl && (
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    sx={{ mt: 2 }}
                    onClick={() => {
                      const filename = response.reportUrl.split('/').pop();
                      const link = document.createElement('a');
                      link.href = `http://localhost:8080/api/voice/download/${filename}`;
                      link.download = filename;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Report
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VoiceRecorder;
