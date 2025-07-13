import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatRUT, formatChileanPhone } from '@/lib/chile-locations';
import { personalInfoSchema, type PersonalInfo } from '@/schemas/checkout';

export type ContactInfoData = PersonalInfo;

interface ContactInfoFormProps {
  onSubmit: (data: ContactInfoData) => void;
  defaultValues?: Partial<ContactInfoData>;
}

export function ContactInfoForm({ onSubmit, defaultValues }: ContactInfoFormProps) {
  const form = useForm<ContactInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || "",
      lastName: defaultValues?.lastName || "",
      email: defaultValues?.email || "",
      rut: defaultValues?.rut || "",
      phone: defaultValues?.phone || "",
    },
  });

  const handleSubmit = (values: ContactInfoData) => {
    onSubmit(values);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Información de contacto</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="correo@ejemplo.com" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
  );
}