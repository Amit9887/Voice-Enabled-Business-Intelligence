# 🚀 Voice-Enabled Report Generation POC - Quick Start Guide

## 📋 Prerequisites

Before running the setup, ensure you have the following installed:

### Required Software
- **Docker** (v20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+) - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Java 17+** - [Install Java](https://adoptium.net/)
- **Maven 3.6+** - [Install Maven](https://maven.apache.org/install.html)
- **Node.js 16+** - [Install Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

## 🎯 One-Command Setup

### For Unix/Linux/macOS:
```bash
./setup.sh
```

### For Windows (PowerShell):
```powershell
bash setup.sh
```

## 📖 What the Setup Script Does

The setup script automatically:

1. ✅ **Checks Requirements** - Verifies all required software is installed
2. 🧹 **Cleans Up** - Removes any existing containers and data
3. 🗄️ **Sets Up Database** - Starts PostgreSQL with dummy data
4. ⚙️ **Builds Backend** - Compiles Spring Boot application
5. 🎨 **Sets Up Frontend** - Installs React dependencies
6. 🚀 **Starts Services** - Launches all components
7. ✅ **Verifies Setup** - Tests all connections and APIs

## 🌐 Access Your Application

After successful setup, access your application at:

- **🎤 Frontend (Voice Interface)**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8080
- **🗄️ Database**: localhost:5432

## 🎤 Voice Commands to Try

Once the application is running, try these voice commands:

### Category Reports
- *"Generate report for clothing category"*
- *"Generate report for electronics category"*
- *"Generate report for books category"*
- *"Generate report for furniture category"*
- *"Generate report for sports category"*

### Regional Reports
- *"Generate report for North region"*
- *"Generate report for South region"*
- *"Generate report for East region"*
- *"Generate report for West region"*
- *"Generate report for Central region"*

### Date Range Reports
- *"Generate report from January to March"*
- *"Generate report from last month"*
- *"Generate report from last quarter"*

### Combined Filters
- *"Generate report for clothing category from North region"*
- *"Generate report for electronics from last month"*
- *"Generate report for books category from January to March"*

## 🛠️ Management Commands

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose down
docker-compose up --build -d
```

## 📁 Project Structure

```
poc_voice/
├── frontend/           # React.js frontend
├── backend/           # Spring Boot backend
├── database/          # Database setup scripts
├── docker-compose.yml # Container orchestration
├── setup.sh          # Automated setup script
├── start.sh          # Manual start script
└── README.md         # Detailed documentation
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :8080  # Backend
lsof -i :5432  # Database

# Kill processes if needed
kill -9 <PID>
```

#### 2. Docker Issues
```bash
# Restart Docker service
sudo systemctl restart docker  # Linux
# or restart Docker Desktop on Windows/Mac

# Clean Docker cache
docker system prune -a
```

#### 3. Database Connection Issues
```bash
# Check if database is running
docker-compose ps

# Restart database
docker-compose restart postgres
```

#### 4. Build Failures
```bash
# Clean and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Getting Help

If you encounter issues:

1. **Check the logs**: `docker-compose logs -f`
2. **Verify requirements**: Ensure all prerequisites are installed
3. **Clean restart**: Run `docker-compose down` then `./setup.sh`
4. **Check ports**: Ensure ports 3000, 8080, and 5432 are available

## 🎉 Success Indicators

You'll know the setup is successful when:

- ✅ All services start without errors
- ✅ Frontend loads at http://localhost:3000
- ✅ Backend API responds at http://localhost:8080/api/voice/test
- ✅ Voice commands work and generate reports
- ✅ Reports can be downloaded as Excel files

## 📊 Features Overview

- **🎤 Voice Recognition**: Natural language processing for commands
- **📊 Data Visualization**: Charts and tables for sales data
- **📈 Report Generation**: Excel reports with filtering
- **🔍 Advanced Filtering**: By category, region, and date ranges
- **💾 Data Persistence**: PostgreSQL database with dummy data
- **📱 Responsive UI**: Works on desktop and mobile browsers

## 🚀 Next Steps

After successful setup:

1. **Explore the UI** - Navigate through different tabs
2. **Try Voice Commands** - Test various voice commands
3. **Generate Reports** - Create and download Excel reports
4. **View Analytics** - Check the dashboard for insights
5. **Customize Data** - Modify dummy data in the database

---

**🎯 Ready to start? Run `./setup.sh` and enjoy your voice-enabled reporting system!**
