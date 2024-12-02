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

## Setting Up a New Microservice

To set up a new microservice, you can use the `setup_microservice.sh` script located in the `api` directory. This script will create a basic structure for your microservice using `pnpm`.

### How to Use the Script:

1. **Navigate to the `api` Directory:**
   ```bash
   cd /media/riaz37/WebDevelopment/Advance-LMS/apps/api
   ```

2. **Run the Script with the Microservice Name:**
   Use the following command format, replacing `your_microservice_name` with the desired name of your microservice:
   ```bash
   bash setup_microservice.sh your_microservice_name
   ```

### Example:

To create a microservice named "users," you would run:
```bash
bash setup_microservice.sh users
```

This will create a new microservice with the specified name and set up the necessary directory structure and files.
