# Cara Studio

A mobile-first fashion e-commerce storefront built with **Next.js 15**, **React 18**, and **TypeScript**. Designed and localized for the Kenyan market — featuring KES pricing, M-Pesa & Airtel Money checkout, and Nairobi-based delivery.

> **Live site:** [cara](https://cara-three-lac.vercel.app/)

---

## Features

- **Mobile-first UI** — Every page and component starts at small viewports and progressively enhances
- **Shopping cart** — Slide-out drawer with quantity controls, size selection, and running totals
- **M-Pesa & Airtel Money checkout** — The only accepted payment methods, matching the Kenyan mobile money ecosystem
- **Nairobi delivery options** — Same-day CBD delivery, Westlands pick-up, and Greater Nairobi courier
- **Product catalog** — Featured products, new arrivals, and a full shop with individual detail pages
- **Blog** — Editorial-style fashion content
- **Contact form** — With embedded Google Maps (Nairobi) and team directory
- **Static generation** — All pages are pre-rendered at build time for fast loads
- **WebP image pipeline** — Automated PNG/JPG → WebP conversion via `@254guru/webp-convert`
- **Full SEO** — Open Graph, Twitter Cards, canonical URLs, structured metadata on every page

---

## Tech Stack

| Category        | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | [Next.js 15](https://nextjs.org/) (App Router, SSG)   |
| Language        | TypeScript 5 (strict mode)                            |
| UI Library      | React 18                                              |
| Styling         | CSS custom properties + mobile-first responsive CSS   |
| Fonts           | Manrope (body) + Space Grotesk (headings) via Google  |
| Icons           | Font Awesome 6.5                                      |
| Carousel        | Swiper 12                                             |
| Image Pipeline  | [@254guru/webp-convert](https://www.npmjs.com/package/@254guru/webp-convert) |
| Linting         | ESLint with eslint-config-next                        |

---

## Project Structure

```
cara-store/
├── public/                        # Static assets
│   ├── about-img/                 # About page images
│   ├── banner-img/                # Hero & banner images
│   ├── blog-img/                  # Blog post images
│   ├── extra-img/                 # Logo, loader gif, misc
│   ├── features-img/              # Feature section icons
│   ├── pay-img/                   # Payment provider logos
│   ├── people-img/                # Team photos
│   └── products-img/              # Product photography
├── scripts/
│   └── optimize-images.cjs        # WebP conversion script
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.tsx             # Root layout (metadata, providers, shell)
│   │   ├── page.tsx               # Homepage
│   │   ├── globals.css            # Design system & all styles
│   │   ├── about/page.tsx         # About page
│   │   ├── blog/page.tsx          # Blog listing
│   │   ├── contact/
│   │   │   ├── page.tsx           # Contact page (server, metadata)
│   │   │   └── ContactClient.tsx  # Contact form (client component)
│   │   └── shop/
│   │       ├── page.tsx           # Shop listing
│   │       └── [id]/
│   │           ├── page.tsx       # Product detail (SSG + dynamic metadata)
│   │           └── ProductDetailClient.tsx
│   ├── components/
│   │   ├── layout/                # Header, Footer, Cart
│   │   ├── sections/              # FeaturesSection, Newsletter
│   │   └── ui/                    # ProductCard, Loader
│   ├── constants/index.ts         # Nav links, sizes, shipping, payment methods
│   ├── context/CartContext.tsx     # Cart state (useReducer + Context API)
│   ├── data/
│   │   ├── products.ts            # Product catalog data
│   │   └── blogPosts.ts           # Blog post data
│   ├── hooks/useCart.ts           # useCart() custom hook
│   ├── lib/utils.ts              # formatPrice (KES), star rating helpers
│   ├── services/
│   │   ├── productService.ts      # Product data access layer
│   │   └── blogService.ts         # Blog data access layer
│   └── types/index.ts            # Product, CartItem, BlogPost interfaces
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/Cara.git
cd Cara

# Install dependencies
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

The build script automatically converts images to WebP before compiling Next.js.

---

## Scripts

| Script               | Command                             | Description                                         |
| -------------------- | ----------------------------------- | --------------------------------------------------- |
| `dev`                | `next dev`                          | Start the development server                        |
| `build`              | `node scripts/optimize-images.cjs && next build` | Optimize images, then create a production build     |
| `start`              | `next start`                        | Start the production server                         |
| `lint`               | `next lint`                         | Run ESLint checks                                   |
| `images:optimize`    | `node scripts/optimize-images.cjs`  | Convert all PNG/JPG images to WebP                  |

---

## Image Optimization

All product, banner, blog, and asset images are served in **WebP** format for smaller file sizes and faster loads.

### How it works

1. Place original PNG/JPG/JPEG files in any subdirectory under `public/`
2. Run `pnpm images:optimize` (also runs automatically before every build)
3. The script processes each subdirectory with `@254guru/webp-convert` at **quality 82**
4. WebP files are created alongside the originals, matching filenames
5. Source code references `.webp` extensions directly

### Next.js image config

The `next.config.mjs` enables AVIF and WebP format negotiation:

```js
images: {
  formats: ['image/avif', 'image/webp'],
}
```

---

## Pages & Routes

| Route        | Page                   | Rendering | Description                              |
| ------------ | ---------------------- | --------- | ---------------------------------------- |
| `/`          | Homepage               | Static    | Hero, featured products, new arrivals, KPI grid |
| `/shop`      | Shop                   | Static    | Full product catalog with grid layout    |
| `/shop/[id]` | Product Detail         | SSG       | Individual product page with dynamic metadata |
| `/blog`      | Blog                   | Static    | Fashion & style editorial listing        |
| `/about`     | About                  | Static    | Brand story and value propositions       |
| `/contact`   | Contact                | Static    | Contact form, team directory, Nairobi map |

All pages are pre-rendered at build time. Product detail pages use `generateStaticParams` for SSG across all product IDs.

---

## Architecture

### State Management

Cart state is managed with **React Context + useReducer**, exposed via the `useCart()` hook.

```
CartProvider (context/CartContext.tsx)
  └── useCart() hook (hooks/useCart.ts)
       ├── state: { items, isOpen }
       ├── addItem / removeItem / updateQuantity / updateSize
       ├── clearCart / openCart / closeCart
       └── computed: total, itemCount
```

### Service Layer

Data access is abstracted through service functions so components never import data files directly:

- `productService.ts` — `getFeaturedProducts()`, `getNewArrivals()`, `getShopProducts()`, `getProductById()`, `getAllProductIds()`
- `blogService.ts` — `getBlogPosts()`, `getBlogPostById()`

### Component Organization

| Directory              | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `components/layout/`   | Persistent shell: Header, Footer, Cart     |
| `components/sections/` | Page sections: FeaturesSection, Newsletter |
| `components/ui/`       | Reusable atoms: ProductCard, Loader        |

### Server vs Client Components

- **Server** (default): All page files, layout, FeaturesSection, Newsletter, Footer
- **Client** (`'use client'`): Header, Cart, ProductCard, ProductDetailClient, ContactClient, Loader

---

## Design System

Defined in `globals.css` using CSS custom properties:

### Color Tokens

| Token            | Value      | Usage                 |
| ---------------- | ---------- | --------------------- |
| `--bg`           | `#fffaf3`  | Page background       |
| `--surface`      | `#fff`     | Card backgrounds      |
| `--text`         | `#152421`  | Primary text          |
| `--text-soft`    | `#4d5b58`  | Secondary text        |
| `--brand`        | `#125b50`  | Primary brand (teal)  |
| `--brand-2`      | `#eb6a2b`  | Accent (orange)       |
| `--brand-3`      | `#f4c44e`  | Highlight (gold)      |
| `--line`         | `#e7ddd0`  | Borders & dividers    |

### Typography

- **Body:** Manrope (400–800 weight)
- **Headings:** Space Grotesk (500–700 weight)

### Layout

- Container max-width: `1120px`
- Border radii: `12px` / `18px` / `24px`
- Responsive breakpoints: mobile-first, scaling up at `640px`, `768px`, `1024px`

---

## SEO

Every page exports a `metadata` object (or uses `generateMetadata` for dynamic routes) providing:

- **Title** with template: `%s | Cara Studio`
- **Description** tailored to page content and Kenyan market
- **Open Graph** tags (title, description, image, type, siteName)
- **Twitter Card** tags (summary_large_image)
- **Canonical URLs** via `alternates`
- **Keywords** including: fashion, Nairobi, Kenya, M-Pesa, Airtel Money

### Localization

- **Currency:** KES (Kenyan Shillings) via `Intl.NumberFormat('en-KE')`
- **Payment:** M-Pesa and Airtel Money only
- **Shipping:** Nairobi CBD, Westlands, Greater Nairobi
- **Contact:** +254 phone numbers, Nairobi Google Maps embed
- **Timezone:** EAT (East Africa Time)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please ensure `pnpm lint` passes before submitting.

---

## License

This project is private. All rights reserved.
