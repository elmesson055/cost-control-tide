import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import TransactionForm from "@/components/transactions/TransactionForm";

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: string;
  category: string;
  categoryId: string;
  supplier: string;
  supplierId: string;
  costCenter: string;
  costCenterId: string;
  paymentMethod: string;
  paymentMethodId: string;
  dueDate: Date | null;
  recurring: boolean;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transacoes')
        .select('*, categorias(*), fornecedores(*), centros_custo(*), metodos_pagamento(*)');
      
      if (transactionsError) {
        toast({
          title: "Erro ao carregar transações",
          description: transactionsError.message,
          variant: "destructive",
        });
        return;
      }
      
      const mappedTransactions = transactionsData.map(transaction => {
        const categoria = transaction.categorias || {};
        const fornecedor = transaction.fornecedores || {};
        const centroCusto = transaction.centros_custo || {};
        const metodoPagamento = transaction.metodos_pagamento || {};
        
        return {
          id: transaction.id,
          date: new Date(transaction.criado_em || Date.now()),
          description: transaction.descricao || '',
          amount: Number(transaction.valor) || 0,
          type: transaction.tipo || '',
          category: categoria?.nome || 'Não categorizado',
          categoryId: categoria?.id || null,
          supplier: fornecedor?.nome || '',
          supplierId: fornecedor?.id || null,
          costCenter: centroCusto?.nome || '',
          costCenterId: centroCusto?.id || null,
          paymentMethod: metodoPagamento?.nome || '',
          paymentMethodId: metodoPagamento?.id || null,
          dueDate: transaction.data_vencimento ? new Date(transaction.data_vencimento) : null,
          recurring: transaction.recorrente || false
        };
      });
      
      setTransactions(mappedTransactions);
      setFilteredTransactions(mappedTransactions);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      toast.error("Não foi possível carregar as transações.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filterTransactions = () => {
    let filtered = transactions;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    filterTransactions();
  }, [typeFilter, transactions]);

  const handleSearch = () => {
    filterTransactions();
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleTransactionSuccess = () => {
    setDialogOpen(false);
    loadTransactions();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transações</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para registrar uma nova transação.
              </DialogDescription>
            </DialogHeader>
            
            <TransactionForm onSubmitSuccess={handleTransactionSuccess} />
            
            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex w-full md:w-1/2 items-center space-x-2">
              <Input
                placeholder="Pesquisar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">Carregando transações...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date.toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      {transaction.type === 'income' ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Receita
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                          Despesa
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!isLoading && filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
