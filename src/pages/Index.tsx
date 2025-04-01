import MainLayout from "@/components/layouts/MainLayout";
import StatCard from "@/components/ui/StatCard";
import { ArrowDownUp, DollarSign, Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Entradas do Mês"
          value={10000}
          trend={8}
          trendText="em relação ao mês passado"
          icon={<ArrowDownUp className="h-5 w-5" />}
        />
        
        <StatCard
          title="Saídas do Mês"
          value={7500}
          trend={-3}
          trendText="em relação ao mês passado"
          icon={<ArrowDownUp className="h-5 w-5" />}
        />
        
        <StatCard
          title="Saldo Operacional"
          value={2500}
          trend={15}
          trendText="em relação ao mês passado"
          icon={<Wallet className="h-5 w-5" />}
        />
        
        <StatCard
          title="Caixa Atual"
          value={8200}
          trend={5}
          trendText="em relação ao dia anterior"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default Index;
