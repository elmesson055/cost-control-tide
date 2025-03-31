
import MainLayout from "@/components/layouts/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import TransactionList from "@/components/dashboard/TransactionList";
import CashStatusCard from "@/components/dashboard/CashStatusCard";
import { DollarSign, TrendingUp, ShoppingBag, Wallet } from "lucide-react";
import { 
  generateCashFlowData, 
  generateExpenseBreakdownData, 
  generateTransactions 
} from "@/utils/mockData";

const Index = () => {
  // Mock data for dashboard
  const cashFlowData = generateCashFlowData();
  const expenseBreakdownData = generateExpenseBreakdownData();
  const recentTransactions = generateTransactions(5);

  // Calculate some metrics for the dashboard
  const totalIncome = cashFlowData.reduce((sum, day) => sum + day.income, 0);
  const totalExpenses = cashFlowData.reduce((sum, day) => sum + day.expense, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = (netProfit / totalIncome) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Receitas (30d)" 
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={12.5}
          trendLabel="vs mês anterior"
        />
        <StatCard 
          title="Despesas (30d)" 
          value={formatCurrency(totalExpenses)}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={-2.4}
          trendLabel="vs mês anterior"
        />
        <StatCard 
          title="Lucro Líquido" 
          value={formatCurrency(netProfit)}
          icon={<DollarSign className="h-5 w-5" />}
          trend={8.2}
          trendLabel="vs mês anterior"
        />
        <CashStatusCard 
          status="open"
          balance={1250.75}
          lastOpened="12/06/2024 08:15:22"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <CashFlowChart data={cashFlowData} />
        </div>
        <div>
          <ExpenseBreakdown data={expenseBreakdownData} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <TransactionList transactions={recentTransactions} />
      </div>
    </MainLayout>
  );
};

export default Index;
