import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { salesApi } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAllSalesData();
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const getCategorySales = () => {
    const categoryMap = {};
    salesData.forEach(item => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = 0;
      }
      categoryMap[item.category] += parseFloat(item.totalAmount);
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100
    }));
  };

  const getRegionSales = () => {
    const regionMap = {};
    salesData.forEach(item => {
      if (!regionMap[item.region]) {
        regionMap[item.region] = 0;
      }
      regionMap[item.region] += parseFloat(item.totalAmount);
    });

    return Object.entries(regionMap).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100
    }));
  };

  const getMonthlySales = () => {
    const monthlyMap = {};
    salesData.forEach(item => {
      const date = new Date(item.salesDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = 0;
      }
      monthlyMap[monthKey] += parseFloat(item.totalAmount);
    });

    return Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100
      }));
  };

  const getTotalSales = () => {
    return salesData.reduce((total, item) => total + parseFloat(item.totalAmount), 0);
  };

  const getTotalOrders = () => {
    return salesData.length;
  };

  const getAverageOrderValue = () => {
    const total = getTotalSales();
    const orders = getTotalOrders();
    return orders > 0 ? Math.round((total / orders) * 100) / 100 : 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  const categoryData = getCategorySales();
  const regionData = getRegionSales();
  const monthlyData = getMonthlySales();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📈 Sales Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4">
                ${getTotalSales().toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">
                {getTotalOrders().toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Order Value
              </Typography>
              <Typography variant="h4">
                ${getAverageOrderValue().toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h4">
                {categoryData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Region
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Sales Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
