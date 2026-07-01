# ATOMIC ERP - Workspace Rules & Information Schema

## Tech Stack
- Frontend/Backend: Next.js (App Router, v14/15) + TypeScript
- Database: PostgreSQL with Prisma ORM
- Styling: Tailwind CSS (Soft-light theme, glassmorphism)
- Integrations: WhatsApp (Meta API), Storage (S3/Cloudflare), External Web Scrapers

## Project-Scoped Rules
1. **Prisma Safety:** Never modify the database directly. Always update `prisma/schema.prisma` and run `npx prisma generate`. Always review foreign key relations (especially for User, Client, Product, Quote) before adding new fields.
2. **UI Guidelines:** 
   - Ensure soft, modern aesthetics (glassmorphism: `backdrop-blur-3xl`, `bg-white/50`, etc.).
   - Follow mobile-first responsive design (`sm:`, `md:`, `lg:` prefixes).
   - Do NOT use plain colors; use gradients or semantic colors defined in the tailwind config.
3. **API & Data Fetching:** 
   - For App Router components, fetch data on the server when possible (Server Components).
   - For client interactivity, use `"use client"` directive and manage state carefully (avoiding hydration errors).
4. **Code Quality:** 
   - No `any` types in TypeScript.
   - Keep files small and modular; extract components to `src/components/`.

## Architecture Overview
- `User` and `Team` manage permissions and access.
- `Client`, `Quote`, `Transaction`, `PaymentTicket` handle the sales pipeline.
- `Product`, `Category`, `Collection` manage the store and inventory.
- WhatsApp tables (`WAContact`, `WAMessage`, etc.) handle multi-agent CRM interactions.
- `Blog`, `SocialPost`, `MarketingCampaign` manage inbound and outbound marketing.
- The `src/app/dashboard` contains the protected routes for the ERP modules.
