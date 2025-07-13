import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRegions, getDefaultRegion } from '@/lib/chile-locations';
import { useChileanLocations } from '@/hooks/useChileanLocations';

const shippingAddressSchema = z.object({
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  additionalInfo: z.string().optional(),
  region: z.string().min(1, "Debes seleccionar una región"),
  comuna: z.string().min(1, "Debes seleccionar una comuna"),
});

export type ShippingAddressData = z.infer<typeof shippingAddressSchema>;

interface ShippingAddressFormProps {
  onSubmit: (data: ShippingAddressData) => void;
  onBack: () => void;
  defaultValues?: Partial<ShippingAddressData>;
}

export function ShippingAddressForm({ onSubmit, onBack, defaultValues }: ShippingAddressFormProps) {
  const form = useForm<ShippingAddressData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      address: defaultValues?.address || "",
      additionalInfo: defaultValues?.additionalInfo || "",
      region: defaultValues?.region || getDefaultRegion(),
      comuna: defaultValues?.comuna || "",
    },
  });

  const selectedRegion = form.watch("region");
  const { availableComunas, setSelectedRegion } = useChileanLocations(selectedRegion);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    form.setValue("comuna", "");
  };

  return (
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
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleRegionChange(value);
                  }} 
                  defaultValue={field.value}
                >
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
              onClick={onBack}
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
  );
}