# AnalytIQ Hub

A comprehensive data analytics platform that enables users to upload, explore, and visualize datasets from multiple sources with AI-powered analytics and customizable dashboards.

## 🚀 Features Implemented

### ✅ Core Infrastructure
- **Next.js 15** with TypeScript for modern web development
- **Tailwind CSS + shadcn/ui** for beautiful, responsive UI components
- **PostgreSQL** database with Prisma ORM for robust data management
- **Authentication system** with NextAuth.js for secure user access
- **Role-based access control** (Admin, Analyst, Viewer)

### ✅ Data Management
- **File Upload System** supporting CSV, Excel (.xls, .xlsx), and JSON formats
- **Automatic data type detection** and schema inference
- **Data quality scoring** and validation
- **Duplicate detection** and missing value analysis
- **Data preview** with sample rows and statistics

### ✅ Analytics & Visualization
- **Statistical analysis** engine with comprehensive metrics
- **Interactive charts** using Recharts:
  - Line charts for time series data
  - Bar charts for categorical comparisons
  - Pie charts for proportional data
- **Correlation analysis** between variables
- **Trend detection** and forecasting capabilities
- **Outlier detection** using statistical methods

### ✅ User Interface
- **Modern dashboard** with sidebar navigation
- **Responsive design** for mobile, tablet, and desktop
- **Intuitive upload interface** with drag-and-drop support
- **Real-time data processing** feedback
- **Error handling** and user-friendly messages

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Authentication**: NextAuth.js
- **File Processing**: CSV-parse, XLSX libraries
- **UI Components**: Radix UI primitives

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard area
│   ├── upload/           # File upload interface
│   └── api/              # API routes
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── charts/           # Data visualization components
├── lib/                  # Core utilities and configurations
│   ├── auth/            # Authentication configuration
│   ├── db/              # Database connection
│   ├── data-processing/ # Data processing pipeline
│   └── analytics/       # Statistical analysis functions
├── types/               # TypeScript type definitions
└── styles/              # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use the included Prisma Postgres)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd NexaData
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Usage

### 1. Create an Account
- Visit `/auth/register` to create a new account
- Default role: Analyst (can upload data and create dashboards)

### 2. Upload Data
- Navigate to `/upload`
- Drag and drop CSV, Excel, or JSON files
- View data preview and quality metrics
- Data is automatically processed and stored

### 3. Analyze Data
- View datasets on the dashboard
- Access statistical summaries
- Create visualizations with built-in chart components
- Export results and insights

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## 📋 Database Schema

The application uses the following main tables:

- **users** - User accounts with role-based permissions
- **data_sources** - Information about data upload sources
- **datasets** - Processed datasets with schema and metadata
- **dashboards** - User-created dashboards
- **analytics_jobs** - Background analytics processing jobs

## 🔐 Authentication & Security

- **Secure password hashing** with bcrypt
- **JWT-based sessions** with configurable expiration
- **Role-based access control** for different user types
- **CSRF protection** and secure cookies
- **File upload validation** and size limits (100MB max)

## 📈 Data Processing Pipeline

1. **File Upload** - Validate file type and size
2. **Parsing** - Extract data from CSV, Excel, or JSON
3. **Schema Inference** - Detect column types automatically
4. **Data Validation** - Clean and validate data entries
5. **Quality Scoring** - Calculate data quality metrics
6. **Storage** - Save processed data with metadata

## 🚧 Features in Development

- AI-powered predictive analytics
- Advanced anomaly detection algorithms
- Automated report generation
- Multi-language support (i18n)
- Database connection manager for external SQL sources
- Cloud storage integration (AWS S3, Google Cloud)
- Real-time collaboration features
- Advanced dashboard builder with drag-and-drop

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details
