import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Alert,
  Divider
} from '@mui/material';
import {
  Download,
  CalendarToday,
  Category,
  LocationOn,
  Assessment
} from '@mui/icons-material';

const ReportHistory = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          📋 Report History
        </Typography>
        
        <Alert severity="info">
          No reports generated yet. Use the Voice Commands tab to generate your first report!
        </Alert>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalSales = (salesData) => {
    return salesData.reduce((total, item) => total + parseFloat(item.totalAmount), 0);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📋 Report History
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        View and download previously generated reports from voice commands.
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">
                    Report #{index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generated: {formatDate(new Date())}
                  </Typography>
                </Box>

                <Typography variant="body2" paragraph>
                  <strong>Command:</strong> "{report.interpretedCommand}"
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="primary" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Date Range
                        </Typography>
                        <Typography variant="body2">
                          {report.startDate} to {report.endDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assessment color="secondary" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Records Found
                        </Typography>
                        <Typography variant="body2">
                          {report.salesData?.length || 0} sales records
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {report.category && (
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Category color="success" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Category
                          </Typography>
                          <Typography variant="body2">
                            {report.category}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {report.region && (
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="warning" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Region
                          </Typography>
                          <Typography variant="body2">
                            {report.region}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {report.salesData && report.salesData.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Summary:
                    </Typography>
                    <Typography variant="body2">
                      Total Sales: <strong>{formatCurrency(getTotalSales(report.salesData))}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Average Order Value: <strong>{formatCurrency(getTotalSales(report.salesData) / report.salesData.length)}</strong>
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label={`From: ${report.startDate}`} color="primary" variant="outlined" size="small" />
                  <Chip label={`To: ${report.endDate}`} color="primary" variant="outlined" size="small" />
                  {report.category && <Chip label={`Category: ${report.category}`} color="secondary" variant="outlined" size="small" />}
                  {report.region && <Chip label={`Region: ${report.region}`} color="secondary" variant="outlined" size="small" />}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Alert severity={report.success ? "success" : "error"} sx={{ flexGrow: 1, mr: 2 }}>
                    {report.message}
                  </Alert>
                  
                  {report.reportUrl && (
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => {
                        const filename = report.reportUrl.split('/').pop();
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportHistory;
