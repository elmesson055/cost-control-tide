
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
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

const supplierSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  tipo_documento: z.enum(["CNPJ", "CPF"]),
  numero_documento: z.string().optional(),
  contato: z.object({
    telefone: z.string().optional(),
    email: z.string().email("Email inválido").optional(),
    nome: z.string().optional()
  })
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nome: "",
      tipo_documento: "CNPJ",
      numero_documento: "",
      contato: {
        telefone: "",
        email: "",
        nome: ""
      }
    }
  });

  const onSubmit = async (data: SupplierFormValues) => {
    setIsSubmitting(true);
    try {
      // Clean up empty strings in the contato object
      const contato = Object.entries(data.contato).reduce((acc: any, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const { error } = await supabase
        .from("fornecedores")
        .insert([{
          nome: data.nome,
          tipo_documento: data.tipo_documento,
          numero_documento: data.numero_documento || null,
          contato: Object.keys(contato).length > 0 ? contato : null
        }]);

      if (error) throw error;
      
      toast.success("Fornecedor adicionado com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao salvar fornecedor:", error);
      toast.error(`Erro ao criar fornecedor: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Fornecedor</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do fornecedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo_documento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="CPF">CPF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero_documento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Documento</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número do documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contato.nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Contato</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do contato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contato.telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Digite o telefone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contato.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite o email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Fornecedor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;
