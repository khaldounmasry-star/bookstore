# 📚 Bookstore Monorepo

A modern full-stack **Bookstore web application** built with **Next.js 15.5 (App Router)** on the frontend, a **Hono + Prisma + MySQL** backend, and **Material UI v7** for styling.  
Designed for **server-first rendering**, **strict TypeScript safety**, and a clean **monorepo architecture** powered by **Turborepo**.

---

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Features](#features)
- [Frontend (Next.js 15.5)](#frontend)
- [Backend (Hono API)](#backend-hono-api)
- [Database (Prisma + MySQL)](#database)
- [Authentication & Authorization](#authentication)
- [Environment Variables](#environment-variables)
- [Running the app](#running-the-app)
- [Testing](#testing)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview
The **Bookstore** demonstrates end-to-end full-stack capability:  
- **Public site** for searching and browsing books.  
- **Admin portal** for managing books, covers, and users.  
- **Super-admin privileges** for user and book management.  
- Clean data layer, reusable hooks, and consistent design language via **Material UI**.

All pages use **SSR or SSG** with **revalidation**, keeping client components to a minimum.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| Frontend | **Next.js 15.5** (App Router) | Server components first, SSR |
| UI Library | **Material UI v7.3** | Styling, layout, accessibility |
| Backend | **Hono** | Lightweight, fast web framework |
| ORM | **Prisma** | Type-safe database layer |
| Database | **MySQL v8.4** | Persistent relational storage |
| Docker | **Dockerised DB** | Containerised the database |
| Auth | **JWT + Cookies** | Secure authentication |
| Documentation | **Swagger** | Endpoints documentation |
| Logging | **Winston** (API only) | logs generation to ingest later |
| Validation | **Zod** | Backend Schema validation |
| Validation | **Zod** | Backend Schema validation |
| Language | **TypeScript** | End-to-end type safety |
| Monorepo | **Turborepo + PNPM** | Modular workspace management |
| Tests | **Jest** (API only) | Unit & integration testing |
| Lint |**ESLint** | Linting and enforcing coding standards |
| Format | **Prettier** | Code formatting for consistent style |
| Accessibility | **Evinced** | Checks for accessibility issues on every page |

---

## Monorepo Structure

```bash
bookstore/
├── apps/
│   ├── api/                   # Hono backend (REST API)
|      ├── prisma/
│         ├── schema.prisma
│         └── seed.ts          # Database seeding with Faker
│   └── web/                   # Next.js 15.5 frontend
├── packages/
│   ├── eslint-config/       
│   ├── typescript-config/  
├── turbo.json
├── package.json
└── README.md
```

## Features
#### Public

- Browse and search books (title, author, genre)
- View detailed book pages
- Responsive Material UI design

#### Admin

- CRUD for Books and Covers (**Not Implemented**)
- Super Admin can manage Users
- Confirmation modals and snackbars
- Role-aware sidebar navigation

#### Dev

- Strict TypeScript types
- Modular monorepo structure
- ESLint + Prettier configured
- Minimal use client usage (only components with user interactivity)

## Frontend
Next.js 15.5
- Built on App Router
- Server Components by default; client components only for interactive UI
- Dynamic routes:
  - / home page with option to sort and filter
  - /books/[id] → Book detail (SSR)
  - /search → Server-side search
  - /signin allows admins, super admins and users to authenticate
  - /signup allows users to create accounts
  - /admin/... → Admin portal
- Custom Material UI theme and palette
- Framer Motion for animations

## Backend (Hono API)
Lightweight REST API serving JSON responses to the frontend.
- http://localhost/docs to test all the routes, login as superadmin@bookstore.com and get your token from the browser to authenticate
- Available endpoints
#### Books
- GET /books List all books
- POST /books Create a new book (Admin only)
- GET /books/{id} Get a book by ID
- PUT /books/{id} Update a book by ID (Admin only)
- DELETE /books/{id} Delete a book by ID (Admin only)
- GET /books/search Search books by title, author, description or genre
- GET /books/filter Filter and sort books by genre, title, price, or rating
- POST /books/{id}/covers Add one or many covers to a book (Admin only)
- PUT /books/covers/{coverId} Update a cover by ID (Admin only)
- DELETE /books/covers/{coverId} Delete a cover by ID (Admin only)

#### Users
- POST /users/register Register a new user
- POST /users/login Authenticate user and return a JWT
- GET /users Get a list of users (Super Admin only)
- POST /users/create-admin Create an admin (Super Admin only)
- DELETE /users/{id} Delete a user by ID (Super Admin only)
- PUT /users/{id} Update an existing user

#### Misc
- http://localhost/health to check if server is up and running and if it is connected to the database

## Database
Uses MySQL 8.4 LTS + Prisma + Docker

``` bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Book {
  id          Int        @id @default(autoincrement())
  title       String
  author      String
  description String
  genre       String
  year        Int?
  rating      Float?
  price       Decimal?   @db.Decimal(10, 2)
  sku         String     @unique
  covers      Cover[]
  updatedAt   DateTime?  @updatedAt
  createdAt   DateTime   @default(now())
}

model Person {
  id         Int        @id @default(autoincrement())
  firstName  String
  lastName   String
  email      String     @unique
  role       Role       @default(USER)
  passwords  Password[] // history
  updatedAt  DateTime?  @updatedAt
  createdAt  DateTime   @default(now())
}

model Password {
  id        Int       @id @default(autoincrement())
  personId  Int
  person    Person    @relation(fields: [personId], references: [id], onDelete: Cascade)
  hash      String
  createdAt DateTime  @default(now())

  @@index([personId, createdAt])
}

model Cover {
  id        Int       @id @default(autoincrement())
  imageUrl  String
  bookId    Int
  book      Book      @relation(fields: [bookId], references: [id], onDelete: Cascade)
  updatedAt DateTime? @updatedAt
  createdAt DateTime  @default(now())
}

enum Role {
  ADMIN
  USER
  SUPER_ADMIN
}
```

**Seed** → prisma/seed.ts uses **Faker** to populate mock data.

## Authentication

- JWT tokens stored as secure cookies (prod only)
- due to time limitations no backend tracking for the JWT token they just die after 7 days (hard sign out)
- authMiddleware parses token and sets ctx.user
- requireRole() restricts endpoint access
- Frontend redirects unauthorized users
- Login handled by usersApi.login() with setCookie

## Environment Variables
for API
| Variable | Purpose |
|-------|-------------|
| DATABASE_URL | DATABASE_URL="mysql://bookstore_user:secure_password@localhost:3306/bookstore" |
| SHADOW_DATABASE_URL | SHADOW_DATABASE_URL="mysql://root:root@localhost:3306/bookstore" |
| JWT_SECRET | JWT_SECRET=dev_secret_key |
| NEXT_PUBLIC_API_URL | NEXT_PUBLIC_API_URL=http://localhost:3001 |

## Running the app
- Make sure you have docker installed and running refer to docker docs https://docs.docker.com/
- **(First run only)** Make sure you have PNPM
```npm install -g pnpm@latest-10```
- **(First run only)** execute the docker compose file
```docker compose up -d```
    - Docker to use the MySQL 8.4 official image
    - Docker creates container named bookstore-db
    - Docker will restart the container automatically if it stops or the host reboots
- install the monorepo packages
```pnpm install```
- go to apps/api
```cd apps/api```
- **(First run only)** seed to the database
```pnpm db:seed```
- **(optional)** if you want to the see the database using Prisma Studio available [locally](http://localhost:5555/)
```pnpm db:ui```
- **(optional)** if you want to the reset the database - then you have to re-seed
```pnpm db:reset```
- go back to the root
```cd ../../```
- run in dev mode or prod mode and the app will be served [locally](http://localhost:3000/)
```pnpm dev``` or ```pnpm build && pnpm start```

## Testing
Only implemented on the backend
- go to apps/api
```cd apps/api```
- run the tests
```pnpm test```

## Future improvements
#### API
- Implement Update Password endpoint
- Create postman tests
- Containerization using Docker
#### WEB
- Refactor + Separation of concerns
- Fully implement Books admin actions
- Fully implement Covers admin actions
- Implement unit and integration tests using jest and react testing library
- Implement E2E tests using Playwright or Cypress
- Containerization using Docker

## License
This project is licensed under the [MIT License](./LICENSE) © 2025