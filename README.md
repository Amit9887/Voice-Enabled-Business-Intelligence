# Voice-Enabled Report Generation POC

A proof-of-concept application that demonstrates voice-enabled business intelligence capabilities. Users can generate reports through natural language voice commands, view data in interactive tables, and download reports in Excel format.

## 🎯 Features

- **Voice Commands**: Natural language processing for report generation
- **Automatic Date Extraction**: Intelligently parses dates from voice commands
- **Multi-format Output**: View data in tables or download Excel reports
- **Real-time Feedback**: Voice confirmation of actions and results
- **Interactive Dashboard**: Visual analytics with charts and metrics
- **Filter & Search**: Advanced filtering by date range, category, and region

## 🏗️ Architecture

```
Frontend (React.js)     Backend (Spring Boot)     Database (PostgreSQL)
     ↓                        ↓                         ↓
Voice Recognition → NLP Processing → Data Retrieval → Report Generation
     ↓                        ↓                         ↓
Speech Synthesis ← Response ← Report Export ← Data Analysis
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
Run the automated setup script that handles everything:

```bash
./setup.sh
```

This script will:
- ✅ Check all system requirements
- 🗄️ Set up PostgreSQL database with dummy data
- ⚙️ Build and start the Spring Boot backend
- 🎨 Set up and start the React frontend
- ✅ Verify all services are running correctly

### Option 2: Manual Setup
If you prefer manual setup:

#### Prerequisites
- Docker & Docker Compose
- Java 17+
- Node.js 16+
- Maven 3.6+
- npm

#### Database Setup
1. Start PostgreSQL with Docker:
```bash
docker-compose up -d postgres
```

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=postgres
spring.datasource.password=your_password
```

3. Build and run the Spring Boot application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🎤 Voice Commands

Try these example voice commands:

- **"Generate report from January 1st to March 31st"**
- **"Show me sales data from last month"**
- **"Create report for electronics category"**
- **"Generate report for North region from January to February"**
- **"Show sales data from December 2023 to February 2024"**

## 📊 API Endpoints

### Voice Command API
- `POST /api/voice/process` - Process voice commands
- `GET /api/voice/test` - Test endpoint

### Sales Data API
- `GET /api/sales/data` - Get all sales data
- `GET /api/sales/data/date-range?startDate=2024-01-01&endDate=2024-03-31` - Get data by date range
- `GET /api/sales/data/category/{category}` - Get data by category

## 🗂️ Project Structure

```
poc_voice/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/voicepoc/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── model/       # Entity models
│   │       └── dto/         # Data transfer objects
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # React.js application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── App.js          # Main application
│   └── package.json
├── database/                # Database setup
│   └── setup.sql
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- Database connection settings in `application.properties`
- Report generation directory: `reports/`
- CORS enabled for frontend communication

### Frontend Configuration
- API base URL: `http://localhost:8080/api`
- Voice recognition language: English (en-US)
- Chart library: Recharts
- UI framework: Material-UI

## 🌐 Access URLs
- 🎤 **Frontend (Voice Interface)**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080
- 🗄️ **Database**: localhost:5432

📖 **For detailed setup instructions, see [QUICK_START.md](QUICK_START.md)**

## 📈 Sample Data

The application includes 200 sample sales records with:
- **Products**: Electronics, Clothing, Books, Furniture, Sports items
- **Time Range**: Last 12 months
- **Regions**: North, South, East, West, Central
- **Customers**: 15 different customer names

## 🎯 Business Use Cases

1. **Sales Analysis**: Generate monthly/quarterly sales reports
2. **Category Performance**: Analyze sales by product category
3. **Regional Insights**: Compare performance across regions
4. **Customer Analytics**: Track customer purchase patterns
5. **Executive Reporting**: Voice-enabled executive dashboards

## 🔍 Technical Features

- **Natural Language Processing**: Date extraction and command interpretation
- **Voice Recognition**: Web Speech API integration
- **Report Generation**: Excel export with Apache POI
- **Real-time Analytics**: Interactive charts and visualizations
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Production Considerations

1. **Security**: Add authentication and authorization
2. **Performance**: Implement caching and pagination
3. **Scalability**: Add load balancing and clustering
4. **Monitoring**: Integrate logging and metrics
5. **CI/CD**: Set up automated deployment pipeline

### Docker Deployment (Optional)

Create `docker-compose.yml` for containerized deployment:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: voice_report_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
  
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 📝 License

This is a proof-of-concept project for demonstration purposes.

## 🤝 Contributing

This is a POC project. For production use, consider:
- Adding comprehensive test coverage
- Implementing proper security measures
- Adding more sophisticated NLP capabilities
- Integrating with enterprise systems
- Adding more report formats (PDF, CSV, etc.)
