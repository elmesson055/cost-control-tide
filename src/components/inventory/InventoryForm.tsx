
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewInventoryItem } from "@/hooks/useInventory";

const inventorySchema = z.object({
  nome_item: z.string().min(1, "Nome do item é obrigatório"),
  unidade_medida: z.string().optional(),
  estoque_atual: z.coerce.number().min(0, "O estoque não pode ser negativo"),
  estoque_minimo: z.coerce.number().min(0, "O estoque mínimo não pode ser negativo"),
  custo_unitario: z.coerce.number().min(0, "O custo não pode ser negativo").optional(),
  fornecedor_id: z.string().optional().nullable(),
});

interface InventoryFormProps {
  onSubmit: (data: NewInventoryItem) => Promise<void>;
  onCancel: () => void;
  suppliers: {id: string, nome: string}[];
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, onCancel, suppliers }) => {
  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      nome_item: "",
      unidade_medida: "",
      estoque_atual: 0,
      estoque_minimo: 0,
      custo_unitario: 0,
      fornecedor_id: null,
    },
  });

  const handleSubmit = async (values: z.infer<typeof inventorySchema>) => {
    await onSubmit(values);
    form.reset();
  };

  const unidadesMedida = ["un", "kg", "L", "mL", "g", "pacote", "caixa", "saco"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Item</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Café em Grãos, Leite, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unidade_medida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade de Medida</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unidadesMedida.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fornecedor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="estoque_atual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade Atual</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    placeholder="0" 
                    min="0"
                    step="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="estoque_minimo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade Mínima</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    placeholder="0" 
                    min="0"
                    step="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="custo_unitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Unitário (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    placeholder="0.00" 
                    min="0"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InventoryForm;
