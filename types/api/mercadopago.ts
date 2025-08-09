export interface MercadoPagoPreference {
  id: string;
  client_id: string;
  collector_id: number;
  date_created: string;
  date_of_expiration: string | null;
  expires: boolean;
  init_point: string;
  sandbox_init_point: string;
  items: MercadoPagoItem[];
  payer: MercadoPagoPayer;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved' | 'all';
  payment_methods: {
    excluded_payment_methods: Array<{ id: string }>;
    excluded_payment_types: Array<{ id: string }>;
    installments: number;
  };
  notification_url: string;
  external_reference: string;
}

export interface MercadoPagoItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface MercadoPagoPayer {
  name: string;
  surname: string;
  email: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type: string;
    number: string;
  };
  address?: {
    street_name?: string;
    street_number?: number;
    zip_code?: string;
  };
}

export interface MercadoPagoPayment {
  id: number;
  date_created: string;
  date_approved: string | null;
  date_last_updated: string;
  money_release_date: string | null;
  operation_type: string;
  issuer_id: string;
  payment_method_id: string;
  payment_type_id: string;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  status_detail: string;
  currency_id: string;
  description: string;
  live_mode: boolean;
  sponsor_id: number | null;
  authorization_code: string | null;
  collector_id: number;
  payer: MercadoPagoPayer;
  metadata: Record<string, any>;
  additional_info: Record<string, any>;
  order: {
    id: string;
    type: string;
  };
  external_reference: string;
  transaction_amount: number;
  transaction_amount_refunded: number;
  coupon_amount: number;
  differential_pricing_id: number | null;
  deduction_schema: any | null;
  transaction_details: {
    net_received_amount: number;
    total_paid_amount: number;
    overpaid_amount: number;
    external_resource_url: string | null;
    installment_amount: number;
    financial_institution: string | null;
    payment_method_reference_id: string | null;
  };
  captured: boolean;
  binary_mode: boolean;
  call_for_authorize_id: string | null;
  statement_descriptor: string | null;
  installments: number;
  card: Record<string, any>;
  notification_url: string;
  refunds: any[];
}