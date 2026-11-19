# FreshCart

FreshCart is a responsive e-commerce storefront built with Next.js. It connects to the Route Ecommerce API and supports product discovery, account access, cart and wishlist management, checkout, and order history.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.1-000000?logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-149eca?logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)

## Contents

- [Project Overview](#project-overview)
- [Live Demo](#live-demo)
- [Screenshots and Visual Assets](#screenshots-and-visual-assets)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Key Implementations](#key-implementations)
- [What I Learned](#what-i-learned)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Links and Credits](#links-and-credits)

## Project Overview

FreshCart is a multi-page shopping experience for browsing a product catalog and completing common e-commerce tasks. The frontend is organized by feature and uses a shared Axios client to communicate with the Route Ecommerce API. Authenticated operations read the session token from an HttpOnly cookie on the server.

## Live Demo

[Open the FreshCart live demo](https://fresh-cart-e-commerce-rho.vercel.app/)

## Screenshots and Visual Assets

The repository does not currently include captured application screenshots. The live demo above shows the running interface. The project does include this shopping illustration, used on the authentication screens:

<p align="center">
  <img src="src/assets/images/home-slider-1.png" alt="FreshCart shopping cart illustration used on the authentication screens" width="320" />
</p>

## Features

### Browse and discover products

- Homepage with a rotating promotional carousel, store benefits, categories, offers, and featured products.
- Search page with grid/list layouts, pagination, keyword search, sorting, category and brand filters, and minimum/maximum price filters; the shop page provides paginated product browsing.
- Browse categories, subcategories, and brands, including their related products.
- Product detail pages with an image gallery, product information, stock and quantity controls, and rating information.

### Reviews

- Product rating summary and rating distribution.
- Reviews fetched in pages of five with a Show More interaction.
- Create, edit, and delete review flows with form validation and owner/admin action visibility checks in the interface.

### Shopping and checkout

- Authenticated cart with quantity updates, item removal, clear-cart and coupon actions.
- Add-to-cart actions with a product-image flight animation toward the navbar cart icon; the animation respects reduced-motion preferences.
- Authenticated wishlist with add/remove actions and a saved-products page.
- Checkout with shipping-address validation, a live order summary, and Cash on Delivery order placement. Online payment is not available yet.
- Order history with expandable order items, shipping details, and payment/delivery status.

### Accounts and support

- Sign-up, sign-in, sign-out, and token verification.
- Password recovery flow: request a reset code, verify the six-digit code, and set a new password.
- Profile settings and saved-address management.
- Contact page with client-side form validation and local confirmation feedback; it is not connected to a message API. Terms and Privacy Policy pages are also included.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Framework and language | Next.js 16 App Router, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, project CSS theme and responsive utilities |
| Client state | Redux Toolkit and React Redux |
| Server state and requests | TanStack Query 5, Axios, React Query Devtools |
| Forms and validation | React Hook Form, Zod, `@hookform/resolvers` |
| UI and interaction | Tabler Icons, Motion, Swiper, `react-image-gallery`, Sonner |
| Quality and build tooling | ESLint 9, Next.js ESLint config, React Compiler |

## Key Implementations

- **Feature-based organization:** Screens, services, hooks, types, schemas, and server actions are grouped under `src/features/` by domain.
- **Cookie-based authentication:** The login Server Action stores the API token in an HttpOnly cookie. The root layout verifies the token on the server and seeds the Redux authentication state with the user details; the token itself is not placed in client state.
- **API integration:** A shared Axios instance is configured in [`src/services/apiClient.ts`](src/services/apiClient.ts) for the Route Ecommerce API. Cart and cash-order flows use the API's v2 endpoints where required.
- **Remote data and cache updates:** TanStack Query powers catalog, product, cart, wishlist, order, and profile queries. Mutations invalidate the relevant cache keys after successful changes.
- **Validated forms:** React Hook Form and Zod schemas handle authentication, password recovery, checkout, contact, and review forms.
- **Catalog filtering:** Search requests send keyword, sort, category, brand, and price filters to the product API and include filter values in the query key. Pagination is shared through a reusable component.
- **Responsive product experience:** Product galleries use `react-image-gallery`; Motion and Swiper provide page interactions, with reduced-motion support for animations.

## What I Learned

- Structuring a larger Next.js App Router project around independent features and server/client responsibilities.
- Integrating REST endpoints with typed response models and handling authenticated requests without exposing the HttpOnly token to browser code.
- Using Redux for client-side authentication state and TanStack Query for server data, caching, mutations, and cache invalidation.
- Building reusable form flows with React Hook Form and Zod validation.
- Combining URL-driven routes, dynamic product pages, catalogue filtering, and pagination into a cohesive shopping flow.
- Creating responsive interfaces and accessible interactions, including image galleries and reduced-motion-aware animations.

## Installation and Setup

### Prerequisites

- Node.js and npm versions supported by Next.js 16.
- Internet access to reach the configured Route Ecommerce API.

### Run locally

```bash
git clone https://github.com/MohamedOsama1907/Fresh-Cart-e-commerce-.git
cd Fresh-Cart-e-commerce-
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create and run a production build:

```bash
npm run build
npm start
```

## Environment Variables

No environment variables are currently referenced by the application, and no `.env` file is required for local startup. The shared Axios client currently defines the API base URL in [`src/services/apiClient.ts`](src/services/apiClient.ts). Authenticated sessions use an HttpOnly cookie managed by server actions; do not add token values to source control or expose them in client-side environment variables.

## Project Structure

```text
src/
├── app/
│   ├── (authentication)/       # Login, sign-up, and password recovery routes
│   ├── (platform)/             # Storefront, product, cart, checkout, and account routes
│   ├── layout.tsx              # Root layout, providers, navbar, footer, and notifications
│   └── page.tsx                # Homepage route
├── components/                 # Shared layout, buttons, pagination, errors, and loaders
├── features/
│   ├── auth/                   # Authentication screens, schemas, actions, and Redux slice
│   ├── cart/                   # Cart API actions, query hooks, UI, and animation provider
│   ├── checkout/               # Checkout form and cash-order flow
│   ├── home/                   # Homepage, promotions, categories, and featured products
│   ├── search/                 # Search filters, product results, and pagination
│   ├── shop/                   # Paginated product browsing
│   ├── products/               # Product cards, details, gallery, and reviews
│   ├── categories/             # Category pages
│   ├── subcategories/          # Subcategory pages
│   ├── brands/                 # Brand pages
│   ├── wishlist/               # Saved products
│   ├── orders/                 # Order history
│   ├── profile/                # Account settings and addresses
│   ├── support/                # Contact page
│   └── checkout/               # Shipping form and order placement
├── services/apiClient.ts       # Shared Axios configuration
├── store/                      # Redux store setup and types
├── styles/globals.css          # Tailwind import, theme, and shared styles
└── assets/images/              # Logo and application visuals
```

Most feature folders follow a local structure of `components/`, `hooks/`, `services/`, `server/`, `schemas/`, and `types/` as needed.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |

## Links and Credits

- **Live application:** [fresh-cart-e-commerce-rho.vercel.app](https://fresh-cart-e-commerce-rho.vercel.app/)
- **GitHub repository:** [MohamedOsama1907/Fresh-Cart-e-commerce-](https://github.com/MohamedOsama1907/Fresh-Cart-e-commerce-)
- **Product API:** [Route Ecommerce API](https://ecommerce.routemisr.com/)
