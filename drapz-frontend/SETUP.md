# Drapz - Setup Instructions

## Environment Configuration

1. Copy the environment variables example:
```bash
cp .env.local.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

The database schema has been automatically created with the following tables:
- `categories` - Product categories (Nationaux, Historiques, Thématiques, Personnalisés)
- `products` - Product catalog with sample flags
- `orders` - Customer orders
- `order_items` - Order line items

Sample data has been loaded including:
- 4 categories of flags
- 6 featured products with stock and pricing
- Proper RLS (Row Level Security) policies for data access

## Running the Application

Start the development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Features Implemented

### Pages
- `/` - Homepage with featured products and value propositions
- `/catalogue` - Full catalog with category filtering and sorting
- `/produit/[slug]` - Individual product pages with add to cart
- `/panier` - Shopping cart with quantity management
- `/paiement` - Checkout page (ready for Stripe integration)
- `/succes` - Order confirmation page
- `/echec` - Payment error page

### Components
- Header with navigation and cart counter
- Footer with category links
- Product cards with stock indicators
- Shopping cart with local storage persistence
- Responsive design for mobile and desktop

### Key Features
- Real-time cart management with Context API
- Product catalog filtering by category
- Sort by name or price
- Stock management and low stock warnings
- Image optimization with Next.js Image
- French language throughout
- Blue and red color scheme (avoiding purple/indigo)
- Clean, modern design with Tailwind CSS

## Next Steps for Spring Boot Integration

1. Create API endpoints in Spring Boot:
   - `GET /api/v1/produits` - List all products
   - `GET /api/v1/produits/{id}` - Get product by ID
   - `POST /api/v1/paiement/creer-session` - Create Stripe checkout session

2. Update the frontend to call your backend API instead of Supabase directly

3. Implement Stripe payment flow:
   - Frontend calls backend to create session
   - Backend creates Stripe session
   - Frontend redirects to Stripe
   - Stripe redirects back to `/succes` or `/echec`

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL with RLS)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Images**: Pexels (stock photos)
