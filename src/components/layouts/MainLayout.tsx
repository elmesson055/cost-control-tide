
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from './AppSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center mb-4">
              <SidebarTrigger className="mr-2" />
              <h1 className="text-lg font-semibold">Tide Control</h1>
            </div>
            <main>{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default MainLayout;
