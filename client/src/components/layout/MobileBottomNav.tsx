import { Link, useLocation } from "wouter";
import { useState } from "react";
import TicketModal from "@/components/tickets/TicketModal";

const MobileBottomNav = () => {
  const [location] = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isActivePath = (path: string) => {
    return location === path;
  };

  return (
    <>
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex items-center justify-around">
          <Link href="/">
            <a className={`flex flex-col items-center py-2 px-3 ${isActivePath("/") ? "text-primary" : "text-gray-600"}`}>
              <span className="material-icons">dashboard</span>
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          <Link href="/tickets">
            <a className={`flex flex-col items-center py-2 px-3 ${isActivePath("/tickets") ? "text-primary" : "text-gray-600"}`}>
              <span className="material-icons">confirmation_number</span>
              <span className="text-xs mt-1">Tickets</span>
            </a>
          </Link>
          <button 
            className="flex flex-col items-center py-2 px-3 text-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="material-icons">add_circle</span>
            <span className="text-xs mt-1">Create</span>
          </button>
          <Link href="/users">
            <a className={`flex flex-col items-center py-2 px-3 ${isActivePath("/users") ? "text-primary" : "text-gray-600"}`}>
              <span className="material-icons">person</span>
              <span className="text-xs mt-1">Users</span>
            </a>
          </Link>
          <Link href="/settings">
            <a className={`flex flex-col items-center py-2 px-3 ${isActivePath("/settings") ? "text-primary" : "text-gray-600"}`}>
              <span className="material-icons">settings</span>
              <span className="text-xs mt-1">Settings</span>
            </a>
          </Link>
        </div>
      </nav>

      <TicketModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};

export default MobileBottomNav;
