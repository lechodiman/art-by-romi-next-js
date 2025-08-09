export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: {
    type: string;
    number: string;
  };
  notes?: string;
}

export interface ProductCustomizationForm {
  extraPets: number;
  hasSpecialBackground: boolean;
  hasFrame: boolean;
  petNames: string[];
  backgroundDescription: string;
}

export interface FilterFormData {
  category?: string;
  size?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}