
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
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

// Tipo para transação
interface Transaction {
  id: string;
  data: string; // Data de criação ou vencimento formatada para exibição
  descricao: string;
  categoria: string;
  categoria_id: string;
  tipo: 'income' | 'expense';
  valor: number;
  criado_em?: string;
  data_vencimento?: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Função para carregar transações do Supabase
  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select(`
          id, 
          descricao, 
          valor, 
          tipo, 
          criado_em, 
          data_vencimento,
          categorias(id, nome)
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      // Processar e formatar os dados
      const formattedData: Transaction[] = data.map(item => {
        // Determinar qual data usar (vencimento ou criação)
        const displayDate = item.data_vencimento || item.criado_em;
        const formattedDate = new Date(displayDate).toLocaleDateString('pt-BR');
        
        return {
          id: item.id,
          data: formattedDate,
          descricao: item.descricao || 'Sem descrição',
          categoria: item.categorias?.nome || 'Sem categoria',
          categoria_id: item.categorias?.id || '',
          tipo: item.tipo as 'income' | 'expense',
          valor: item.valor,
          criado_em: item.criado_em,
          data_vencimento: item.data_vencimento,
        };
      });

      setTransactions(formattedData);
      setFilteredTransactions(formattedData);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      toast.error("Não foi possível carregar as transações.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar transações na inicialização do componente
  useEffect(() => {
    loadTransactions();
  }, []);

  const filterTransactions = () => {
    let filtered = transactions;
    
    // Filtrar por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.tipo === typeFilter);
    }
    
    // Filtrar por termo de pesquisa
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.descricao.toLowerCase().includes(term) || 
        t.categoria.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(filtered);
  };

  // Aplicar filtros quando typeFilter ou searchTerm mudam
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
    <MainLayout>
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
                    <TableCell>{transaction.data}</TableCell>
                    <TableCell>{transaction.descricao}</TableCell>
                    <TableCell>{transaction.categoria}</TableCell>
                    <TableCell>
                      {transaction.tipo === 'income' ? (
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
                      transaction.tipo === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.tipo === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.valor))}
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
    </MainLayout>
  );
};

export default Transactions;
