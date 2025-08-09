export interface CustomerInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  identification?: {
    type: string;
    number: string;
  };
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer extends CustomerInfo {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  addresses?: CustomerAddress[];
  defaultAddress?: CustomerAddress;
}