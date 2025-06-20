import React, { useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const NotificationComponent = () => {
  const shownMessagesRef = useRef(new Set()); // ✅ Use Set for uniqueness

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          res.data.forEach((msg) => {
            if (!shownMessagesRef.current.has(msg)) {
              toast.info(msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
              shownMessagesRef.current.add(msg); // ✅ Add to shown list
            }
          });
        } else {
          console.error("Unexpected notification format:", res.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications(); // Fetch on mount
    const interval = setInterval(fetchNotifications, 30000); // Repeat every 30s

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // ✅ Empty dependency so it runs once and on interval

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      toastStyle={{
        borderRadius: "20px",
        borderLeft: "16px solid #007bff",
        background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
        color: "#222",
        boxShadow: "0 4px 24px rgba(0,123,255,0.08)",
        fontSize: "1.05rem",
        minWidth: "400px",
      }}

    />
  );
};

export default NotificationComponent;
