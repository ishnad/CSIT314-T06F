# C2C Cleaner Matching Platform

A role-based marketplace that helps homeowners discover and book cleaners, gives cleaners tools to manage listings and track demand, and provides administrators with operational control and reporting.

![Project overview](docs/project-overview.svg)


## Table of Contents

- [Visual Proof](#visual-proof)
- [The Problem and Business Value](#the-problem-and-business-value)
- [Core Tech Stack](#core-tech-stack)
- [Key Features and Technical Impact](#key-features-and-technical-impact)
- [System Architecture Diagram](#system-architecture-diagram)
- [Project Structure](#project-structure)
- [Seeded Demo Accounts](#seeded-demo-accounts)
- [Quick Start Guide](#quick-start-guide)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Supporting Diagrams and Documents](#supporting-diagrams-and-documents)

## Visual Proof

The platform is built around four distinct user experiences:

- `Homeowner`: browse active cleaners, shortlist preferred providers, and review booking history.
- `Cleaner`: create and manage listings, view confirmed matches, and monitor profile engagement.
- `UserAdmin`: create users, manage user accounts, and control role-based profiles.
- `Platform Management`: manage service categories and generate operational reports.

Supporting design documents:

- [System and sprint diagrams](diagrams/SIM2025S2-The%20Neural%20Network%20%28Diagrams%29.drawio)
- [Data persistence diagram (PDF)](diagrams/Data%20Persistence%28final%29.drawio.pdf)
- [Class diagrams (PDF)](diagrams/Class%20Diagrams%28final%29.drawio.pdf)

## The Problem and Business Value

Finding cleaning services is often fragmented: homeowners need a simple way to discover trusted providers, cleaners need a clearer way to present their services and measure demand, and platform operators need governance tools instead of handling everything manually.

This project brings those workflows into one system. It reduces friction in service discovery and booking, gives cleaners visibility into shortlist and profile-view activity, and equips administrators with user management, category governance, login tracking, and business reporting. The result is a more structured, auditable, and scalable service marketplace.

## Core Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Create React App, CSS |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL |
| ORM / Data Access | Prisma |
| Authentication / Security | bcrypt, dotenv, CORS |
| Testing | Jest |
| Developer Tooling | Nodemon, Prisma Migrate, Prisma Seed, draw.io |

## Key Features and Technical Impact

- Role-based product design with dedicated dashboards for homeowners, cleaners, user administrators, and platform managers, allowing the same codebase to support customer operations and internal platform governance.
- Search and discovery flows for active cleaners and service listings, including keyword, category, and rate filtering to make cleaner selection faster and more relevant.
- Cleaner-side listing lifecycle management with create, edit, and status-toggle actions, enabling providers to maintain accurate offerings without direct database intervention.
- Booking and shortlist workflows backed by persistent `ConfirmedMatch` and `Shortlist` models, giving homeowners a reusable history of previous services and saved providers.
- Operational insight features that track profile views, shortlist counts, login activity, registrations, confirmed bookings, weekly listing trends, and monthly revenue.
- BCE-inspired layered architecture that separates React boundary components, Express controllers, and backend entity classes, making business rules easier to test and maintain.
- Database-level reliability through Prisma models, unique constraints, and indexes on high-traffic fields such as usernames, emails, login times, profile views, category names, and service listing relationships.
- Seeded demo data that bootstraps 300+ role-based accounts, service categories, randomized cleaner listings, and profile-view activity so reviewers can explore meaningful workflows quickly.
- Backend quality coverage through 18 Jest test files across controller and entity layers, covering happy paths, validation rules, filtering logic, and error handling scenarios.

## System Architecture Diagram

```mermaid
flowchart LR
    H[Homeowner]
    C[Cleaner]
    UA[User Admin]
    PM[Platform Management]

    subgraph FE[Frontend - React SPA]
        Login[Login and role routing]
        Dash[Role-based dashboards]
        State[Local storage session state]
    end

    subgraph BE[Backend - Express API]
        Routes[Route layer]
        Controllers[Controller layer]
        Entities[Entity / business logic layer]
        Reports[Reporting and analytics services]
    end

    subgraph DB[Data Layer]
        Prisma[Prisma Client]
        Postgres[(PostgreSQL)]
    end

    H --> Login
    C --> Login
    UA --> Login
    PM --> Login

    Login --> Dash
    Dash --> State
    Dash --> Routes
    Routes --> Controllers --> Entities
    Entities --> Reports
    Entities --> Prisma --> Postgres
    Reports --> Prisma
```

At a high level, the React frontend handles role-based navigation and workflow screens, the Express backend exposes API endpoints and application rules, and Prisma connects those services to PostgreSQL for persistence, reporting, and analytics.

## Project Structure

```text
.
|-- backend/
|   |-- prisma/              # Prisma schema, migrations, and seed script
|   |-- src/
|   |   |-- controllers/     # HTTP orchestration layer
|   |   |-- entities/        # Business logic and data access orchestration
|   |   |-- routes/          # Express route definitions
|   |   `-- server.js        # Backend entry point
|   `-- tests/               # Jest controller and entity tests
|-- front-end/
|   |-- public/
|   `-- src/
|       |-- boundaries/      # Role-based UI modules
|       `-- App.js           # Frontend entry point and role router
|-- diagrams/                # draw.io and PDF design artefacts
`-- docs/                    # README visual assets
```

## Seeded Demo Accounts

After running `npm run seed` inside `backend/`, you can log in with the following sample accounts:

| Role | Username | Password |
| --- | --- | --- |
| UserAdmin | `admin` | `admin123` |
| Homeowner | `homeowner1` | `password123` |
| Cleaner | `cleaner1` | `password123` |
| Platform Management | `platformmanagement1` | `password123` |

The seed script also creates:

- 100 homeowners
- 100 cleaners
- 100 platform-management users
- 5 service categories
- Randomized cleaner listings for the first 20 cleaners
- 100 profile-view records for insight and reporting features

## Quick Start Guide

### Prerequisites

- Node.js and npm
- A PostgreSQL database, or a PostgreSQL-compatible hosted service such as Supabase

### 1. Clone the repository

```bash
git clone https://github.com/ruiennn03/CSIT314-T06F.git
cd CSIT314-T06F
```

### 2. Configure backend environment variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"
PORT=3001
```

`DATABASE_URL` is required. `PORT` is optional and defaults to `3001`, which matches the frontend's configured API target.

### 3. Install backend dependencies and prepare the database

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001`, and a basic health check is exposed at `http://localhost:3001/api/health`.

### 5. Start the frontend in a second terminal

```bash
cd front-end
npm install
npm start
```

The React app will run at `http://localhost:3000`.

### 6. Log in with a seeded account

Use one of the demo accounts listed in the [Seeded Demo Accounts](#seeded-demo-accounts) section to explore each role-based workflow.

## Available Scripts

### Backend

```bash
cd backend
npm start      # Run the Express server
npm run dev    # Run the Express server with nodemon
npm test       # Run Jest tests
npm run seed   # Seed demo data into the database
```

### Frontend

```bash
cd front-end
npm start      # Start the React development server
npm test       # Run frontend tests
npm run build  # Create a production build
```

## Testing

The backend test suite is centered on controller and entity layers, which aligns with the project's separation of concerns. Tests cover:

- authentication and login flows
- user account and user profile management
- cleaner search, shortlist, and booking logic
- service listing and service category management
- reporting workflows and analytics calculations

To run backend tests locally:

```bash
cd backend
npm test
```

## Supporting Diagrams and Documents


- [Sprint diagrams and wireframes](diagrams/SIM2025S2-The%20Neural%20Network%20%28Diagrams%29.drawio)
- [Project gantt (PDF)](diagrams/SIM2025S2-The%20Neural%20Network%20%28Gantt%29.pdf)
- [Data persistence diagram source](diagrams/Data%20Persistence%20Diagram.drawio)
- [Data persistence diagram (PDF)](diagrams/Data%20Persistence%28final%29.drawio.pdf)
- [Class diagrams (PDF)](diagrams/Class%20Diagrams%28final%29.drawio.pdf)

## Notes

- Start the backend before starting the frontend.
- The frontend expects the backend to be reachable on `http://localhost:3001`.
- Passwords are hashed with `bcrypt`, and login activity is persisted through the `UserLoginLog` model.
