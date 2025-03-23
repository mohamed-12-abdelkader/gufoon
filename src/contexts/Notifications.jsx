import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@chakra-ui/react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (skip = 0, limit = 10) => {
    try {
      const response = await axios.get(`/notifications?skip=${skip}&limit=${limit}`);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const getUnreadCount = async () => {
    try {
      const response = await axios.get("/notifications/count");
      setUnreadCount(response.data.unread);
    } catch (error) {
      console.error("Error fetching unread count", error);
    }
  };

  const clearNotifications = async () => {
    try {
      await axios.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error deleting notifications", error);
    }
  };

  useEffect(() => {
    getUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        clearNotifications,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

const limit = 10;

export const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications, clearNotifications } =
    useNotifications();
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchNotifications(page * limit, limit);
  }, [page]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">الإشعارات</h2>
        <Button onClick={clearNotifications} variant="ghost">
          مسح الكل
        </Button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد إشعارات</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`border-b pb-2 ${notification.isRead ? "text-gray-500" : "text-black font-bold"
                }`}
            >
              <p>{notification.type === "NewOrder" ? "طلب جديد" : "طلب ملغي"}</p>
              <small className="text-gray-500">
                {new Date(notification.createdAt).toLocaleString("ar")}
              </small>
            </li>
          ))}
        </ul>
      )}

      {unreadCount > 0 && (
        <div className="mt-2 text-right text-sm font-bold text-red-600">
          لديك {unreadCount} إشعارات غير مقروءة
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 0} variant="outline">
          السابق
        </Button>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={notifications.length < limit}
          variant="outline"
        >
          التالي
        </Button>
      </div>
    </div>
  );
};
