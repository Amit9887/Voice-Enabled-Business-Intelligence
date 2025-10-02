import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import VoiceRecorder from './components/VoiceRecorder';
import SalesDataTable from './components/SalesDataTable';
import ReportHistory from './components/ReportHistory';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const addReport = (report) => {
    setReports(prev => [report, ...prev]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🎤 Voice Report Generator
          </Typography>
          <Typography variant="subtitle1">
            POC - Voice-Enabled Business Intelligence
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="main navigation">
              <Tab label="Voice Commands" />
              <Tab label="Sales Data" />
              <Tab label="Dashboard" />
              <Tab label="Report History" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <VoiceRecorder onReportGenerated={addReport} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SalesDataTable />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Dashboard />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <ReportHistory reports={reports} />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
