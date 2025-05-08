import { Notification } from "@/lib/types";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: Notification[];
}

const NotificationDropdown = ({ isOpen, notifications }: NotificationDropdownProps) => {
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
  
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <span className="material-icons text-warning mr-2 mt-0.5">priority_high</span>;
      case "success":
        return <span className="material-icons text-success mr-2 mt-0.5">check_circle</span>;
      case "error":
        return <span className="material-icons text-error mr-2 mt-0.5">error</span>;
      default:
        return <span className="material-icons text-info mr-2 mt-0.5">info</span>;
    }
  };
  
  const handleMarkAllRead = async () => {
    try {
      await apiRequest("POST", "/api/notifications/mark-all-read", {});
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread'] });
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  return (
    <div 
      className={`absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-800">Notifications</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No new notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="p-3 border-b border-gray-200 hover:bg-gray-50">
              <div className="flex items-start">
                {getNotificationIcon(notification.type)}
                <div>
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="py-2 px-3 border-t border-gray-200 bg-gray-50">
        <button 
          className="text-xs text-primary hover:text-primary-dark font-medium"
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
