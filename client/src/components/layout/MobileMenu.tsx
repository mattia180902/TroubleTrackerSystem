import { Link, useLocation } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [location] = useLocation();

  const isActivePath = (path: string) => {
    return location === path;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30">
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl transition transform ease-in-out duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Menu</h2>
          <button 
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={onClose}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <nav className="py-4">
          <ul>
            <li>
              <Link href="/">
                <a 
                  className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}
                  onClick={onClose}
                >
                  <span className="material-icons mr-3">dashboard</span>
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/tickets">
                <a 
                  className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/tickets") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}
                  onClick={onClose}
                >
                  <span className="material-icons mr-3">confirmation_number</span>
                  Tickets
                </a>
              </Link>
            </li>
            <li>
              <Link href="/users">
                <a 
                  className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/users") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}
                  onClick={onClose}
                >
                  <span className="material-icons mr-3">people</span>
                  Users
                </a>
              </Link>
            </li>
            <li>
              <Link href="/categories">
                <a 
                  className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/categories") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}
                  onClick={onClose}
                >
                  <span className="material-icons mr-3">category</span>
                  Categories
                </a>
              </Link>
            </li>
            <li>
              <Link href="/reports">
                <a 
                  className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/reports") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}
                  onClick={onClose}
                >
                  <span className="material-icons mr-3">analytics</span>
                  Reports
                </a>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <a 
                  className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/settings") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}
                  onClick={onClose}
                >
                  <span className="material-icons mr-3">settings</span>
                  Settings
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
