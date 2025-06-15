# Real Estate Portfolio Management System

## Overview

This is a modern real estate portfolio management application built for Japanese real estate investors. The system provides comprehensive tools for tracking properties, analyzing market data, managing activities, and making investment decisions. The application features a clean, professional interface with extensive use of Japanese language throughout the user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **Session Storage**: PostgreSQL-backed sessions
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Database Schema
The system uses a well-structured PostgreSQL schema with the following core entities:

1. **Users**: Basic user authentication and identification
2. **Properties**: Core property information including financial metrics
3. **Market Data**: Regional market trends and analytics
4. **Activities**: Activity logging and audit trails

The schema supports decimal precision for financial calculations and includes proper indexing for performance.

### API Structure
RESTful API endpoints organized by resource:
- `/api/properties` - Property CRUD operations
- `/api/market-data` - Market analytics and trends
- `/api/activities` - Activity feed and logging
- `/api/portfolio/analytics` - Portfolio-wide analytics

### Authentication and Authorization
Currently implements mock authentication with plans for proper user sessions. Session management is configured but not fully implemented in the current codebase.

### External Service Integrations
The application is designed to integrate with:
- Market data providers for real-time pricing
- AI services for property valuation and predictions
- Currency formatting for Japanese Yen display

## Data Flow

1. **Client Request**: React components trigger API calls via TanStack Query
2. **API Processing**: Express routes validate and process requests
3. **Data Layer**: Drizzle ORM handles database operations
4. **Response**: JSON responses with proper error handling
5. **UI Update**: React Query updates component state automatically

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **@tanstack/react-query**: Powerful data fetching and caching
- **wouter**: Lightweight React router
- **react-hook-form**: Form handling with validation

### UI Dependencies
- **@radix-ui/***: Comprehensive accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **recharts**: Responsive chart library for data visualization

### Development Dependencies
- **vite**: Next-generation frontend tooling
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- Uses Replit with integrated PostgreSQL
- Hot module replacement for fast development
- Automatic error overlay for debugging

### Production Build
- Vite builds optimized client bundle
- esbuild bundles server code for Node.js
- Environment variables for database configuration
- Replit autoscale deployment target

### Build Process
1. `npm run build` - Builds both client and server
2. Client assets output to `dist/public`
3. Server bundle output to `dist/index.js`
4. Static file serving in production mode

## Changelog
```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences

Preferred communication style: Simple, everyday language.