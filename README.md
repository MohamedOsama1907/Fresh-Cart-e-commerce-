# FreshCart 🛒

**A Modern E-Commerce Web Application Built with Next.js, React, and TypeScript.**

FreshCart is a feature-rich, responsive e-commerce application designed to deliver a complete online shopping experience. It connects to the Route Ecommerce REST API and brings together product discovery, authentication, cart and wishlist management, checkout, reviews, and order tracking in one application.

The project focuses on more than building UI screens. It demonstrates practical frontend engineering skills, including feature-based architecture, API integration, authentication handling, server and client state management, form validation, caching strategies, and building reusable components for a multi-page application.

<p align="center">
  <a href="https://fresh-cart-e-commerce-rho.vercel.app/"><strong>🌐 Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/MohamedOsama1907/Fresh-Cart-e-commerce-"><strong>💻 Source Code</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.1-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-149eca?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technical Highlights](#-technical-highlights)
- [Tech Stack](#-tech-stack)
- [Architecture and Code Organization](#-architecture-and-code-organization)
- [AI-Assisted Development](#-ai-assisted-development)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [API and Credits](#-api-and-credits)

## 🚀 Project Overview

FreshCart is a multi-page e-commerce frontend application built with the Next.js App Router.

It provides a complete shopping journey, allowing users to explore products, discover categories and brands, manage their accounts, save favorite products, and place orders.

The application integrates with the Route Ecommerce API through a shared Axios client. Its codebase follows a feature-based structure, separating UI components, services, hooks, types, schemas, and server-side logic according to their responsibilities.

The main goal was to build a maintainable application where different features work together consistently, rather than treating every page as an isolated component.

## ✨ Features

### 🛍️ Product Discovery and Catalog

- Responsive homepage featuring promotional sliders, store benefits, categories, offers, and featured products.
- Product browsing with pagination.
- Dedicated search experience with grid and list layouts.
- Keyword search with sorting and filtering by category, brand, and price range.
- Dedicated category, subcategory, and brand pages.
- Dynamic product detail pages with image galleries, product information, stock availability, quantity controls, and ratings.

### ⭐ Product Reviews

- Product rating summaries and rating distributions.
- Paginated review loading with a Show More interaction.
- Create, edit, and delete review functionality.
- Form validation and owner/admin action visibility checks in the interface.

### 🛒 Cart and Wishlist

- Authenticated shopping cart management.
- Add products, update quantities, remove individual items, and clear the cart.
- Coupon application functionality.
- Wishlist management with add/remove actions.
- Dedicated saved-products page.
- Dynamic cart and wishlist data updates.
- Product-image flight animation when adding an item to the cart, with reduced-motion support.

### 💳 Checkout and Orders

- Checkout form with shipping-address validation.
- Live order summary.
- Cash on Delivery order placement.
- Order history with expandable order details.
- Shipping information and payment/delivery status display.

### 🔐 Authentication and Account Management

- User registration and login.
- Logout and token verification.
- Password recovery workflow:
  - Request a password reset code.
  - Verify the six-digit code.
  - Set a new password.
- Profile settings and personal information updates.
- Saved-address management.
- Server-managed authentication token using HttpOnly cookies.

### 📩 Additional Pages

- Contact page with client-side form validation and local confirmation feedback.
- Terms and Conditions.
- Privacy Policy.

## 🧠 Technical Highlights

This project involved implementing and connecting multiple frontend systems while keeping the codebase organized and maintainable.

### Feature-Based Architecture

Organized the application around independent business features, keeping related components, hooks, services, types, schemas, and server actions together.

This makes the code easier to understand, maintain, debug, and extend as the application grows.

### Authentication and Server-Side Logic

- Implemented authentication using Next.js Server Actions.
- Stored the API authentication token in an HttpOnly cookie.
- Verified the user session on the server through the root layout.
- Initialized the client-side authentication state with user information.
- Kept the authentication token out of browser-accessible Redux state.

### API Integration

- Built a shared Axios client for communicating with the Route Ecommerce API.
- Organized API operations into feature-specific services and server actions.
- Integrated authenticated requests and handled API responses and errors.
- Used the API's v2 endpoints for cart and cash-order operations where required.

### State Management and Data Fetching

- Used Redux Toolkit for client-side application and authentication state.
- Used TanStack Query for remote data fetching, caching, mutations, and synchronization.
- Managed query invalidation after successful mutations to keep related data up to date.
- Organized query keys and data-fetching logic by feature.

### Forms and Validation

- Built reusable form flows using React Hook Form.
- Used Zod schemas for structured validation.
- Integrated `@hookform/resolvers` to connect form validation with Zod.
- Applied validation across authentication, checkout, contact, and review forms.

### Search, Filtering, and Pagination

- Implemented API-driven product search and filtering.
- Supported keyword search, sorting, category filters, brand filters, and price ranges.
- Included filter values in query keys to keep fetched results synchronized with the selected filters.
- Used reusable pagination components across catalog views.

### UI, Interaction, and Responsive Design

- Built reusable UI components and responsive layouts.
- Integrated Swiper for sliders and Motion for interface animations.
- Used product image galleries for product detail pages.
- Respected reduced-motion preferences for animated interactions.
- Used Tabler Icons for consistent interface iconography.

## 🛠️ Tech Stack

| Category | Technologies |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Client State Management | Redux Toolkit, React Redux |
| Server State Management | TanStack Query 5 |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Validation | Zod, @hookform/resolvers |
| UI and Icons | Tabler Icons |
| Animations | Motion |
| Sliders | Swiper |
| Image Gallery | React Image Gallery |
| Notifications | Sonner |
| Code Quality | ESLint 9 |
| Deployment | Vercel |

## 🏗️ Architecture and Code Organization

The application follows a feature-based architecture to keep business logic and UI responsibilities separated.

Each feature owns its related implementation instead of placing everything in shared folders.

The project also separates shared infrastructure, application routing, and global state management.

This approach helps reduce unnecessary dependencies between features and makes future changes easier to manage.

## 🤖 AI-Assisted Development

AI tools were used as part of the development workflow to support problem-solving, implementation planning, debugging, and code improvement.

Rather than relying on generated code without review, the workflow involved:

- Breaking larger development tasks into smaller, well-defined requirements.
- Using AI assistants to investigate technical issues and explore possible solutions.
- Reviewing suggested implementations against the existing project architecture and coding conventions.
- Using AI assistance to identify potential bugs, improve code readability, and refine implementation approaches.
- Validating changes through code inspection, application behavior, and available development checks.
- Iterating on prompts and solutions when the initial output did not fully satisfy the requirements.

This workflow helped develop practical skills in AI-assisted development, including writing precise technical prompts, evaluating generated code, identifying incorrect assumptions, and maintaining control over implementation decisions.

**The focus was on using AI as a development assistant while keeping technical decisions, code review, integration, and verification part of the development process.**

## ⚙️ Getting Started

### Prerequisites

- Node.js compatible with Next.js 16.
- npm.
- Internet connection to access the Route Ecommerce API.

### Installation

Clone the repository:

```bash
git clone https://github.com/MohamedOsama1907/Fresh-Cart-e-commerce-.git
```

Navigate to the project directory:

```bash
cd Fresh-Cart-e-commerce-
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 🔑 Environment Configuration

The current application does not require a `.env` file for local startup.

The Route Ecommerce API base URL is configured in the shared Axios client:

`src/services/apiClient.ts`

Authentication sessions use an HttpOnly cookie managed through server-side actions.

Never expose authentication tokens in client-side environment variables or commit private credentials to the repository.

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates an optimized production build. |
| `npm start` | Runs the production server. |
| `npm run lint` | Runs ESLint to check code quality. |

## 📁 Project Structure

```text
src/
├── app/
│   ├── (authentication)/       # Authentication and password recovery routes
│   ├── (platform)/             # Storefront and authenticated application routes
│   ├── layout.tsx              # Root layout and application providers
│   └── page.tsx                # Homepage
│
├── components/                 # Shared UI components
│
├── features/
│   ├── auth/                   # Authentication and account access
│   ├── cart/                   # Cart management
│   ├── checkout/               # Checkout and order placement
│   ├── home/                   # Homepage sections
│   ├── search/                 # Search and filtering
│   ├── shop/                   # Product browsing
│   ├── products/               # Product details and reviews
│   ├── categories/             # Category pages
│   ├── subcategories/          # Subcategory pages
│   ├── brands/                 # Brand pages
│   ├── wishlist/               # Wishlist management
│   ├── orders/                 # Order history
│   ├── profile/                # Profile and saved addresses
│   └── support/                # Contact and support pages
│
├── services/
│   └── apiClient.ts            # Shared Axios configuration
│
├── store/                      # Redux store and state management
│
├── styles/
│   └── globals.css             # Global styles and theme
│
└── assets/
    └── images/                 # Application images and visual assets
```

Feature folders contain the relevant components, hooks, services, server actions, schemas, and types as needed.

## 🔗 API and Credits

- **Live Demo:** https://fresh-cart-e-commerce-rho.vercel.app/
- **GitHub Repository:** https://github.com/MohamedOsama1907/Fresh-Cart-e-commerce-
- **API Provider:** [Route Academy - Ecommerce API](https://ecommerce.routemisr.com/)

---

<p align="center">
  <strong>Built with Next.js, React, TypeScript, and a focus on maintainable frontend engineering.</strong>
</p>
