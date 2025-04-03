
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
  metodosPagamento: propMetodosPagamento = []
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("expense");
  const [openCategory, setOpenCategory] = useState(false);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openCostCenter, setOpenCostCenter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      descricao: "",
      valor: "",
      tipo: "expense",
      recorrente: false,
    },
  });

  // Atualizar estado quando as props mudarem
  useEffect(() => {
    console.log("Propriedades recebidas no TransactionForm:", {
      categorias: propCategorias,
      fornecedores: propFornecedores,
      centrosCusto: propCentrosCusto,
      metodosPagamento: propMetodosPagamento
    });
    
    if (propCategorias && propCategorias.length > 0) setCategories(propCategorias);
    if (propFornecedores && propFornecedores.length > 0) setSuppliers(propFornecedores);
    if (propCentrosCusto && propCentrosCusto.length > 0) setCostCenters(propCentrosCusto);
    if (propMetodosPagamento && propMetodosPagamento.length > 0) setPaymentMethods(propMetodosPagamento);
  }, [propCategorias, propFornecedores, propCentrosCusto, propMetodosPagamento]);

  // Buscar dados se as props estiverem vazias
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Log do estado atual dos dados
        console.log("Estado atual antes de buscar dados:", {
          categories: categories.length,
          suppliers: suppliers.length,
          costCenters: costCenters.length,
          paymentMethods: paymentMethods.length
        });
        
        if (categories.length === 0) {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from("categorias")
            .select("id, nome, tipo");
            
          if (categoriesError) throw categoriesError;
          console.log("Categorias carregadas do Supabase:", categoriesData);
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData);
          } else {
            console.log("Nenhuma categoria carregada do Supabase");
            setCategories([]);
          }
        }

        if (paymentMethods.length === 0) {
          const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
            .from("metodos_pagamento")
            .select("id, nome");
            
          if (paymentMethodsError) throw paymentMethodsError;
          console.log("Métodos de pagamento carregados do Supabase:", paymentMethodsData);
          if (paymentMethodsData && paymentMethodsData.length > 0) {
            setPaymentMethods(paymentMethodsData);
          } else {
            console.log("Nenhum método de pagamento carregado do Supabase");
            setPaymentMethods([]);
          }
        }

        if (suppliers.length === 0) {
          const { data: suppliersData, error: suppliersError } = await supabase
            .from("fornecedores")
            .select("id, nome");
            
          if (suppliersError) throw suppliersError;
          console.log("Fornecedores carregados do Supabase:", suppliersData);
          if (suppliersData && suppliersData.length > 0) {
            setSuppliers(suppliersData);
          } else {
            console.log("Nenhum fornecedor carregado do Supabase");
            setSuppliers([]);
          }
        }

        if (costCenters.length === 0) {
          const { data: costCentersData, error: costCentersError } = await supabase
            .from("centros_custo")
            .select("id, nome");
            
          if (costCentersError) throw costCentersError;
          console.log("Centros de custo carregados do Supabase:", costCentersData);
          if (costCentersData && costCentersData.length > 0) {
            setCostCenters(costCentersData);
          } else {
            console.log("Nenhum centro de custo carregado do Supabase");
            setCostCenters([]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar categorias com base no tipo selecionado
  const filteredCategories = categories.filter(
    (cat) => !cat?.tipo || cat?.tipo === typeFilter
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

  // Debug das informações disponíveis no componente
  console.log("Categorias disponíveis no form:", categories);
  console.log("Fornecedores disponíveis no form:", suppliers);
  console.log("Centros de Custo disponíveis no form:", costCenters);
  console.log("Métodos de Pagamento disponíveis no form:", paymentMethods);
  console.log("Categorias filtradas por tipo:", filteredCategories);

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
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Carregando métodos...</SelectItem>
                  ) : paymentMethods && paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
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
                      {field.value && suppliers.length > 0
                        ? suppliers.find((sup) => sup?.id === field.value)?.nome || "Selecione um fornecedor"
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
                      {isLoading ? (
                        <CommandItem disabled>
                          Carregando fornecedores...
                        </CommandItem>
                      ) : suppliers && suppliers.length > 0 ? (
                        suppliers.map((sup) => (
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
                      {field.value && costCenters.length > 0
                        ? costCenters.find((cc) => cc?.id === field.value)?.nome || "Selecione um centro de custo"
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
                      {isLoading ? (
                        <CommandItem disabled>
                          Carregando centros de custo...
                        </CommandItem>
                      ) : costCenters && costCenters.length > 0 ? (
                        costCenters.map((cc) => (
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
