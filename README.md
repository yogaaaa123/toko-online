#  Toko Online (Next.js 16 E-Commerce)
oke fix

pasdword admin:1
Email: admin@mail.com
Password: admin123
  
pasword user:1
john@mail.com
changeme


![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Tests-Vitest-yellow?style=flat-square&logo=vitest)

##  Overview

**Toko Online** is a full-featured e-commerce platform designed to demonstrate modern web development practices. It leverages the latest Next.js 16 App Router for performance, server-side rendering, and robust routing. The application features a secure custom authentication system, a dynamic product catalog, shopping cart management, and a protected admin dashboard.

##  Tech Stack

### Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - React Framework for Production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Static Type Checking
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) - Utility-first CSS & Accessible Components
- **Icons**: [Lucide React](https://lucide.dev/)

### State & Data

- **State Management**: React Context API (`CartContext`, `AuthContext`)
- **Data Fetching**: Native `fetch` with Next.js Caching & Server Actions
- **Backend API**: Integrated Next.js API Routes (`/app/api`)
- **External Data**: [Platzi Fake Store API](https://fakeapi.platzi.com/) (Product Data & User Auth Base)

### Security (Enterprise Grade)

- **JWT Library**: `jose` (Edge Compatible)
- **Middleware**: Next.js 16 `proxy.ts`
- **Cookies**: Secure, HttpOnly, SameSite=Lax

### Testing

- **Runner**: [Vitest](https://vitest.dev/)
- **Environment**: JSDOM / Happy-DOM
- **Utilities**: React Testing Library

---

##  Security Architecture

This project implements a **Defense-in-Depth** security strategy, focusing on stateless authentication and secure session management.

### 1. JWT Authentication Strategy

We utilize a custom JWT implementation using the `jose` library, replacing standard session cookies for stateless scalability.

- **Token Signing**: All tokens are cryptographically signed using HS256 with a server-side `JWT_SECRET`.
- **Payload**: Contains non-sensitive user data (ID, Role, Email) and wrapped external tokens.
- **No Hardcoded Sessions**: Unlike legacy systems, sessions are fully dynamic and verified per request.

### 2. Secure Cookie Policy

Tokens are never exposed to the client-side JavaScript (LocalStorage/SessionStorage).

- `HttpOnly`: **True**. Prevents XSS attacks from stealing tokens.
- `Secure`: **True**. Ensures cookies are only sent over HTTPS (Production).
- `SameSite`: **Lax**. Mitigates CSRF attacks while maintaining usability.

### 3. Proxy Middleware (`src/proxy.ts`)

Acting as the application's firewall, the Proxy Middleware intercepts requests to protected routes (`/admin`, `/checkout`) before they reach the layout.

- **Validation**: Verifies JWT signature and expiration on every request.
- **RBAC (Role-Based Access Control)**: Enforces strict role checks (e.g., only `role: 'admin'` can access `/admin`).
- **Redirects**: Automatically handles unauthorized access attempts with intelligent return URL handling.

---

##  Key Features

###  Customer Features

- **Product Discovery**: Dynamic grid with search and category filtering.
- **Product Details**: SEO-optimized product pages with server-side rendering.
- **Shopping Cart**: Real-time cart management with persistence.
- **Checkout Flow**: Protected checkout route for authenticated users.

###  Admin Dashboard

- **Protected Access**: Only accessible via secure Admin JWT.
- **Product Management**: Interface for managing catalog (CRUD).
- **Analytics Overview**: Basic sales and visitor metrics.

---

##  Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/toko-online.git
    cd toko-online
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:

    ```env
    JWT_SECRET=your-super-secret-key-change-this-in-prod
    NEXT_PUBLIC_API_URL=https://api.escuelajs.co/api/v1
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

### Login Credentials (Demo)

| Role      | Email            | Password   |
| --------- | ---------------- | ---------- |
| **Admin** | `admin@mail.com` | `admin123` |
| **User**  | `john@mail.com`  | `changeme` |

---

##  Testing

We use **Vitest** for unit and integration testing.

- **Run all tests**:
  ```bash
  npm test
  ```
- **Run with coverage**:
  ```bash
  npm run test:coverage
  ```

---

##  Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # Backend API Routes
│   ├── admin/            # Protected Admin Pages
│   ├── (public)/         # Public Facing Pages
│   └── layout.tsx        # Root Layout
├── components/           # Reusable UI Components
├── context/              # React Context (Global State)
├── lib/                  # Utilities (Auth, API wrappers)
├── proxy.ts              # Security Middleware
└── middleware.ts         # (Deprecated/Removed in Next.js 16)
```

---

##  License

This project is licensed under the MIT License - see the LICENSE file for details.
