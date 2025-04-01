
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

const Transactions = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
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
  } = useTransactions();

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
