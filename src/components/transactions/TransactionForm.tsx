import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const transactionSchema = z.object({
  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  valor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O valor deve ser um número positivo",
  }),
  tipo: z.enum(["income", "expense"]),
  categoria_id: z.string().uuid("Selecione uma categoria válida"),
  data_vencimento: z.date().optional(),
  metodo_pagamento_id: z.string().uuid("Selecione um método de pagamento válido").optional(),
  fornecedor_id: z.string().uuid("Selecione um fornecedor válido").optional(),
  centro_custo_id: z.string().uuid("Selecione um centro de custo válido").optional(),
  recorrente: z.boolean().default(false),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export type Category = {
  id: string;
  nome: string;
  tipo: string;
};

export type PaymentMethod = {
  id: string;
  nome: string;
};

export type Supplier = {
  id: string;
  nome: string;
};

export type CostCenter = {
  id: string;
  nome: string;
};

interface TransactionFormProps {
  onSubmitSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("expense");
  const [openCategory, setOpenCategory] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openCostCenter, setOpenCostCenter] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      descricao: "",
      valor: "",
      tipo: "expense",
      recorrente: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categorias")
          .select("id, nome, tipo");
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
          .from("metodos_pagamento")
          .select("id, nome")
          .eq("ativo", true);
          
        if (paymentMethodsError) throw paymentMethodsError;
        setPaymentMethods(paymentMethodsData || []);

        const { data: suppliersData, error: suppliersError } = await supabase
          .from("fornecedores")
          .select("id, nome");
          
        if (suppliersError) throw suppliersError;
        setSuppliers(suppliersData || []);

        const { data: costCentersData, error: costCentersError } = await supabase
          .from("centros_custo")
          .select("id, nome");
          
        if (costCentersError) throw costCentersError;
        setCostCenters(costCentersData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      }
    };

    fetchData();
  }, []);

  const filteredCategories = categories.filter(
    (cat) => !cat.tipo || cat.tipo === typeFilter
  );

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    
    try {
      const valorNumerico = Number(data.valor);

      const transactionData = {
        descricao: data.descricao,
        valor: valorNumerico,
        tipo: data.tipo,
        categoria_id: data.categoria_id,
        data_vencimento: data.data_vencimento,
        metodo_pagamento_id: data.metodo_pagamento_id,
        fornecedor_id: data.fornecedor_id,
        centro_custo_id: data.centro_custo_id,
        recorrente: data.recorrente,
      };

      const { error } = await supabase
        .from("transacoes")
        .insert([transactionData]);

      if (error) throw error;
      
      toast.success("Transação criada com sucesso!");
      form.reset();
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao salvar transação:", error);
      toast.error(`Erro ao criar transação: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === "income" || value === "expense") {
      form.setValue("tipo", value);
      setTypeFilter(value);
      form.setValue("categoria_id", "");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transação</FormLabel>
              <Select
                onValueChange={(value) => handleTypeChange(value)}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_vencimento"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Vencimento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoria_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categoria</FormLabel>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategory}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find((cat) => cat.id === field.value)?.nome
                        : "Selecione uma categoria"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar categoria..." />
                    <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                    <CommandGroup>
                      {filteredCategories.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.nome}
                          onSelect={() => {
                            form.setValue("categoria_id", cat.id);
                            setOpenCategory(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              cat.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {cat.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metodo_pagamento_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.nome}
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
          name="fornecedor_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fornecedor</FormLabel>
              <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSupplier}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? suppliers.find((sup) => sup.id === field.value)?.nome
                        : "Selecione um fornecedor"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar fornecedor..." />
                    <CommandEmpty>Nenhum fornecedor encontrado.</CommandEmpty>
                    <CommandGroup>
                      {suppliers.map((sup) => (
                        <CommandItem
                          key={sup.id}
                          value={sup.nome}
                          onSelect={() => {
                            form.setValue("fornecedor_id", sup.id);
                            setOpenSupplier(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              sup.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {sup.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="centro_custo_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Centro de Custo</FormLabel>
              <Popover open={openCostCenter} onOpenChange={setOpenCostCenter}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCostCenter}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? costCenters.find((cc) => cc.id === field.value)?.nome
                        : "Selecione um centro de custo"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar centro de custo..." />
                    <CommandEmpty>Nenhum centro de custo encontrado.</CommandEmpty>
                    <CommandGroup>
                      {costCenters.map((cc) => (
                        <CommandItem
                          key={cc.id}
                          value={cc.nome}
                          onSelect={() => {
                            form.setValue("centro_custo_id", cc.id);
                            setOpenCostCenter(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              cc.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {cc.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recorrente"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Transação Recorrente</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Transação"}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
