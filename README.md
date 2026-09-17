# Obsrvr

Obsrvr is a modern full-stack application for managing user-owned resources with role-based access control. The project combines a React/Next.js frontend with a NestJS backend and Prisma ORM to provide a clean, secure, and scalable foundation for resource sharing, authorization, and user management.

## 1) Project Overview

This repository is structured as a two-part application:

- Frontend: Next.js App Router application for user authentication, profile management, and resource UI
- Backend: NestJS API layer for authentication, authorization, CRUD operations, and database access
- Data layer: PostgreSQL database managed through Prisma

The platform supports:

- User registration and login
- JWT-based authentication
- Resource creation and ownership tracking
- Role-based access control: VIEWER, EDITOR, OWNER
- Shared resource access via user email or user ID
- User profile and access filtering

The product is designed around a clear separation of responsibilities:

- The frontend handles presentation, routing, and client-side experience
- The backend enforces business rules and security checks
- Prisma acts as the data access layer and schema contract for PostgreSQL

## 2) Core Architecture & Technical Implementation

### High-level Architecture

```text
Browser / Client
   │
   ▼
Next.js Frontend (App Router)
   │  fetch() + JWT token in Authorization header
   ▼
NestJS Backend
   ├─ AuthModule
   ├─ UserModule
   ├─ ResourceModule
   ├─ PrismaModule
   └─ Guards (JwtAuthGuard, ResourceAccessGuard)
   │
   ▼
PostgreSQL
   ├─ User
   ├─ Resource
   └─ ResourcePermission
```

### Frontend Layer

The frontend is built with:

- Next.js 16
- React 19
- TypeScript
- App Router structure under `app/`
- Browser token handling through localStorage and JWT decoding

The client interacts with the API through modules in `lib/api/` and utility layers under `lib/common/`. These modules issue authenticated requests to the NestJS API using `fetch()`, attach bearer tokens, and parse responses in a centralized way.

### Backend Layer

The server side is built with NestJS and follows a controller-service-module architecture:

- `src/auth/` handles registration, login, and JWT authentication
- `src/user/` handles user lookups and profile updates
- `src/resource/` contains CRUD operations, permission checks, and access-sharing flows
- `src/prisma/` manages the Prisma singleton service
- `src/main.ts` bootstraps the application and enables CORS for the local frontend

Key backend security patterns:

- `JwtAuthGuard` verifies JWTs and attaches the authenticated user to the request
- `ResourceAccessGuard` checks whether the caller has sufficient role access for the requested resource
- Private resource actions are guarded by permission hierarchy: VIEWER < EDITOR < OWNER

### Data Model

The Prisma schema defines a PostgreSQL database with three primary models:

- `User`: identity, email, password hash, role, timestamps
- `Resource`: typed resource objects with owner relationship and JSON payload
- `ResourcePermission`: per-user permission mapping for a resource

This allows precise ownership and sharing rules while keeping permission checks efficient and explicit.

### Non-blocking I/O and Runtime Characteristics

This project runs on Node.js and follows the standard event-driven, non-blocking I/O model used by modern JavaScript runtimes:

- The NestJS server handles requests asynchronously
- Prisma queries run without blocking the event loop while waiting for database responses
- The architecture is optimized for concurrent HTTP requests and lightweight API workloads

The repository does not currently implement a custom WebSocket or socket server, so there is no real-time event channel or socket orchestration layer in the codebase at the moment. The application’s concurrency model is therefore centered on asynchronous HTTP processing rather than live push messaging.

### Deployment and Orchestration Notes

The repository does not currently include:

- Dockerfiles
- docker-compose.yml
- Kubernetes manifests
- Makefile
- CMakeLists.txt

As a result, the current project is designed around local development and standard Node.js service startup rather than a containerized orchestration pipeline. PostgreSQL is expected to be provisioned externally or via a local database instance during development.

## 3) Prerequisites & Build Instructions

### Prerequisites

Before running the project, make sure you have:

- Node.js 20+ recommended
- npm 10+
- PostgreSQL 15+ (or a compatible local PostgreSQL instance)
- A terminal with access to the repo

### Environment Variables

Create `.env` files in the backend project directory and configure the values required by the app.

Example for `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/obsrvr?schema=public"
JWT_KEY="your-super-secret-key"
PORT=3001
```

Frontend variables are expected in the root project environment, for example in a `.env.local` file:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Install Dependencies

From the root project directory:

```bash
cd obsvr
npm install
```

From the backend directory:

```bash
cd backend
npm install
```

### Database Setup

Generate Prisma client and apply migrations:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

If the database is empty and you want the schema initialized, the migration flow above is the recommended starting point.

### Build and Run

Because this repository does not currently include a `Makefile` or `CMakeLists.txt`, the recommended workflow uses the package scripts directly.

Start the backend:

```bash
cd backend
npm run start:dev
```

Start the frontend:

```bash
cd ..
npm run dev
```

Production build:

```bash
cd backend
npm run build
npx prisma generate
npm run start:prod
```

```bash
cd ..
npm run build
npm run start
```

### Local URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 4) Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

Expected response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Log In

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

### Create a Resource

```bash
curl -X POST http://localhost:3001/resource/createResource \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"data":{"title":"Project Overview","status":"active"}}'
```

### List Resources for a User

```bash
curl http://localhost:3001/resource/getResource/all/<USER_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Update a Resource

```bash
curl -X POST http://localhost:3001/resource/updateResource/<RESOURCE_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"data":{"title":"Updated title","status":"review"}}'
```

### Share a Resource with a User by Email

```bash
curl -X POST http://localhost:3001/resource/grantAccessByEmail/<RESOURCE_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"email":"collaborator@example.com","role":"EDITOR"}'
```

## Project Summary

Obsrvr demonstrates a production-oriented architecture for a secure, permission-aware resource-sharing platform. It combines modern web application patterns, database-driven authorization, and modular backend services to deliver a clean and extensible foundation for collaboration features.

The codebase is well-suited for a portfolio or recruitment review because it shows:

- Full-stack application design
- Authentication and authorization implementation
- API-first architecture
- Type-safe data modeling with Prisma
- Modular service boundaries
- Operational awareness around async, non-blocking backend execution
