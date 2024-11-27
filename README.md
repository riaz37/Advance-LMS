# Advanced Learning Management System

A modern, feature-rich Learning Management System built with Next.js and Nest.js microservices architecture.

## Project Structure

```
advanced-lms/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # Nest.js microservices
│       ├── auth/           # Authentication & user management
│       ├── courses/        # Course management
│       ├── payments/       # Payment processing
│       └── analytics/      # Analytics service
├── packages/
│   ├── shared/            # Shared utilities and types
│   ├── ui/               # Shared UI components
│   ├── tsconfig/         # Shared TypeScript configurations
│   └── eslint-config/    # Shared ESLint configurations
```

## Prerequisites

- Node.js >= 18
- pnpm (recommended) or yarn

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start development servers:
```bash
pnpm dev
```

## Available Scripts

- `pnpm dev`: Start all services in development mode
- `pnpm build`: Build all packages and applications
- `pnpm lint`: Run linting across the entire monorepo
- `pnpm format`: Format code using Prettier

## Technology Stack

- **Frontend**: Next.js
- **Backend**: Nest.js
- **Package Management**: pnpm
- **Monorepo Management**: Turborepo
- **Language**: TypeScript
