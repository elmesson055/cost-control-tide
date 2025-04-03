
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Tag, CreditCard, Building } from "lucide-react";
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
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import { useTransactions } from "@/hooks/useTransactions";
import CategoryForm from "@/components/forms/CategoryForm";
import PaymentMethodForm from "@/components/forms/PaymentMethodForm";
import SupplierForm from "@/components/forms/SupplierForm";

const Transactions = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  
  const { 
    filteredTransactions,
    isLoading,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    handleSearch,
    loadTransactions,
    formatCurrency,
    categorias,
    fornecedores,
    centrosCusto,
    metodosPagamento,
  } = useTransactions();

  // Add effect to load transactions when component mounts
  useEffect(() => {
    console.log("Transactions component mounted, loading transactions...");
    loadTransactions();
  }, []);

  const handleTransactionSuccess = () => {
    setDialogOpen(false);
    loadTransactions();
  };

  const handleCategorySuccess = () => {
    setCategoryDialogOpen(false);
    loadTransactions();
  };

  const handlePaymentMethodSuccess = () => {
    setPaymentMethodDialogOpen(false);
    loadTransactions();
  };

  const handleSupplierSuccess = () => {
    setSupplierDialogOpen(false);
    loadTransactions();
  };

  // Log para debugging dos dados disponíveis
  console.log("Categorias disponíveis na página Transactions:", categorias);
  console.log("Fornecedores disponíveis na página Transactions:", fornecedores);
  console.log("Centros de Custo disponíveis na página Transactions:", centrosCusto);
  console.log("Métodos de Pagamento disponíveis na página Transactions:", metodosPagamento);

  // Verificar se os arrays estão realmente inicializados
  const categoriasArray = Array.isArray(categorias) ? categorias : [];
  const fornecedoresArray = Array.isArray(fornecedores) ? fornecedores : [];
  const centrosCustoArray = Array.isArray(centrosCusto) ? centrosCusto : [];
  const metodosPagamentoArray = Array.isArray(metodosPagamento) ? metodosPagamento : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transações</h1>
        
        <div className="flex gap-2">
          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
                <DialogDescription>
                  Adicione uma nova categoria para organizar suas transações.
                </DialogDescription>
              </DialogHeader>
              <CategoryForm onSuccess={handleCategorySuccess} />
            </DialogContent>
          </Dialog>

          <Dialog open={paymentMethodDialogOpen} onOpenChange={setPaymentMethodDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Novo Método
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Método de Pagamento</DialogTitle>
                <DialogDescription>
                  Adicione um novo método de pagamento para suas transações.
                </DialogDescription>
              </DialogHeader>
              <PaymentMethodForm onSuccess={handlePaymentMethodSuccess} />
            </DialogContent>
          </Dialog>

          <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Building className="mr-2 h-4 w-4" />
                Novo Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Fornecedor</DialogTitle>
                <DialogDescription>
                  Adicione um novo fornecedor para suas transações.
                </DialogDescription>
              </DialogHeader>
              <SupplierForm onSuccess={handleSupplierSuccess} />
            </DialogContent>
          </Dialog>
          
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
              
              <TransactionForm 
                onSubmitSuccess={handleTransactionSuccess} 
                categorias={categoriasArray}
                fornecedores={fornecedoresArray}
                centrosCusto={centrosCustoArray}
                metodosPagamento={metodosPagamentoArray}
              />
              
              <div className="mt-4 flex justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TransactionFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        handleSearch={handleSearch}
      />

      <TransactionsList 
        transactions={filteredTransactions}
        isLoading={isLoading}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default Transactions;
