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

## Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier configurations
   - Follow component naming conventions
   - Keep components small and focused

2. **State Management**
   - Use React Query for server state
   - Use local state for UI-only state
   - Follow the container/presenter pattern
   - Implement proper error boundaries

3. **Performance**
   - Implement proper memoization
   - Use lazy loading for routes
   - Optimize images and assets
   - Monitor bundle size

4. **Security**
   - Never commit .env files
   - Implement proper authentication checks
   - Sanitize user inputs
   - Use HTTPS in production

## Deployment

### Deploying on Replit

This application is configured for deployment on Replit. The `.replit` configuration includes:

```toml
modules = ["nodejs-20", "web", "postgresql-16"]
run = "npm run dev"
hidden = [".config", ".git", "generated-icon.png", "node_modules", "dist"]

[nix]
channel = "stable-24_05"

[deployment]
deploymentTarget = "cloudrun"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

[[ports]]
localPort = 5000
externalPort = 80
```

To deploy on Replit:

1. Fork this repository to your Replit account
2. Set up the required environment variables in your Replit Secrets:
   - DATABASE_URL
   - OPENAI_API_KEY
   - Firebase configuration variables
3. The application will automatically:
   - Install Node.js 20 and PostgreSQL 16
   - Set up the development environment
   - Start the development server on port 5000

### Production Deployment

For production deployment:
1. Ensure all environment variables are correctly set
2. Run `npm run build` to create the production build
3. Start the server using `npm run start`
4. The application will be available on the configured port (default: 5000)

## Docker Deployment

The application can be deployed using Docker. Here's how to run it:

1. Build and start the containers:
```bash
docker-compose up -d --build
```

2. Set up environment variables:
Create a `.env` file in the root directory with:
```env
OPENAI_API_KEY=your_openai_api_key
```

3. Initialize the database:
```bash
# Wait for the database to be ready
docker-compose exec app npm run db:push
```

4. Access the application:
The application will be available at `http://localhost:5000`

### Docker Commands

- Start containers: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild containers: `docker-compose up -d --build`
- Remove volumes: `docker-compose down -v`

### Container Architecture

The Docker setup includes:
- **App Container**: Node.js application
  - Production-optimized multi-stage build
  - Runs on port 5000
  - Connects to PostgreSQL container
- **Database Container**: PostgreSQL 16
  - Persistent volume for data storage
  - Runs on port 5432
  - Preconfigured for the application

### Production Considerations

1. **Security**:
   - Change default database credentials
   - Use Docker secrets for sensitive data
   - Configure proper networking rules

2. **Scaling**:
   - Configure container health checks
   - Set up proper resource limits
   - Use container orchestration for multiple instances

3. **Monitoring**:
   - Set up container logging
   - Monitor resource usage
   - Configure alerting


## Support

For support, please:
1. Check this documentation
2. Search existing issues
3. Create a new issue if needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.