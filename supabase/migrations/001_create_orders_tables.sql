-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded');

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  status order_status DEFAULT 'pending' NOT NULL,
  
  -- Customer information
  customer_email VARCHAR(255) NOT NULL,
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  customer_rut VARCHAR(20) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Shipping information
  shipping_address TEXT NOT NULL,
  shipping_additional_info TEXT,
  shipping_region VARCHAR(100) NOT NULL,
  shipping_comuna VARCHAR(100) NOT NULL,
  
  -- Order totals
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL, -- Sanity product ID
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(255),
  
  -- Pricing
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Customizations
  pet_count INTEGER DEFAULT 1,
  has_special_background BOOLEAN DEFAULT false,
  has_frame BOOLEAN DEFAULT false,
  frame_size VARCHAR(50),
  pet_names TEXT[],
  background_description TEXT,
  customizations JSONB DEFAULT '{}', -- For future extensibility
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create payment_intents table
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'mercadopago', 'stripe', etc.
  provider_payment_id VARCHAR(255) NOT NULL, -- External payment ID from provider
  status payment_status DEFAULT 'pending' NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CLP' NOT NULL,
  
  -- Provider-specific data
  provider_data JSONB DEFAULT '{}',
  
  -- Error handling
  error_code VARCHAR(100),
  error_message TEXT,
  
  -- Idempotency
  idempotency_key VARCHAR(255) UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  
  -- Ensure one payment intent per provider per order
  UNIQUE(order_id, provider)
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_payment_intents_order_id ON payment_intents(order_id);
CREATE INDEX idx_payment_intents_provider ON payment_intents(provider);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_intents_updated_at BEFORE UPDATE ON payment_intents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Policies for orders (allow users to see their own orders)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id OR auth.role() = 'service_role');

CREATE POLICY "Service role can insert orders" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'service_role');

-- Policies for order_items (follow order permissions)
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.customer_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Service role can insert order items" ON order_items
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Policies for payment_intents (follow order permissions)
CREATE POLICY "Users can view own payment intents" ON payment_intents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_intents.order_id 
      AND (orders.customer_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Service role can manage payment intents" ON payment_intents
  FOR ALL USING (auth.role() = 'service_role');