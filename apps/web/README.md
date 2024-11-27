# Advanced LMS Web Application

This is the web application for the Advanced Learning Management System, built with Next.js 14 and TypeScript.

## Features

- Modern UI with Tailwind CSS
- Dark mode support
- Type-safe development with TypeScript
- Server-side rendering with Next.js
- Form handling with React Hook Form
- State management with Zustand
- API integration with Axios
- Component library with Radix UI

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── lib/                  # Library code and third-party clients
├── store/               # State management (Zustand)
├── styles/              # Global styles and CSS modules
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Key Files

- `src/config/site.ts` - Site-wide configuration and metadata
- `src/lib/auth.ts` - NextAuth.js configuration
- `src/types/index.ts` - Core TypeScript interfaces
- `src/hooks/use-auth.ts` - Authentication hook
- `src/utils/api.ts` - API utilities

## Authentication

The application uses NextAuth.js for authentication. Key features include:
- JWT-based sessions
- Custom login page
- Protected routes with middleware
- Type-safe authentication hooks

## API Integration

API calls are handled through a custom utility that:
- Manages base URL configuration
- Handles error responses
- Provides type safety for requests/responses

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
