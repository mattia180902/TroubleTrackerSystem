import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "@/components/common/NotificationDropdown";
import UserDropdown from "@/components/common/UserDropdown";
import { User, Notification } from "@/lib/types";

interface HeaderProps {
  user: User;
  notifications: Notification[];
  onToggleMobileMenu: () => void;
}

const Header = ({ user, notifications, onToggleMobileMenu }: HeaderProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target as Node) &&
        isNotificationOpen
      ) {
        setIsNotificationOpen(false);
      }
      
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen, isUserMenuOpen]);

  return (
    <header className="bg-primary text-white shadow-md z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className="md:hidden p-2 rounded hover:bg-primary-dark transition"
            onClick={onToggleMobileMenu}
          >
            <span className="material-icons">menu</span>
          </button>
          <h1 className="text-xl font-medium flex items-center">
            <span className="material-icons mr-2">support</span>
            Support Desk
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              className="p-2 rounded hover:bg-primary-dark transition"
              onClick={toggleNotification}
            >
              <span className="material-icons">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            <NotificationDropdown 
              isOpen={isNotificationOpen} 
              notifications={notifications} 
            />
          </div>
          
          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center space-x-1 p-2 rounded hover:bg-primary-dark transition"
              onClick={toggleUserMenu}
            >
              <img 
                className="h-8 w-8 rounded-full object-cover border-2 border-white" 
                src={user.avatar || "https://via.placeholder.com/40"} 
                alt={`${user.name}'s avatar`} 
              />
              <span className="hidden md:block">{user.name}</span>
              <span className="material-icons text-sm">arrow_drop_down</span>
            </button>
            
            <UserDropdown 
              isOpen={isUserMenuOpen} 
              user={user}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
