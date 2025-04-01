
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashStatusCard from "@/components/dashboard/CashStatusCard";
import TransactionList from "@/components/dashboard/TransactionList";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";
import StatCard from "@/components/dashboard/StatCard";
import { ArrowUpIcon, ArrowDownIcon, BanknoteIcon, PercentIcon } from "lucide-react";

const Index = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Receitas do Mês"
          value="R$ 12.450,00"
          change="+12%"
          trend="up"
          icon={<ArrowUpIcon className="h-5 w-5 text-green-600" />}
        />
        <StatCard 
          title="Despesas do Mês"
          value="R$ 8.230,00"
          change="+5%"
          trend="down"
          icon={<ArrowDownIcon className="h-5 w-5 text-red-600" />}
        />
        <StatCard 
          title="Lucro Líquido"
          value="R$ 4.220,00"
          change="+18%"
          trend="up"
          icon={<BanknoteIcon className="h-5 w-5 text-blue-600" />}
        />
        <StatCard 
          title="Margem de Lucro"
          value="33,9%"
          change="+2.4%"
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
            <CashFlowChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Situação do Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <CashStatusCard />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ExpenseBreakdown />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
