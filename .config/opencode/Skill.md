# Project: Heritage Loom

Persistent instructions for the coding agent. Read before every task.
Developer is experienced: skip basics and explain only non-obvious decisions.

## Product

Heritage Loom is a Bhutanese crafts marketplace and storytelling platform. It connects customers with Bhutanese artisans and sellers, showcasing products such as kira, gho, handwoven textiles, jewellery, paintings, woodwork, and home goods.

The application supports three roles:
- Customers: browse, search, filter, wishlist, purchase, review, and track orders.
- Artisans/sellers: manage profiles, products, submissions, orders, sales, and settings.
- Administrators: moderate products and reviews and manage users, artisans, products, orders, reports, and settings.

The experience should feel warm, cultural, premium, accessible, and editorial—not like a generic storefront.

## Stack (fixed unless approval is given)

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4 through `@tailwindcss/postcss`
- Local demo data and browser persistence
- Lucide React for icons
- Manrope Variable for UI text
- Cormorant Garamond Variable for display/editorial text
- ESLint with `eslint-config-next`

Read the relevant Next.js guidance in `node_modules/next/dist/docs/` before changing Next.js-specific behavior. Do not assume older Next.js APIs or conventions still apply.

## Commands

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

Before declaring a task complete, run lint and build when the change can affect application behavior or types. If a command cannot run, report why.

## Architecture

This is a Next.js App Router application organized by responsibility:

- `src/app/` — routes, layouts, loading states, errors, and route-level composition
- `src/app/(store)/` — public storefront routes
- `src/app/(auth)/` — authentication routes
- `src/app/(dashboard)/` — account, seller, and admin dashboards
- `src/components/` — reusable UI and feature components grouped by domain
- `src/components/ui/` — generic presentational primitives
- `src/components/layout/` — header, footer, navigation, overlays, and shared page layout
- `src/components/product/` — catalog and product experience
- `src/components/checkout/` — cart and checkout flows
- `src/components/account/`, `artisan/`, `dashboard/`, `auth/`, and `order/` — domain-specific UI
- `src/context/` — client-side providers for auth, cart, orders, wishlist, submissions, and toast notifications
- `src/data/` — local/demo catalog, artisan, category, region, review, media, and order data
- `src/services/` — data-access and integration boundaries, including catalog and payments
- `src/lib/` — shared utilities, persistent stores, API helpers, and frontend integration utilities
- `src/types/` — shared domain types
- `public/` — static assets and product images

The root provider composition is in `src/context/Providers.tsx`. Keep provider order stable unless there is a clear dependency reason to change it.

Use the existing `@/*` alias, which maps to `src/*`.

## Data boundary

This is a frontend-only application. Catalog content lives in `src/data/`, while interactive state is managed by React Context providers and `src/lib/persistent-store.ts`.

- Catalog reads are contained in `src/services/catalog.ts`.
- Authentication is demo behavior in `src/context/AuthContext.tsx`.
- Cart, wishlist, orders, and submissions use browser persistence only.

Do not claim that demo authentication, local data, or browser persistence is production functionality.

## Next.js conventions

- Prefer Server Components by default.
- Add `"use client"` only for state, effects, browser APIs, event handlers, or client context.
- Keep route pages thin and compose reusable components from `src/components/`.
- Use route groups and dynamic segments consistently with the existing structure.
- Preserve loading, error, and not-found states where they already exist.
- Use `next/image` or the existing `SmartImage` component for images where appropriate.
- Keep metadata in route layouts/pages when a page needs specific SEO information.
- Never expose secrets or service-role credentials to client components.

## Design system and accessibility

Use the design tokens in `src/app/globals.css` rather than introducing arbitrary colors. The established palette includes deep red, saffron gold, warm ivory, earthy brown, and charcoal text.

- Use the existing typography tokens and font families.
- Reuse existing UI components before creating duplicates.
- Maintain responsive behavior across mobile, tablet, and desktop.
- Preserve visible focus states, semantic HTML, keyboard navigation, accessible labels, and sufficient color contrast.
- Respect `prefers-reduced-motion` for decorative animations.
- Keep the cultural presentation respectful and avoid unsupported claims about artisans, regions, or traditions.

## State and domain rules

- Keep cart, wishlist, orders, submissions, auth, and toast behavior in their existing contexts rather than duplicating state locally.
- Use the shared domain types in `src/types/index.ts`.
- Treat client-only prices, totals, roles, and order state as demo behavior.
- Preserve role separation between customer, artisan/seller, and admin routes.
- Keep payment logic behind `src/services/payments.ts` and never handle raw card data in the app.
- Treat local demo data and browser persistence as development/demo behavior, not durable multi-user storage.

## Code style

- Strict TypeScript; avoid `any`. Use `unknown` and narrow it when needed.
- Prefer named exports and the conventions already used in the surrounding file.
- Use async/await for asynchronous work and handle loading/error states explicitly.
- Prefer small, focused components and pure utility functions.
- Keep business/data-access logic out of presentational components.
- Use comments to explain why, not what.
- Do not add dependencies without stating the reason and getting approval.
- Do not disable lint rules or weaken TypeScript settings to make a change pass.

## Workflow

1. Inspect the relevant route, component, context, service, types, styles, and assets before editing.
2. For changes spanning multiple domains, provide a short implementation plan and list assumptions before coding.
3. Make the smallest focused change that fits the existing architecture.
4. Reuse existing components, tokens, contexts, and service boundaries.
5. Run `npm run lint` and `npm run build` when appropriate.
6. Summarize changed files, verification results, assumptions, and any remaining limitations.

## Do not

- Do not move domain logic into route pages or UI-only components.
- Do not commit secrets, `.env` files, generated build output, or personal data.
- Do not overwrite user work or unrelated files.
- Do not present demo authentication, local data, or browser persistence as production-ready functionality.
