
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { LayoutDashboard, Receipt, Wallet, DollarSign, Package, Users, Settings } from 'lucide-react';

const AppSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Transações', path: '/transactions', icon: <Receipt className="h-5 w-5" /> },
    { name: 'Controle de Caixa', path: '/cash-control', icon: <Wallet className="h-5 w-5" /> },
    { name: 'Custos', path: '/costs', icon: <DollarSign className="h-5 w-5" /> },
    { name: 'Estoque', path: '/inventory', icon: <Package className="h-5 w-5" /> },
    { name: 'Fornecedores', path: '/suppliers', icon: <Users className="h-5 w-5" /> },
    { name: 'Configurações', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-primary">Tide Control</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.path}
                tooltip={item.name}
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
