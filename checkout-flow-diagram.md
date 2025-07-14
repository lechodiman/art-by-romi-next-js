# Checkout and Payment Flow Diagram

This diagram illustrates the complete checkout and payment flow for the Art by Romi e-commerce application.

## Flow Overview

The checkout process includes:
1. Cart validation
2. Two-step checkout form (contact info + shipping address)
3. Order creation in database
4. Payment intent creation with MercadoPago
5. Payment processing
6. Webhook handling for payment status updates
7. Order confirmation and email notifications

## Mermaid Diagram

```mermaid
graph TB
    Start([User in Cart]) --> ValidateCart{Validate Cart}
    ValidateCart -->|Invalid| ShowError[Show Validation Errors]
    ValidateCart -->|Valid| CheckoutBtn[Click 'Proceder al pago']
    
    CheckoutBtn --> CheckoutPage[/checkout Page]
    
    CheckoutPage --> ContactForm[Step 1: Contact Info Form]
    ContactForm --> FillContact[Fill: Name, Email, RUT, Phone]
    FillContact --> ValidateContact{Validate Contact Info}
    ValidateContact -->|Invalid| ContactErrors[Show Form Errors]
    ValidateContact -->|Valid| NextStep[Continue to Step 2]
    
    ContactErrors --> FillContact
    
    NextStep --> ShippingForm[Step 2: Shipping Address]
    ShippingForm --> FillShipping[Select Region/Comuna, Enter Address]
    FillShipping --> ValidateShipping{Validate Address}
    ValidateShipping -->|Invalid| ShippingErrors[Show Form Errors]
    ValidateShipping -->|Valid| SubmitOrder[Submit Order]
    
    ShippingErrors --> FillShipping
    
    SubmitOrder --> CreateOrderAPI[/api/create-order]
    CreateOrderAPI --> SaveOrder[(Save to Supabase)]
    SaveOrder --> GenerateOrderNum[Generate Order Number]
    GenerateOrderNum --> OrderCreated{Order Created?}
    
    OrderCreated -->|Failed| OrderError[Show Error Message]
    OrderCreated -->|Success| CreatePayment[/api/create-payment-intent]
    
    CreatePayment --> CheckIdempotency{Check Idempotency}
    CheckIdempotency -->|Exists| ReturnExisting[Return Existing Intent]
    CheckIdempotency -->|New| CreateIntent[Create Payment Intent]
    
    CreateIntent --> SaveIntent[(Save Payment Intent)]
    SaveIntent --> GenerateMP[Generate MercadoPago URL]
    
    ReturnExisting --> RedirectMP
    GenerateMP --> RedirectMP[Redirect to MercadoPago]
    
    RedirectMP --> MPCheckout[MercadoPago Checkout]
    MPCheckout --> UserPayment{User Payment Action}
    
    UserPayment -->|Cancel| ReturnFailure[Return to Site with Failure]
    UserPayment -->|Pay| ProcessPayment[Process Payment]
    
    ProcessPayment --> PaymentResult{Payment Result}
    PaymentResult -->|Failed| ReturnFailure
    PaymentResult -->|Success| ReturnSuccess[Return to Site with Success]
    
    ReturnFailure --> ConfirmationPage[/checkout/confirmacion]
    ReturnSuccess --> ConfirmationPage
    
    ProcessPayment -.-> Webhook[MercadoPago Webhook]
    Webhook --> WebhookAPI[/api/webhooks/mercadopago]
    WebhookAPI --> VerifySignature{Verify Signature}
    VerifySignature -->|Invalid| RejectWebhook[Reject Webhook]
    VerifySignature -->|Valid| UpdateOrder[Update Order Status]
    
    UpdateOrder --> CheckStatus{Payment Status}
    CheckStatus -->|Approved| SetProcessing[Set Status: Processing]
    CheckStatus -->|Rejected| SetFailed[Set Status: Failed]
    
    SetProcessing --> SendEmail[Send Confirmation Email]
    SendEmail --> UpdatedOrder[(Updated Order in DB)]
    SetFailed --> UpdatedOrder
    
    ConfirmationPage --> CheckParams{Check URL Params}
    CheckParams -->|success=true| ShowSuccess[Show Success Message]
    CheckParams -->|success=false| ShowFailure[Show Failure Message]
    
    ShowSuccess --> ClearCart[Clear Cart]
    ClearCart --> DisplayOrder[Display Order Number]
    DisplayOrder --> NextSteps[Show Next Steps]
    
    ShowFailure --> RetryOption[Show Retry Option]
    
    style Start fill:#e1f5e1
    style ShowSuccess fill:#4caf50,color:#fff
    style ShowFailure fill:#f44336,color:#fff
    style OrderError fill:#f44336,color:#fff
    style ValidateCart fill:#fff3cd
    style OrderCreated fill:#fff3cd
    style PaymentResult fill:#fff3cd
    style VerifySignature fill:#fff3cd
    style CheckStatus fill:#fff3cd
    style CreateOrderAPI fill:#bbdefb
    style CreatePayment fill:#bbdefb
    style WebhookAPI fill:#bbdefb
    style MPCheckout fill:#ffecb3
    style SaveOrder fill:#e3f2fd
    style SaveIntent fill:#e3f2fd
    style UpdatedOrder fill:#e3f2fd
```

## Key Components

### 1. Cart Validation (`/api/validate-cart`)
- Validates cart items against current inventory
- Calculates prices server-side using Sanity pricing configuration
- Checks customization limits (max 2 extra pets)

### 2. Checkout Form (`/checkout`)
- **Step 1**: Contact Information
  - Name, Email, Chilean RUT, Phone
- **Step 2**: Shipping Address  
  - Chilean regions/comunas, street address

### 3. Order Creation (`/api/create-order`)
- Creates order in Supabase database
- Generates unique order number
- Stores customer info, shipping details, and cart items

### 4. Payment Processing (`/api/create-payment-intent`)
- Creates payment intent with MercadoPago
- Implements idempotency to prevent duplicate charges
- Returns redirect URL for payment gateway

### 5. Webhook Handling (`/api/webhooks/mercadopago`)
- Verifies webhook signatures
- Updates order status based on payment result
- Sends confirmation emails for successful payments

### 6. Order Confirmation (`/checkout/confirmacion`)
- Displays success/failure message
- Shows order number on success
- Clears cart after successful payment

## Color Legend
- 🟢 Green: Start and success states
- 🔴 Red: Error states
- 🟡 Yellow: Decision points
- 🔵 Blue: API endpoints
- 🟠 Orange: External services (MercadoPago)
- 🔷 Light blue: Database operations

## Security Features
- Server-side price validation
- Webhook signature verification
- Idempotency for payment intents
- Secure database operations with service role keys