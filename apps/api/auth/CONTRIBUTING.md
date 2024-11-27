# Contributing to Auth Service

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- pnpm (recommended package manager)
- Google Developer Console account (for OAuth)
- Facebook Developer account (for OAuth)

### Setup Development Environment
1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/advanced_lms.git
cd advanced_lms/apps/api/auth
```

3. Install dependencies:
```bash
pnpm install
```

4. Set up environment:
```bash
cp .env.example .env
```

5. Configure your `.env` file with local development settings
6. Set up OAuth credentials:
   - Create a project in Google Developer Console
   - Set up a Facebook App
   - Add OAuth credentials to `.env`

### Development Workflow
1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following our coding standards
3. Test your changes thoroughly
4. Commit your changes:
```bash
git commit -m "feat: add your feature description"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

## Authentication System Guidelines

### Role-Based Access Control
When working with roles:
- Use the `@Role()` decorator for route protection
- Follow the role hierarchy (ADMIN > INSTRUCTOR > STUDENT)
- Test role-based access thoroughly
- Document role requirements in Swagger

Example:
```typescript
@Role(UserRole.INSTRUCTOR)
@Get('courses')
async getInstructorCourses() {
  // This endpoint is accessible by INSTRUCTOR and ADMIN roles
}
```

### Social Authentication
When modifying social auth:
- Keep provider-specific logic in separate strategies
- Handle user profile mapping consistently
- Test with mock OAuth responses
- Update environment variables documentation

Example:
```typescript
@Public()
@Get('google')
@UseGuards(AuthGuard('google'))
googleAuth() {
  // Initiates Google OAuth flow
}
```

### JWT Token Management
When working with tokens:
- Maintain separate access and refresh token logic
- Follow token expiration best practices
- Implement proper error handling
- Test token validation thoroughly

Example:
```typescript
async refreshToken(user: User) {
  const payload = { sub: user.id, role: user.role };
  return {
    accessToken: this.jwtService.sign(payload),
    refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' })
  };
}
```

## Coding Standards

### TypeScript Guidelines
- Use TypeScript's strict mode
- Define proper types/interfaces
- Avoid using `any`
- Use meaningful variable names
- Keep functions small and focused
- Use enums for role types

### NestJS Best Practices
- Follow dependency injection principles
- Use decorators appropriately
- Implement proper error handling
- Use pipes for validation
- Keep controllers thin, logic in services
- Use guards for authentication/authorization

### File Structure
```
src/
├── auth/
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   ├── role.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── facebook.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── config/
│   └── configuration.ts
├── app.module.ts
└── main.ts
```

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Maximum line length of 80 characters
- Use async/await over promises
- Add JSDoc comments for public methods

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat(auth): implement role-based access control

- Add role decorator and guard
- Implement role hierarchy
- Add role verification service
- Update documentation and tests
```

## Testing

### Authentication Testing
- Test all authentication flows
- Verify role-based access control
- Test token generation and validation
- Mock social authentication providers
- Test error scenarios

Example:
```typescript
describe('RolesGuard', () => {
  it('should allow admin access to all endpoints', async () => {
    // Test implementation
  });

  it('should respect role hierarchy', async () => {
    // Test implementation
  });

  it('should deny access to insufficient roles', async () => {
    // Test implementation
  });
});
```

### E2E Testing
- Test complete authentication flows
- Verify role-based access
- Test social authentication
- Validate token refresh flow
- Check error responses

Example:
```typescript
describe('Authentication E2E', () => {
  it('should complete Google OAuth flow', () => {
    // Test implementation
  });

  it('should enforce role-based access', () => {
    // Test implementation
  });
});
```

## Documentation

### Authentication Documentation
- Document role requirements
- Explain authentication flows
- Update OAuth setup instructions
- Document token management
- Keep security guidelines updated

Example:
```typescript
/**
 * Changes a user's role in the system
 * @param userId The ID of the user to update
 * @param newRole The new role to assign
 * @param adminUser The admin user making the change
 * @throws ForbiddenException if the user lacks permission
 * @throws BadRequestException if the user doesn't exist
 * @returns Updated user information
 */
async changeRole(
  userId: string,
  newRole: UserRole,
  adminUser: User
): Promise<User> {
  // Implementation
}
```

### API Documentation
- Use Swagger decorators
- Document authentication requirements
- Specify required roles
- Include request/response examples
- Document error responses

Example:
```typescript
@ApiOperation({ summary: 'Change user role' })
@ApiResponse({ status: 200, description: 'Role updated successfully' })
@ApiResponse({ status: 403, description: 'Insufficient permissions' })
@Role(UserRole.ADMIN)
async changeRole() {
  // Implementation
}
```

## Pull Request Process
1. Update documentation
2. Add/update tests
   - Unit tests for services
   - E2E tests for endpoints
   - Role-based access tests
3. Ensure CI passes
4. Request code review
5. Address review comments
6. Update branch with main
7. Merge after approval

## Security Guidelines
- Never commit sensitive credentials
- Use environment variables for secrets
- Follow JWT best practices
- Implement proper rate limiting
- Use secure session management
- Keep dependencies updated

## Questions or Problems?
- Check existing issues
- Create a new issue
- Ask in discussions
- Contact the maintainers

Thank you for contributing!
