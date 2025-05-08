import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileMenu from "@/components/layout/MobileMenu";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/Dashboard";
import Tickets from "@/pages/Tickets";
import Users from "@/pages/Users";
import Categories from "@/pages/Categories";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";

function Router() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock current user for demo
  const currentUser: User = {
    id: 1,
    username: "admin",
    name: "John Doe",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3"
  };

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    staleTime: 60000
  });

  const { data: notifications } = useQuery({ 
    queryKey: ['/api/notifications/unread'],
    staleTime: 30000
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header 
        user={currentUser} 
        notifications={notifications || []} 
        onToggleMobileMenu={toggleMobileMenu} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="container mx-auto">
            <Switch>
              <Route path="/" component={() => <Dashboard stats={stats} />} />
              <Route path="/tickets" component={Tickets} />
              <Route path="/users" component={Users} />
              <Route path="/categories" component={Categories} />
              <Route path="/reports" component={Reports} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
      
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
