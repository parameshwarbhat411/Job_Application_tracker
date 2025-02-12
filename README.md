# Job Application Tracking System

A comprehensive job application tracking system designed to streamline and enhance the job search process. This application helps modern job seekers manage their job applications efficiently with intelligent tools and insights to optimize career development.

## Features

- 📋 Track job applications with detailed status tracking
- 📅 Calendar view for application deadlines and interviews
- 📊 Analytics dashboard for application insights
- 🤖 AI-powered ATS (Applicant Tracking System) analysis
- 📱 Responsive design for all devices
- 🎨 Customizable theme options
- 🔒 Secure authentication system
- 💾 Real-time data persistence

### Theme Customization

The application supports rich theme customization through the `theme.json` configuration:

```json
{
  "variant": "professional",
  "primary": "hsl(222.2 47.4% 11.2%)",
  "appearance": "light",
  "radius": 0.5
}
```

Available options:
- **Variants**: 
  - `professional` - Clean, corporate look
  - `tint` - Subtle color variations
  - `vibrant` - Bold, modern appearance
- **Appearance**: 
  - `light` - Light mode
  - `dark` - Dark mode
  - `system` - Follows system preference
- **Radius**: Customize component border radius (0-1)
- **Primary Color**: Any valid HSL color value

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui for UI components
- Framer Motion for animations
- OpenAI API for ATS analysis
- Firebase Authentication
- Wouter for routing

### Styling System

The application uses a sophisticated styling system combining Tailwind CSS with shadcn/ui components. Here's how it works:

```ts
// tailwind.config.ts configuration
{
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other color configurations
      }
    }
  }
}
```

Key styling features:
- CSS variables for dynamic theming
- Dark mode support via class-based switching
- Responsive design utilities
- Custom component variants
- Automatic class sorting and optimization

### Backend
- Express.js
- PostgreSQL with Drizzle ORM
- WebSocket support for real-time updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20.x or higher)
- npm (v10.x or higher)
- PostgreSQL (v15.x or higher)

## Package Dependencies

The application requires the following key packages:

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.60.5",
    "express": "^4.21.2",
    "drizzle-orm": "^0.38.2",
    "openai": "latest",
    "firebase": "latest",
    "tailwindcss": "^3.4.14",
    "framer-motion": "^11.13.1",
    "wouter": "^3.3.5"
  }
}
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd job-tracking-app
```

2. Install dependencies:
```bash
npm install
```

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>

# OpenAI API (for ATS analysis)
OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_API_KEY=${OPENAI_API_KEY}

# Firebase Config (for authentication)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

### Setting up OpenAI API
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with 'sk-')
4. Add it to your .env file as OPENAI_API_KEY

## Database Setup

1. Create a PostgreSQL database
2. Set the DATABASE_URL in your .env file
3. Push the schema to your database:
```bash
npm run db:push
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript files
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and services
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── db/                    # Database configuration and schemas
├── server/                # Backend application
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── drizzle.config.ts     # Drizzle ORM configuration
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Common Issues and Troubleshooting

### 1. Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL environment variable format
- Ensure database exists and is accessible
- Run `npm run db:push` to ensure schema is up to date

### 2. OpenAI API Issues
- Verify OPENAI_API_KEY is set correctly in both root and client/.env
- Check OpenAI API quota and limits
- Ensure job description is detailed enough (>50 characters)
- Check browser console for specific error messages

### 3. Build Issues
- Clear node_modules and package-lock.json
- Run npm install fresh
- Verify Node.js version compatibility
- Check for TypeScript errors with `npm run check`

### 4. Development Server Issues
- Ensure port 5000 is not in use
- Check if all environment variables are set
- Verify that PostgreSQL service is running
- Look for error messages in the terminal



## Deployment

# Docker Deployment Guide

## Prerequisites

Before deploying with Docker, ensure you have:
- Docker installed (version 20.10.0 or higher)
- Docker Compose installed (version 2.0.0 or higher)
- At least 2GB of free RAM
- 1GB of free disk space

## Quick Start

1. Clone the repository and navigate to it:
```bash
git clone <repository-url>
cd job-tracking-app
```

2. Create environment files:

Create `.env` in the root directory:
```env
# Required for AI features
OPENAI_API_KEY=your_openai_api_key

# Optional: Override default PostgreSQL settings
POSTGRES_USER=custom_user
POSTGRES_PASSWORD=custom_password
POSTGRES_DB=custom_dbname
```

3. Build and start the application:
```bash
docker-compose up -d --build
```

4. Initialize the database:
```bash
docker-compose exec app npm run db:push
```

The application will be available at `http://localhost:5000`

## Container Architecture

The application uses a multi-container setup with Docker Compose:

### Application Container (app)
- Based on Node.js 20
- Uses multi-stage build for optimization
- Runs on port 5000
- Dependencies:
  - React 18
  - Express.js
  - PostgreSQL client
  - Other Node.js packages

### Database Container (db)
- PostgreSQL 16
- Persistent volume storage
- Default port: 5432
- Automatic database initialization
- Regular backups (optional)

## Docker Configuration Files

### Dockerfile
Multi-stage build process:
```dockerfile
# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db
COPY --from=builder /app/server ./server
EXPOSE 5000
CMD ["npm", "run", "start"]
```

### docker-compose.yml
Service definitions:
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      target: production
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/jobtracker
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=jobtracker
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Maintenance
```bash
# Database backup
docker-compose exec db pg_dump -U postgres jobtracker > backup.sql

# Database restore
docker-compose exec -T db psql -U postgres jobtracker < backup.sql

# Check container health
docker-compose ps

# View resource usage
docker stats
```

## Troubleshooting

### Common Issues

1. **Container Won't Start**
   - Check logs: `docker-compose logs app`
   - Verify environment variables
   - Check port availability

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check if database is ready
   - Confirm network connectivity

3. **Performance Problems**
   - Monitor resource usage
   - Check for memory leaks
   - Optimize database queries

### Debug Commands
```bash
# Check container logs
docker-compose logs -f app

# Inspect container
docker inspect <container_id>

# View network status
docker network ls

# Check volume status
docker volume ls
```

## Scaling and Advanced Configuration

### Load Balancing
```yaml
# Example docker-compose override for scaling
services:
  app:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
```

### Backup Strategy
```bash
# Automated backup script
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
docker-compose exec -T db pg_dump -U postgres jobtracker > "backup_${TIMESTAMP}.sql"
```

## Support

For support, please:
1. Check this documentation
2. Search existing issues
3. Create a new issue if needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.
