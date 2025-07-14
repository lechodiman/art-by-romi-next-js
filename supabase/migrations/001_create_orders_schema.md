# Orders Database Schema

This document visualizes the database schema created by the `001_create_orders_tables.sql` migration.

## Entity Relationship Diagram

```mermaid
erDiagram
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENT_INTENTS : has
    ORDERS }o--|| AUTH_USERS : belongs_to

    ORDERS {
        uuid id PK
        varchar(50) order_number UK
        uuid customer_id FK
        enum status "pending|processing|completed|failed|cancelled"
        varchar(255) customer_email
        varchar(100) customer_first_name
        varchar(100) customer_last_name
        varchar(20) customer_rut
        varchar(20) customer_phone
        text shipping_address
        text shipping_additional_info
        varchar(100) shipping_region
        varchar(100) shipping_comuna
        decimal subtotal
        decimal shipping_cost
        decimal total
        jsonb metadata
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        varchar(255) product_id "Sanity CMS ID"
        varchar(255) product_name
        varchar(255) product_slug
        decimal unit_price
        integer quantity
        decimal total_price
        integer pet_count
        boolean has_special_background
        boolean has_frame
        varchar(50) frame_size
        text[] pet_names
        text background_description
        jsonb customizations
        timestamptz created_at
    }

    PAYMENT_INTENTS {
        uuid id PK
        uuid order_id FK
        varchar(50) provider "mercadopago|stripe|etc"
        varchar(255) provider_payment_id
        enum status "pending|processing|succeeded|failed|cancelled|refunded"
        decimal amount
        varchar(3) currency "CLP"
        jsonb provider_data
        varchar(100) error_code
        text error_message
        varchar(255) idempotency_key UK
        timestamptz created_at
        timestamptz updated_at
    }

    AUTH_USERS {
        uuid id PK
        "Supabase Auth Table"
    }
```

## Database Features

### Enums
- **order_status**: `pending`, `processing`, `completed`, `failed`, `cancelled`
- **payment_status**: `pending`, `processing`, `succeeded`, `failed`, `cancelled`, `refunded`

### Indexes
```mermaid
graph LR
    subgraph Orders Indexes
        idx1[idx_orders_customer_email]
        idx2[idx_orders_status]
        idx3[idx_orders_created_at]
    end
    
    subgraph Order Items Indexes
        idx4[idx_order_items_order_id]
        idx5[idx_order_items_product_id]
    end
    
    subgraph Payment Intents Indexes
        idx6[idx_payment_intents_order_id]
        idx7[idx_payment_intents_provider]
        idx8[idx_payment_intents_status]
    end
```

### Triggers
- **update_orders_updated_at**: Updates `updated_at` timestamp on orders table
- **update_payment_intents_updated_at**: Updates `updated_at` timestamp on payment_intents table

### Row Level Security (RLS)

```mermaid
graph TD
    subgraph Orders RLS
        A[Users can view own orders] --> B{customer_id = auth.uid OR service_role}
        C[Service role can insert]
        D[Service role can update]
    end
    
    subgraph Order Items RLS
        E[Users can view own items] --> F{Via orders table relationship}
        G[Service role can insert]
    end
    
    subgraph Payment Intents RLS
        H[Users can view own intents] --> I{Via orders table relationship}
        J[Service role has full access]
    end
```

## Key Relationships

1. **Orders → Auth Users**: Each order belongs to an authenticated user (optional)
2. **Orders → Order Items**: One-to-many relationship with CASCADE delete
3. **Orders → Payment Intents**: One-to-many relationship with CASCADE delete
4. **Unique Constraints**:
   - Order number must be unique
   - Only one payment intent per provider per order
   - Idempotency key must be unique

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant Orders
    participant OrderItems
    participant PaymentIntents
    
    User->>API: Create Order
    API->>Orders: Insert order with customer info
    API->>OrderItems: Insert order items with customizations
    API->>PaymentIntents: Create payment intent
    Note over PaymentIntents: Status: pending
    
    User->>API: Complete Payment
    API->>PaymentIntents: Update status to succeeded
    API->>Orders: Update status to processing
    Note over Orders: updated_at trigger fires
```

## Security Model

- **RLS Enabled**: All tables have Row Level Security enabled
- **User Access**: Users can only view their own data
- **Service Role**: Backend services have full CRUD access
- **Cascade Deletes**: Deleting an order removes all related items and payment intents