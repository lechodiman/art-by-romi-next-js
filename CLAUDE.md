# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js e-commerce application for artist Romina Rivera, specializing in custom pet portraits. The application uses Sanity.io as a headless CMS for content management.

## Key Technologies

- **Next.js** (Pages Router) with TypeScript
- **Sanity.io** CMS with GROQ queries
- **Tailwind CSS** for styling
- **React Context API** for cart state management
- **Lucide React** for icons

## Essential Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture Overview

### Content Management (Sanity)
- **Studio Access**: `/studio` route provides admin interface
- **Schemas**: Located in `sanity/schemas/` - defines product, painting, testimonial, and siteSettings
- **Client**: Configured in `sanity/lib/client.ts` with project ID `dogtcd0u`
- **Queries**: GROQ queries in `lib/queries.ts` fetch data at build time

### Data Flow
1. Content is managed in Sanity Studio
2. Pages use `getStaticProps` to fetch data via GROQ queries
3. Static pages are generated with ISR (revalidate: 60 seconds)
4. Dynamic routes like `/tienda/[id]` use `getStaticPaths` for pre-rendering

### State Management
- **Cart Context**: `context/CartContext.tsx` manages shopping cart state globally
- Cart items include customization options (pet count, background)

### Key Page Routes
- `/` - Homepage with hero, gallery, testimonials
- `/tienda` - Product catalog
- `/tienda/[id]` - Product detail with customization options
- `/portafolio` - Artist's portfolio
- `/contacto` - Contact form with reCAPTCHA
- `/carrito` - Shopping cart

## Environment Configuration

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=dogtcd0u
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
MAILER_EMAIL=
MAILER_PASSWORD=
RECIPIENT_EMAIL=
```

## Important Patterns

### Fetching Sanity Data
```typescript
// In pages using getStaticProps
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function getStaticProps() {
  const products = await client.fetch(groq`*[_type == "product"]`)
  return { props: { products }, revalidate: 60 }
}
```

### Image Handling
- Sanity images use the `urlForImage` helper from `sanity/lib/image.ts`
- Next.js Image component is configured for Sanity CDN in `next.config.js`

### Product Customization
Products support:
- Multiple pet count (affects pricing)
- Background options (solid color vs custom)
- Size variations
- Base price calculation: `basePrice * petCount * (hasBackground ? 1.5 : 1)`

## Development Workflow

1. Content changes: Edit in Sanity Studio (`/studio`)
2. Code changes: Work in appropriate directories
3. Test locally with `npm run dev`
4. Ensure `npm run lint` passes before committing
5. Build verification: `npm run build` should complete without errors

## Common Tasks

### Adding a New Product Field
1. Update schema in `sanity/schemas/product.ts`
2. Deploy schema changes to Sanity
3. Update TypeScript types in `types/index.ts`
4. Modify queries in `lib/queries.ts` to include new field
5. Update components that display products

### Modifying Email Templates
Email functionality is in `pages/api/contact.ts` using Nodemailer with Outlook SMTP.

### Updating SEO
Global SEO configuration is in `pages/_app.tsx`. Page-specific SEO can be added using Next.js Head component.