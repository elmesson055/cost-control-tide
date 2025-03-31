
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt, Wallet, DollarSign, Package, Users, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { name: 'Transações', path: '/transactions', icon: <Receipt className="mr-3 h-5 w-5" /> },
    { name: 'Controle de Caixa', path: '/cash-control', icon: <Wallet className="mr-3 h-5 w-5" /> },
    { name: 'Custos', path: '/costs', icon: <DollarSign className="mr-3 h-5 w-5" /> },
    { name: 'Estoque', path: '/inventory', icon: <Package className="mr-3 h-5 w-5" /> },
    { name: 'Fornecedores', path: '/suppliers', icon: <Users className="mr-3 h-5 w-5" /> },
    { name: 'Configurações', path: '/settings', icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Tide Control</h1>
      </div>
      <nav className="space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
