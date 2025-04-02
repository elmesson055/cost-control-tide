
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

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  orcamento: z.coerce.number().min(0, "O orçamento não pode ser negativo"),
});

interface CostCenterFormProps {
  onSubmit: (nome: string, orcamento: number) => Promise<boolean>;
  onCancel: () => void;
}

const CostCenterForm: React.FC<CostCenterFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      orcamento: 0,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = await onSubmit(values.nome, values.orcamento);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Centro de Custo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Marketing, Operacional, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="orcamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orçamento Mensal (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  placeholder="0.00" 
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default CostCenterForm;
