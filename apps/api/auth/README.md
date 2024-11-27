# Auth Service

## Overview
The Auth Service is a microservice responsible for authentication and authorization in the Advanced Learning Management System. It provides secure user management, authentication, and role-based access control with support for both local and social authentication methods.

## Features
- User registration and authentication
- Social authentication (Google, Facebook)
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Instructor, Student)
- Password management with bcrypt
- Email verification
- Swagger API documentation

## Tech Stack
- NestJS - A progressive Node.js framework
- Drizzle ORM - Modern TypeScript ORM
- Neon DB - Serverless Postgres
- Passport.js - Authentication middleware
- JWT - Token-based authentication
- Class Validator - Request validation
- Swagger - API documentation

## Prerequisites
- Node.js >= 18
- pnpm (recommended package manager)
- Neon DB account

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
# App Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="your-neon-db-connection-string"

# JWT Configuration
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Social Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=your-email@gmail.com
```

## Running the Service

### Development
```bash
# Start in development mode
pnpm run dev

# Run database migrations
pnpm run db:generate
pnpm run db:migrate
```

### Production
```bash
pnpm run build
pnpm run start:prod
```

## API Documentation
Once the service is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

- `POST /api/auth/login` - Login with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```

- `POST /api/auth/refresh-token` - Refresh access token
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

- `GET /api/auth/profile` - Get current user profile (Protected)

### Social Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback

### Response Format
Successful authentication returns:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "isEmailVerified": "false",
    "provider": null,
    "avatarUrl": null,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

## Authentication Flow

### Registration
1. Client sends POST request to `/api/auth/register`
2. Service validates input and checks for existing email
3. Creates new user with bcrypt hashed password
4. Returns JWT tokens (access + refresh) and user data

### Login
1. Client sends credentials to `/api/auth/login`
2. Service validates credentials against stored hash
3. Returns JWT tokens and user data

### Protected Routes
1. Client includes JWT token in Authorization header
2. Service validates token and permissions
3. Grants or denies access based on user role

## Database Schema

### User Table
```typescript
{
  id: uuid
  email: string
  firstName: string
  lastName: string
  password: string
  role: enum('admin', 'instructor', 'student')
  isEmailVerified: string
  provider: string | null
  avatarUrl: string | null
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Future Enhancements
- Implement two-factor authentication (2FA)
- Add Facebook OAuth integration
- Enhanced audit logging
- Rate limiting
- Session management
- Password reset flow
- Email verification flow
