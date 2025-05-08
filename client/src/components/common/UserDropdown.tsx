import { User } from "@/lib/types";
import { useState, useEffect } from "react";
import { Link } from "wouter";

interface UserDropdownProps {
  isOpen: boolean;
  user: User;
}

const UserDropdown = ({ isOpen, user }: UserDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match the fade-out duration
    }
    
    return () => clearTimeout(timeout);
  }, [isOpen]);
  
  if (!isVisible && !isOpen) return null;

  const handleLogout = () => {
    // In a real app, this would call an API to logout
    console.log("Logging out...");
  };

  return (
    <div 
      className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-800">{user.name}</p>
        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
      </div>
      <div className="py-1">
        <Link href="/profile">
          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <span className="material-icons text-sm mr-2 align-text-bottom">person</span>
            Profile
          </a>
        </Link>
        <Link href="/settings">
          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <span className="material-icons text-sm mr-2 align-text-bottom">settings</span>
            Settings
          </a>
        </Link>
        <div className="border-t border-gray-200"></div>
        <button 
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <span className="material-icons text-sm mr-2 align-text-bottom">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
