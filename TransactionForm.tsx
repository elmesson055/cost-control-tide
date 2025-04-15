import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
import { Checkbox } from "@/components/ui/checkbox";

const transactionSchema = z.object({
  descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  valor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O valor deve ser um número positivo",
  }),
  tipo: z.enum(["income", "expense"]),
  categoria_id: z.string().uuid("Selecione uma categoria válida").optional(),
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
  tipo?: string;
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
  categorias?: Category[];
  fornecedores?: Supplier[];
  centrosCusto?: CostCenter[];
  metodosPagamento?: PaymentMethod[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmitSuccess,
  categorias: propCategorias = [],
  fornecedores: propFornecedores = [],
  centrosCusto: propCentrosCusto = [],
  metodosPagamento: propMetodosPagamento = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 1. Removed state variables
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  // const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("expense");
  const [openCategory, setOpenCategory] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openCostCenter, setOpenCostCenter] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      descricao: "",
      valor: "",
      tipo: "expense",
      recorrente: false,
    },
  });

  // 2. Removed useEffect for fetching data
  // useEffect(() => { ... }, []);

  // Filtrar categorias com base no tipo selecionado
  const filteredCategories = propCategorias.filter( // Using propCategorias here
    (cat) => !cat?.tipo || cat?.tipo === typeFilter
  );

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);

    try {
      const valorNumerico = Number(data.valor);

      // Format the date to ISO string if it exists
      const data_vencimento = data.data_vencimento
        ? data.data_vencimento.toISOString()
        : null;

      const transactionData = {
        descricao: data.descricao,
        valor: valorNumerico,
        tipo: data.tipo,
        categoria_id: data.categoria_id,
        data_vencimento, // Now it's a string, not a Date
        metodo_pagamento_id: data.metodo_pagamento_id,
        fornecedor_id: data.fornecedor_id,
        centro_custo_id: data.centro_custo_id,
        recorrente: data.recorrente,
      };

      const { error } = await supabase
        .from("transacoes")
        .insert(transactionData); // Fixed: pass a single object, not an array

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
        {/* ... other form fields ... */}

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
                      {field.value && filteredCategories.length > 0
                        ? filteredCategories.find((cat) => cat?.id === field.value)?.nome || "Selecione uma categoria"
                        : "Selecione uma categoria"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover">
                  <Command>
                    <CommandInput placeholder="Buscar categoria..." />
                    <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                    <CommandGroup>
                      {/* 4. Added console.log */}
                      {console.log("Data for rendering categories:", propCategorias)}
                      {isLoading ? (
                        <CommandItem disabled>
                          Carregando categorias...
                        </CommandItem>
                      ) : filteredCategories && filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => (
                          cat && cat.id && cat.nome ? (
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
                          ) : null
                        ))
                      ) : (
                        <CommandItem disabled>
                          Nenhuma categoria disponível
                        </CommandItem>
                      )}
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
                  {/* Replaced paymentMethods with propMetodosPagamento */}
                  {/* Added console.log */}
                  {console.log("Data for rendering payment methods:", propMetodosPagamento)}
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Carregando métodos...</SelectItem>
                  ) : propMetodosPagamento && propMetodosPagamento.length > 0 ? (
                    propMetodosPagamento.map((method) => (
                      method && method.id && method.nome ? (
                        <SelectItem key={method.id} value={method.id}>
                          {method.nome}
                        </SelectItem>
                      ) : null
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhum método disponível</SelectItem>
                  )}
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
                      {field.value && propFornecedores.length > 0  // Using propFornecedores
                        ? propFornecedores.find((sup) => sup?.id === field.value)?.nome || "Selecione um fornecedor"
                        : "Selecione um fornecedor"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover">
                  <Command>
                    <CommandInput placeholder="Buscar fornecedor..." />
                    <CommandEmpty>Nenhum fornecedor encontrado.</CommandEmpty>
                    <CommandGroup>
                      {/* Replaced suppliers with propFornecedores */}
                      {/* Added console.log */}
                      {console.log("Data for rendering suppliers:", propFornecedores)}
                      {isLoading ? (
                        <CommandItem disabled>
                          Carregando fornecedores...
                        </CommandItem>
                      ) : propFornecedores && propFornecedores.length > 0 ? (
                        propFornecedores.map((sup) => (
                          sup && sup.id && sup.nome ? (
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
                          ) : null
                        ))
                      ) : (
                        <CommandItem disabled>
                          Nenhum fornecedor disponível
                        </CommandItem>
                      )}
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
                      {field.value && propCentrosCusto.length > 0 // Using propCentrosCusto
                        ? propCentrosCusto.find((cc) => cc?.id === field.value)?.nome || "Selecione um centro de custo"
                        : "Selecione um centro de custo"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover">
                  <Command>
                    <CommandInput placeholder="Buscar centro de custo..." />
                    <CommandEmpty>Nenhum centro de custo encontrado.</CommandEmpty>
                    <CommandGroup>
                      {/* Replaced costCenters with propCentrosCusto */}
                      {/* Added console.log */}
                      {console.log("Data for rendering cost centers:", propCentrosCusto)}
                      {isLoading ? (
                        <CommandItem disabled>
                          Carregando centros de custo...
                        </CommandItem>
                      ) : propCentrosCusto && propCentrosCusto.length > 0 ? (
                        propCentrosCusto.map((cc) => (
                          cc && cc.id && cc.nome ? (
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
                          ) : null
                        ))
                      ) : (
                        <CommandItem disabled>
                          Nenhum centro de custo disponível
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ... other form fields ... */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Transação"}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;