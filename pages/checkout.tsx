import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TypographyH1 } from '@/components/TypographyH1';
import { useCartItems, useCartActions } from '@/context/CartContext';
import { Product } from '@/types/Product';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  getRegions, 
  getComunasByRegion, 
  getDefaultRegion,
  validateRUT,
  formatRUT,
  validateChileanPhone,
  formatChileanPhone
} from '@/lib/chile-locations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Step 1 validation schema
const step1Schema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  rut: z.string().refine((val) => validateRUT(val), {
    message: "RUT inválido",
  }),
  phone: z.string().refine((val) => validateChileanPhone(val), {
    message: "Número de teléfono inválido. Debe ser un número chileno",
  }),
});

// Full checkout form schema (for final submission)
const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  rut: z.string().refine((val) => validateRUT(val), {
    message: "RUT inválido",
  }),
  phone: z.string().refine((val) => validateChileanPhone(val), {
    message: "Número de teléfono inválido. Debe ser un número chileno",
  }),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  additionalInfo: z.string().optional(),
  region: z.string().min(1, "Debes seleccionar una región"),
  comuna: z.string().min(1, "Debes seleccionar una comuna"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface ValidatedCartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  customizations?: {
    extraPets?: number;
    hasSpecialBackground?: boolean;
    hasFrame?: boolean;
    petNames?: string[];
    backgroundDescription?: string;
  };
  valid: boolean;
  error?: string;
  calculatedPrice?: number;
  product?: Product;
}

interface ValidateCartResponse {
  valid: boolean;
  items: ValidatedCartItem[];
  total: number;
  pricingConfigId: string;
}

export default function Checkout() {
  const router = useRouter();
  const items = useCartItems();
  const { clearCart } = useCartActions();
  const [validatedItems, setValidatedItems] = useState<ValidatedCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableComunas, setAvailableComunas] = useState<string[]>(
    getComunasByRegion(getDefaultRegion())
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      rut: "",
      phone: "",
      address: "",
      additionalInfo: "",
      region: getDefaultRegion(),
      comuna: "",
    },
  });

  const selectedRegion = form.watch("region");

  useEffect(() => {
    if (selectedRegion) {
      const comunas = getComunasByRegion(selectedRegion);
      setAvailableComunas(comunas);
      form.setValue("comuna", "");
    }
  }, [selectedRegion, form]);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrito');
      return;
    }

    async function validateCart() {
      setValidating(true);
      try {
        // Transform cart items to match API format
        const apiItems = items.map(item => ({
          cartItemId: item.cartItemId || '',
          productId: item.productId,
          quantity: item.quantity,
          customizations: {
            extraPets: parseInt(item.petCount) || 0,
            hasSpecialBackground: item.options.includes('special-background'),
            hasFrame: item.options.includes('frame')
          }
        }));

        const response = await fetch('/api/validate-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: apiItems }),
        });

        if (response.ok) {
          const data: ValidateCartResponse = await response.json();
          if (!data.valid) {
            toast.error('Algunos productos no están disponibles');
            router.push('/carrito');
            return;
          }
          setValidatedItems(data.items);
          setCartTotal(data.total);
        } else {
          toast.error('Error al validar el carrito');
          router.push('/carrito');
        }
      } catch (error) {
        console.error('Error validating cart:', error);
        toast.error('Error al procesar el carrito');
        router.push('/carrito');
      } finally {
        setLoading(false);
        setValidating(false);
      }
    }

    validateCart();
  }, [items, router]);

  const getCustomizationText = (item: ValidatedCartItem) => {
    const customizations = [];

    if (item.customizations?.extraPets) {
      customizations.push(
        `+${item.customizations.extraPets} mascota${item.customizations.extraPets === 1 ? '' : 's'}`
      );
    }

    if (item.customizations?.hasSpecialBackground) {
      customizations.push('Fondo especial');
    }

    if (item.customizations?.hasFrame && item.product?.size) {
      customizations.push(`Marco (${item.product.size})`);
    }

    return customizations.join(' • ');
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      // Here you would normally process the payment
      // For now, we'll just log the order
      const orderData = {
        customer: {
          ...values,
          rut: formatRUT(values.rut),
          phone: formatChileanPhone(values.phone),
        },
        items: validatedItems.map(item => ({
          productId: item.productId,
          productName: item.product?.name,
          quantity: item.quantity,
          price: item.calculatedPrice,
          customizations: item.customizations,
        })),
        total: cartTotal,
        createdAt: new Date().toISOString(),
      };

      console.log('Order submitted:', orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
      router.push('/');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error al procesar el pedido');
    }
  };

  if (loading || validating) {
    return (
      <main className="flex-grow bg-gray-100">
        <section className="container px-5 mx-auto py-14">
          <TypographyH1 className="text-center">Checkout</TypographyH1>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600">
              {validating ? 'Validando carrito...' : 'Cargando...'}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-100">
      <section className="container px-5 mx-auto py-14">
        <TypographyH1 className="text-center mb-8">Checkout</TypographyH1>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1 ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-24 h-1 ${
                currentStep >= 2 ? 'bg-zinc-700' : 'bg-gray-300'
              }`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2 ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Información de contacto</h2>
                  
                  <Form {...form}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      // Manually validate step 1 fields
                      const step1Values = {
                        firstName: form.getValues('firstName'),
                        lastName: form.getValues('lastName'),
                        rut: form.getValues('rut'),
                        phone: form.getValues('phone'),
                      };
                      
                      const result = step1Schema.safeParse(step1Values);
                      if (result.success) {
                        setCurrentStep(2);
                      } else {
                        // Trigger form validation to show errors
                        form.trigger(['firstName', 'lastName', 'rut', 'phone']);
                      }
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Juan" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Apellido</FormLabel>
                              <FormControl>
                                <Input placeholder="Pérez" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="rut"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RUT</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="12.345.678-9" 
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatRUT(e.target.value);
                                  field.onChange(formatted);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+56 9 1234 5678" 
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatChileanPhone(e.target.value);
                                  field.onChange(formatted);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Continuar a dirección de envío
                      </Button>
                    </form>
                  </Form>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Dirección de envío</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Región</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una región" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[200px] overflow-y-auto">
                                {getRegions().map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="comuna"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comuna</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una comuna" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[200px] overflow-y-auto">
                                {availableComunas.map((comuna) => (
                                  <SelectItem key={comuna} value={comuna}>
                                    {comuna}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Input placeholder="Av. Principal 123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Información adicional (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Depto 301, timbre azul" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                        >
                          Volver
                        </Button>
                        <Button type="submit" className="flex-1">
                          Confirmar pedido
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
                
                <div className="space-y-4 mb-4">
                  {validatedItems.map((item) => {
                    if (!item.product || !item.valid) return null;
                    
                    return (
                      <div key={item.cartItemId} className="pb-4 border-b last:border-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            {getCustomizationText(item) && (
                              <p className="text-sm text-gray-600">{getCustomizationText(item)}</p>
                            )}
                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            ${((item.calculatedPrice || 0) * item.quantity).toLocaleString('es-CL')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString('es-CL')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Envío gratis incluido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}