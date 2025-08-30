# Overview

Yanked.Chat is a full-stack web application that extracts and archives AI conversation transcripts from major platforms (ChatGPT, Claude, Gemini, and Microsoft Copilot). The application provides a secure service for users to input conversation URLs and download their chat history in multiple formats (JSON, Markdown, plain text). Built with a modern TypeScript stack, it features a React frontend with shadcn/ui components, an Express.js backend with intelligent parsing services, and PostgreSQL database integration through Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18+ with TypeScript and Vite for development/building
- **UI Library**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with centralized error handling middleware
- **Parser System**: Modular architecture with base parser class and vendor-specific implementations
  - BaseParser abstract class defines common parsing interface
  - Individual parsers for each platform (ChatGPT, Claude, Gemini, Copilot)
  - Intelligent DOM selector system with fallback mechanisms
  - Interface change detection with automated monitoring

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table for authentication and subscription management
  - Chat extractions table for tracking parsing requests and results
  - Parsing errors table for monitoring system health
- **Connection**: Neon serverless PostgreSQL for cloud database hosting
- **Migrations**: Drizzle Kit for database schema management and versioning

## Authentication & Session Management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Custom user system with email/password authentication
- **Subscription Integration**: Stripe integration for payment processing and plan management

## Parsing Engine
- **Architecture**: Plugin-based system where each AI platform has dedicated parser
- **Error Handling**: Robust fallback selectors and automatic interface change detection
- **Content Processing**: In-memory processing without persistent storage of conversation data
- **Export Formats**: Multiple output formats (JSON, Markdown, plain text) for user flexibility

## Development Workflow
- **Build System**: Vite for frontend bundling, esbuild for server-side compilation
- **Development Server**: Hot module replacement and runtime error overlay for development
- **Code Quality**: TypeScript strict mode with path mapping for clean imports
- **Deployment**: Separate client and server build processes with static file serving
- **Database**: PostgreSQL with Drizzle ORM using DatabaseStorage for persistent data

# External Dependencies

## Payment Processing
- **Stripe**: Complete payment infrastructure for subscription billing and customer management
- Stripe React components for secure payment form handling
- Webhook integration for subscription status updates

## Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with automatic TypeScript inference
- Schema validation using Drizzle-Zod integration

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library for UI elements
- **React Icons**: Additional icon sets for social media and brand icons

## Development Tools
- **Vite**: Frontend build tool with hot module replacement
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast server-side bundling for production builds
- **Replit Integration**: Development environment optimizations and error handling

## Email & Notifications
- **Email Service**: Abstracted email service for interface change notifications and system alerts
- Configured for developer notifications when parsing failures occur
- Automated monitoring system for detecting platform UI changes