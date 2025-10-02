import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { salesApi } from '../services/api';

const SalesDataTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const categories = ['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports'];

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      let data;
      
      if (startDate && endDate) {
        data = await salesApi.getSalesDataByDateRange(startDate, endDate);
      } else if (filterCategory) {
        data = await salesApi.getSalesDataByCategory(filterCategory);
      } else {
        data = await salesApi.getAllSalesData();
      }
      
      setSalesData(data.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = () => {
    setPage(0);
    fetchSalesData();
  };

  const clearFilters = () => {
    setFilterCategory('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
    fetchSalesData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'primary',
      'Clothing': 'secondary',
      'Books': 'success',
      'Furniture': 'warning',
      'Sports': 'info'
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📊 Sales Data Table
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              onClick={handleFilterChange}
              sx={{ mr: 1 }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sales Date</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Region</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.category}
                        color={getCategoryColor(row.category)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.salesDate)}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{formatCurrency(row.unitPrice)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(row.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.region}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={salesData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default SalesDataTable;
