# Supabase Migrations

This directory contains SQL migrations for the Supabase database schema.

## Running Migrations

To apply these migrations to your Supabase project:

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content of each migration file in order
4. Run each migration

### Option 2: Using Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

## Migration Files

- `001_create_orders_tables.sql` - Creates the core tables for order management:
  - `orders` - Main orders table
  - `order_items` - Individual items within orders
  - `payment_intents` - Payment processing records
  
## Important Notes

- These migrations include Row Level Security (RLS) policies
- The service role key is required for API operations that insert/update orders
- Users can only view their own orders when using the anon key
- The schema supports multiple payment providers through the `payment_intents` table

## Environment Variables

Make sure you have the following environment variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For server-side operations
```