import { Link, useLocation } from "wouter";

const Sidebar = () => {
  const [location] = useLocation();

  const isActivePath = (path: string) => {
    return location === path;
  };

  return (
    <aside className="bg-white w-64 shadow-md hidden md:block overflow-y-auto transition-all duration-300 z-20">
      <nav className="py-4">
        <div className="px-4 mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons text-gray-500">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
            />
          </div>
        </div>

        <ul>
          <li>
            <Link href="/">
              <a className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}>
                <span className="material-icons mr-3">dashboard</span>
                Dashboard
              </a>
            </Link>
          </li>
          <li>
            <Link href="/tickets">
              <a className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/tickets") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}>
                <span className="material-icons mr-3">confirmation_number</span>
                Tickets
              </a>
            </Link>
          </li>
          <li>
            <Link href="/users">
              <a className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/users") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}>
                <span className="material-icons mr-3">people</span>
                Users
              </a>
            </Link>
          </li>
          <li>
            <Link href="/categories">
              <a className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/categories") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}>
                <span className="material-icons mr-3">category</span>
                Categories
              </a>
            </Link>
          </li>
          <li>
            <Link href="/reports">
              <a className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/reports") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}>
                <span className="material-icons mr-3">analytics</span>
                Reports
              </a>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <a className={`flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 hover:text-gray-800 transition ${isActivePath("/settings") ? "bg-gray-100 border-l-4 border-primary" : "text-gray-600"}`}>
                <span className="material-icons mr-3">settings</span>
                Settings
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
