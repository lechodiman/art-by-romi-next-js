import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TypographyH1 } from '@/components/TypographyH1';
import { useCartItems, useCartActions } from '@/context/CartContext';
import { Product } from '@/types/Product';
import { getClient } from '@/sanity/lib/client';
import { productsByIdsQuery } from '@/sanity/lib/queries';
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

export default function Checkout() {
  const router = useRouter();
  const items = useCartItems();
  const { clearCart } = useCartActions();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

    async function fetchProducts() {
      try {
        const client = getClient();
        const productIds = items.map((item) => item.productId);
        const fetchedProducts = await client.fetch(productsByIdsQuery, {
          ids: productIds,
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [items, router]);

  const getProduct = (productId: string) => {
    return products.find((p) => p._id === productId);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = getProduct(item.productId);
      if (!product) return total;

      let itemPrice = product.price;

      if (item.options.includes('extra-pet')) {
        const petPrices: { [key: string]: number } = {
          '1': 15000,
          '2': 20000,
        };
        itemPrice += petPrices[item.petCount] || 0;
      }

      if (item.options.includes('special-background')) {
        itemPrice += 5000;
      }

      if (item.options.includes('frame')) {
        const framePrices = {
          mini: 3000,
          medium: 5000,
          large: 7000,
        };
        itemPrice += framePrices[product.size] || framePrices.medium;
      }

      return total + itemPrice * item.quantity;
    }, 0);
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      // Format the data
      const orderData = {
        personalInfo: {
          firstName: values.firstName,
          lastName: values.lastName,
          rut: formatRUT(values.rut),
          phone: formatChileanPhone(values.phone),
        },
        shippingAddress: {
          address: values.address,
          additionalInfo: values.additionalInfo || '',
          region: values.region,
          comuna: values.comuna,
        },
        items: items.map(item => {
          const product = getProduct(item.productId);
          return {
            productId: item.productId,
            productName: product?.name || '',
            quantity: item.quantity,
            options: item.options,
            petCount: item.petCount,
          };
        }),
        total: calculateTotal(),
        createdAt: new Date().toISOString(),
      };

      // For now, just log the order data
      console.log('Order data:', orderData);

      // Show success message
      toast.success('¡Pedido realizado con éxito!');

      // Set confirmation flag
      localStorage.setItem('orderConfirmed', 'true');

      // Clear cart
      clearCart();

      // Redirect to confirmation page
      router.push('/checkout/confirmacion');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error al procesar el pedido');
    }
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof CheckoutFormValues)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'rut', 'phone'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['address', 'region', 'comuna'];
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return (
      <main className='flex-grow bg-gray-100'>
        <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
          <TypographyH1 className='text-center'>Checkout</TypographyH1>
          <div className='max-w-4xl mx-auto text-center'>
            <p className='text-gray-600'>Cargando...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='flex-grow bg-gray-100'>
      <section className='container flex-grow px-5 mx-auto space-y-8 py-14'>
        <TypographyH1 className='text-center'>Finalizar Compra</TypographyH1>

        {/* Progress Indicator */}
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-center mb-8'>
            <div className='flex items-center space-x-4'>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 1 ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-zinc-700' : 'bg-gray-300'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 2 ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-20 h-1 ${currentStep >= 3 ? 'bg-zinc-700' : 'bg-gray-300'}`} />
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= 3 ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step Labels */}
          <div className='flex justify-between mb-8 text-sm'>
            <span className={currentStep === 1 ? 'font-semibold' : ''}>Información Personal</span>
            <span className={currentStep === 2 ? 'font-semibold' : ''}>Dirección de Envío</span>
            <span className={currentStep === 3 ? 'font-semibold' : ''}>Confirmar Pedido</span>
          </div>
        </div>

        <div className='max-w-4xl mx-auto'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className='space-y-6'>
                    <h2 className='text-xl font-semibold mb-4'>Información Personal</h2>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='flex justify-end'>
                      <Button 
                        type="button" 
                        onClick={handleNextStep}
                        className='bg-zinc-700 hover:bg-zinc-600'
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <div className='space-y-6'>
                    <h2 className='text-xl font-semibold mb-4'>Dirección de Envío</h2>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Av. Providencia 1234" {...field} />
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
                            <Input placeholder="Depto 301, Torre B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={!selectedRegion}
                            >
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
                    </div>

                    <div className='flex justify-between'>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePreviousStep}
                      >
                        Anterior
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleNextStep}
                        className='bg-zinc-700 hover:bg-zinc-600'
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Order Confirmation */}
                {currentStep === 3 && (
                  <div className='space-y-6'>
                    <h2 className='text-xl font-semibold mb-4'>Confirmar Pedido</h2>
                    
                    {/* Order Summary */}
                    <div className='border rounded-lg p-4 space-y-4'>
                      <h3 className='font-semibold'>Resumen del Pedido</h3>
                      
                      {items.map((item) => {
                        const product = getProduct(item.productId);
                        if (!product) return null;

                        let itemPrice = product.price;
                        const customizations: string[] = [];

                        // Calculate price and collect customizations
                        if (item.options.includes('extra-pet')) {
                          const petPrices: { [key: string]: number } = {
                            '1': 15000,
                            '2': 20000,
                          };
                          const extraPetPrice = petPrices[item.petCount] || 0;
                          itemPrice += extraPetPrice;
                          customizations.push(`${parseInt(item.petCount) + 1} mascotas (+$${extraPetPrice.toLocaleString('es-CL')})`);
                        }

                        if (item.options.includes('special-background')) {
                          itemPrice += 5000;
                          customizations.push('Fondo personalizado (+$5.000)');
                        }

                        if (item.options.includes('frame')) {
                          const framePrices = {
                            mini: 3000,
                            medium: 5000,
                            large: 7000,
                          };
                          const framePrice = framePrices[product.size] || framePrices.medium;
                          itemPrice += framePrice;
                          customizations.push(`Marco incluido (+$${framePrice.toLocaleString('es-CL')})`);
                        }

                        return (
                          <div key={item.cartItemId} className='border-b pb-3 last:border-b-0'>
                            <div className='flex justify-between items-start'>
                              <div className='flex-1'>
                                <div className='flex justify-between items-center'>
                                  <span className='font-medium'>{product.name}</span>
                                  <span className='font-medium text-right'>
                                    ${(itemPrice * item.quantity).toLocaleString('es-CL')}
                                  </span>
                                </div>
                                <div className='text-xs text-gray-600 mt-1'>
                                  <p>Precio base: ${product.price.toLocaleString('es-CL')} x {item.quantity}</p>
                                  {customizations.map((custom, idx) => (
                                    <p key={idx}>• {custom}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className='border-t pt-2'>
                        <div className='flex justify-between font-semibold'>
                          <span>Total</span>
                          <span>${calculateTotal().toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className='border rounded-lg p-4 space-y-2'>
                      <h3 className='font-semibold mb-2'>Información de Envío</h3>
                      <p className='text-sm'>
                        <span className='font-medium'>Nombre:</span> {form.getValues('firstName')} {form.getValues('lastName')}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>RUT:</span> {formatRUT(form.getValues('rut'))}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>Teléfono:</span> {form.getValues('phone')}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>Dirección:</span> {form.getValues('address')}
                        {form.getValues('additionalInfo') && `, ${form.getValues('additionalInfo')}`}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>Comuna:</span> {form.getValues('comuna')}, {form.getValues('region')}
                      </p>
                    </div>

                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                      <p className='text-sm text-blue-800'>
                        <strong>Nota:</strong> Este es un pedido de demostración. No se realizará ningún cobro.
                        En una implementación real, aquí se integraría el procesador de pagos.
                      </p>
                    </div>

                    <div className='flex justify-between'>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePreviousStep}
                      >
                        Anterior
                      </Button>
                      <Button 
                        type="submit"
                        className='bg-zinc-700 hover:bg-zinc-600'
                      >
                        Confirmar Pedido
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}