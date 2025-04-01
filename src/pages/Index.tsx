
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashStatusCard from "@/components/dashboard/CashStatusCard";
import TransactionList from "@/components/dashboard/TransactionList";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import StatCard from "@/components/dashboard/StatCard";
import { ArrowUpIcon, ArrowDownIcon, BanknoteIcon, PercentIcon } from "lucide-react";

const mockTransactions = [
  {
    id: "1",
    date: "05/04/2025",
    description: "Pagamento de Fornecedor",
    amount: 1250.75,
    type: "expense" as const,
    category: "Fornecedores"
  },
  {
    id: "2",
    date: "03/04/2025",
    description: "Venda de Produtos",
    amount: 2830.50,
    type: "income" as const,
    category: "Vendas"
  },
  {
    id: "3",
    date: "01/04/2025",
    description: "Pagamento de Aluguel",
    amount: 1800,
    type: "expense" as const,
    category: "Aluguel"
  }
];

// Properly formatted data for CashFlowChart
const mockCashFlowData = [
  { date: "Jan", income: 12500, expense: 8500 },
  { date: "Fev", income: 14800, expense: 9200 },
  { date: "Mar", income: 13200, expense: 8800 },
  { date: "Abr", income: 15500, expense: 9800 },
  { date: "Mai", income: 14200, expense: 9100 },
  { date: "Jun", income: 16800, expense: 10200 }
];

// Properly formatted data for ExpenseBreakdown with color property
const mockExpenseData = [
  { name: "Fornecedores", value: 38, color: "#FF6B6B" },
  { name: "Aluguel", value: 25, color: "#4ECDC4" },
  { name: "Funcionários", value: 20, color: "#FFD166" },
  { name: "Marketing", value: 10, color: "#6A0572" },
  { name: "Outros", value: 7, color: "#1A535C" }
];

const Index = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Receitas do Mês"
          value={12450}
          change={12}
          trend="up"
          icon={<ArrowUpIcon className="h-5 w-5 text-green-600" />}
        />
        <StatCard 
          title="Despesas do Mês"
          value={8230}
          change={5}
          trend="down"
          icon={<ArrowDownIcon className="h-5 w-5 text-red-600" />}
        />
        <StatCard 
          title="Lucro Líquido"
          value={4220}
          change={18}
          trend="up"
          icon={<BanknoteIcon className="h-5 w-5 text-blue-600" />}
        />
        <StatCard 
          title="Margem de Lucro"
          value={33.9}
          change={2.4}
          trend="up"
          icon={<PercentIcon className="h-5 w-5 text-purple-600" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart data={mockCashFlowData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Situação do Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <CashStatusCard status="open" balance={4220} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={mockTransactions} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ExpenseBreakdown data={mockExpenseData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
