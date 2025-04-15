import MainLayout from "@/components/layouts/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import { ArrowDownUp, DollarSign, Wallet } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect, useState } from "react";

const Index = () => {
  const { transactions, isLoading, formatCurrency } = useTransactions();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [operationalBalance, setOperationalBalance] = useState(0);
  const [currentCash, setCurrentCash] = useState(0);

  useEffect(() => {
    if (!isLoading && transactions) {
      calculateDashboardValues();
    }
  }, [isLoading, transactions]);

  const calculateDashboardValues = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalCash = 0;

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (
        transactionYear === currentYear &&
        transactionMonth === currentMonth &&
        transaction.type === "income"
      ) {
        totalIncome += transaction.amount;
      } else if (
        transactionYear === currentYear &&
        transactionMonth === currentMonth &&
        transaction.type === "expense"
      ) {
        totalExpenses += transaction.amount;
      }

      totalCash += transaction.type === "income" ? transaction.amount : -transaction.amount;
    });

    setMonthlyIncome(totalIncome);
    setMonthlyExpenses(totalExpenses);
    setOperationalBalance(totalIncome - totalExpenses);
    setCurrentCash(totalCash);
  };

  return (
    <div className="px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Entradas do Mês"
          value={formatCurrency(monthlyIncome)}
          icon={<ArrowDownUp className="h-5 w-5" />}
        />

        <StatCard
          title="Saídas do Mês"
          value={formatCurrency(monthlyExpenses)}
          icon={<ArrowDownUp className="h-5 w-5" />}
        />

        <StatCard
          title="Saldo Operacional"
          value={formatCurrency(operationalBalance)}
          icon={<Wallet className="h-5 w-5" />}
        />

        <StatCard
          title="Caixa Atual"
          value={formatCurrency(currentCash)}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default Index;
