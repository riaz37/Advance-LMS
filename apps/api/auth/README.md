# Auth Service

## Overview
The Auth Service is a microservice responsible for authentication and authorization in the Advanced Learning Management System. It provides secure user management, authentication, and role-based access control with support for both local and social authentication methods.

## Features
- User registration and authentication
- Social authentication (Google, Facebook)
- JWT-based authentication with refresh tokens
- Hierarchical role-based access control (Admin > Instructor > Student)
- Password management and security
- Email verification
- Swagger API documentation

## Tech Stack
- NestJS - A progressive Node.js framework
- TypeORM - ORM for database management
- PostgreSQL - Primary database
- Passport.js - Authentication middleware
- JWT - Token-based authentication
- Class Validator - Request validation
- Swagger - API documentation

## Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- pnpm (recommended package manager)

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
# Application
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=lms_auth
DB_SYNC=true
DB_LOGGING=true

# Social Auth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/auth/facebook/callback

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Running the Service

### Development
```bash
pnpm run start:dev
```

### Production
```bash
pnpm run build
pnpm run start:prod
```

## API Documentation
Once the service is running, access the Swagger documentation at:
```
http://localhost:3001/api/auth/docs
```

## API Endpoints

### Local Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get current user profile

### Social Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/facebook` - Initiate Facebook OAuth flow
- `GET /api/auth/facebook/callback` - Facebook OAuth callback

### Role Management
- `POST /api/auth/change-role` - Change user role (Admin only)
- `GET /api/auth/users` - Get all users (Admin only)
- `GET /api/auth/courses` - Get instructor courses (Instructor only)
- `GET /api/auth/enrolled-courses` - Get enrolled courses (Student only)

## Authentication Flow

### Local Registration
1. Client sends POST request to `/api/auth/register`
2. Service validates input and checks for existing email
3. Creates new user with hashed password (default role: STUDENT)
4. Returns JWT tokens (access + refresh) and user information

### Social Authentication
1. Client initiates OAuth flow via Google/Facebook endpoints
2. User authenticates with the provider
3. Service creates/updates user with social profile
4. Returns JWT tokens and user information

### Protected Routes
1. Client includes JWT token in Authorization header
2. Service validates token and role permissions
3. Grants or denies access based on user role hierarchy

## Role-Based Access Control

### Role Hierarchy
```typescript
const roleHierarchy = {
  ADMIN: 3,      // Full access
  INSTRUCTOR: 2, // Course management
  STUDENT: 1     // Basic access
}
```

### Using Role Protection
Routes can be protected with role requirements using the `@Role()` decorator:
```typescript
@Role(UserRole.ADMIN)
@Get('admin-endpoint')
adminOnly() {
  // Only accessible by admins
}

@Role(UserRole.INSTRUCTOR)
@Get('instructor-endpoint')
instructorAndAbove() {
  // Accessible by instructors and admins
}
```

## Security Features
- Password hashing with bcrypt
- JWT access tokens (15m expiry)
- JWT refresh tokens (7d expiry)
- Hierarchical role-based access control
- Social authentication integration
- Input validation and sanitization
- CORS configuration

## Error Handling
The service implements comprehensive exception handling for:
- Authentication failures
- Invalid credentials
- Token expiration
- Insufficient permissions
- Input validation
- Database conflicts

## Development Guidelines

### Code Style
- Follow NestJS best practices
- Use TypeScript decorators for metadata
- Implement proper error handling
- Add JSDoc comments for methods
- Use DTOs for request/response validation

### Testing
- Unit tests for services
- E2E tests for authentication flows
- Role-based access tests
- Token validation tests

## Future Improvements
- Implement two-factor authentication (2FA)
- Add more OAuth providers
- Enhanced audit logging
- Session management
- Rate limiting
- IP-based security

## Support
For support, please contact the development team or create an issue in the repository.
