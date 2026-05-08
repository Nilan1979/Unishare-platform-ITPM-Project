import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, MessageCircle, ChevronDown, LogOut, User, Settings, Shield } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

/* ─── Role badge colours ─────────────────────────────────────── */
const ROLE_META = {
  student: { label: "Student",  color: "#1565C0", bg: "#e8f0fe" },
  tutor:   { label: "Tutor",    color: "#2e7d32", bg: "#e8f5e9" },
  admin:   { label: "Admin",    color: "#b71c1c", bg: "#fce8ef" },
};

/* ─── Nav links (only visible when logged in) ────────────────── */
const NAV_LINKS = [
  { label: "Home",     path: "/" },
  { label: "Library",  path: "/library" },
  { label: "Kuppi",    path: "/Kuppi" },
  { label: "Quiz",     path: "/quizzes" },
  { label: "Forum",    path: "/forum" },
  { label: "About",    path: "/about" },
];

const canShowNotificationInNavbar = (notification, currentUserId, currentUserRole) => {
  if (notification?.type !== "report") return true;

  const reporterId = notification?.data?.reportedByUserId || notification?.data?.reporterId;
  const message = (notification?.message || "").toLowerCase();

  if (
    currentUserRole === "admin" &&
    currentUserId &&
    reporterId &&
    String(reporterId) === String(currentUserId) &&
    message.includes("a new report was submitted")
  ) {
    return false;
  }

  return true;
};

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function Navbar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const dropRef    = useRef(null);
  const notifRef   = useRef(null);

  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ── Read user from localStorage ── */
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const isLoggedIn = !!user;
  const userId = user?._id || user?.id;
  const role       = user?.role ?? "student";
  const roleMeta   = ROLE_META[role] ?? ROLE_META.student;
  const displayName = user?.fullName ?? user?.name ?? "User";
  const initials   = getInitials(displayName);
  const profilePicture = user?.profilePicture || "";

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropOpen(false);
    navigate("/login");
  };

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userId) return;
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const rawNotifications = data.notifications || [];
        const visibleNotifications = rawNotifications.filter((notification) =>
          canShowNotificationInNavbar(notification, userId, role)
        );
        const sortedNotifications = [...visibleNotifications].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(sortedNotifications);
        setUnreadCount(sortedNotifications.filter((notification) => !notification.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [userId, role]);

  /* ── Fetch notifications on component mount ── */
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userId, fetchNotifications]);

  const handleNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .us-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 60px;
          height: 70px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          position: sticky;
          top: 0;
          z-index: 200;
          box-shadow: 
            0 0 1px rgba(21, 101, 192, 0.08),
            0 2px 8px rgba(21, 101, 192, 0.08),
            0 8px 24px rgba(21, 101, 192, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          font-family: 'Poppins', sans-serif;
          border-bottom: 1px solid rgba(21, 101, 192, 0.06);
        }

        /* ── Logo ── */
        .us-nav__logo {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          letter-spacing: -0.8px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        .us-nav__logo:hover {
          transform: scale(1.02);
        }
        .us-nav__logo-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(13, 34, 87, 0.1), rgba(21, 101, 192, 0.1));
          backdrop-filter: blur(8px);
          border: 1px solid rgba(21, 101, 192, 0.15);
          box-shadow: 0 4px 12px rgba(21, 101, 192, 0.1);
        }
        .us-nav__logo-icon img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        /* ── Nav links (authenticated) ── */
        .us-nav__links {
          display: flex;
          list-style: none;
          gap: 8px;
          margin: 0; padding: 0;
        }
        .us-nav__links a {
          display: block;
          padding: 8px 16px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #5a6a8a;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .us-nav__links a::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(21, 101, 192, 0.1), rgba(21, 101, 192, 0.05));
          transition: left 0.3s ease;
          z-index: -1;
        }
        .us-nav__links a:hover {
          color: #1565C0;
          left: 0;
          box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);
        }
        .us-nav__links a:hover::before {
          left: 0;
        }
        .us-nav__links a.active {
          color: #1565C0;
          background: rgba(21, 101, 192, 0.1);
          box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);
        }

        /* ── Guest: empty middle ── */
        .us-nav__guest-center {
          font-size: 0.83rem;
          color: #6b7280;
          font-weight: 500;
          font-style: italic;
          letter-spacing: 0.3px;
        }

        /* ── Right section ── */
        .us-nav__right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* ── Icon button ── */
        .us-nav__icon-btn {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(21, 101, 192, 0.08);
          border: 1px solid rgba(21, 101, 192, 0.12);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #1565C0;
          transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
          position: relative;
        }
        .us-nav__icon-btn:hover {
          background: rgba(21, 101, 192, 0.15);
          border-color: rgba(21, 101, 192, 0.25);
          box-shadow: 0 6px 16px rgba(21, 101, 192, 0.18);
          transform: translateY(-2px);
        }
        .us-nav__icon-btn:active {
          transform: translateY(0);
        }

        /* ── Login button ── */
        .us-nav__login-btn {
          padding: 10px 26px;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 
            0 4px 12px rgba(21, 101, 192, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .us-nav__login-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        .us-nav__login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 20px rgba(21, 101, 192, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .us-nav__login-btn:active {
          transform: translateY(0);
        }

        /* ── User dropdown ── */
        .us-nav__user-wrap { position: relative; }
        .us-nav__user-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px 6px 6px;
          background: rgba(21, 101, 192, 0.08);
          border: 1.5px solid rgba(21, 101, 192, 0.12);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
          font-family: 'Poppins', sans-serif;
        }
        .us-nav__user-btn:hover {
          background: rgba(21, 101, 192, 0.12);
          border-color: rgba(21, 101, 192, 0.25);
          box-shadow: 0 6px 16px rgba(21, 101, 192, 0.12);
        }
        .us-nav__user-btn.open {
          background: rgba(21, 101, 192, 0.15);
          border-color: rgba(21, 101, 192, 0.3);
          box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
        }

        /* Avatar circle */
        .us-nav__avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.5px;
          flex-shrink: 0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(21, 101, 192, 0.2);
        }
        .us-nav__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .us-nav__user-info { display: flex; flex-direction: column; align-items: flex-start; }
        .us-nav__user-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0d2257;
          line-height: 1;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .us-nav__user-role {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 8px;
          margin-top: 3px;
          line-height: 1.2;
        }
        .us-nav__chevron {
          color: #9eadc8;
          transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
          flex-shrink: 0;
        }
        .us-nav__chevron.open { transform: rotate(180deg); color: #1565C0; }

        /* Dropdown panel */
        .us-nav__dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(21, 101, 192, 0.12);
          border-radius: 18px;
          box-shadow: 
            0 10px 40px rgba(21, 101, 192, 0.15),
            0 0 1px rgba(21, 101, 192, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          min-width: 240px;
          overflow: hidden;
          animation: navDropIn 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
          z-index: 300;
        }
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }

        /* Dropdown header */
        .us-nav__drop-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid rgba(21, 101, 192, 0.08);
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(21, 101, 192, 0.02);
        }
        .us-nav__drop-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          font-size: 1rem;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(21, 101, 192, 0.2);
        }
        .us-nav__drop-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .us-nav__drop-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0d2257;
          margin-bottom: 4px;
        }
        .us-nav__drop-email {
          font-size: 0.74rem;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }

        /* Dropdown items */
        .us-nav__drop-items { padding: 8px 0; }
        .us-nav__drop-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: 'Poppins', sans-serif;
          text-decoration: none;
          transition: all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
          position: relative;
        }
        .us-nav__drop-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #1565C0, #0d2257);
          transform: scaleY(0);
          transition: transform 0.28s ease;
        }
        .us-nav__drop-item:hover {
          background: rgba(21, 101, 192, 0.08);
          color: #1565C0;
          padding-left: 20px;
        }
        .us-nav__drop-item:hover::before {
          transform: scaleY(1);
        }
        .us-nav__drop-item svg  { flex-shrink: 0; }
        .us-nav__drop-divider { height: 1px; background: rgba(21, 101, 192, 0.08); margin: 6px 0; }
        .us-nav__drop-item--danger { color: #b91c1c; }
        .us-nav__drop-item--danger:hover { 
          background: rgba(185, 28, 28, 0.1); 
          color: #b91c1c; 
          padding-left: 20px;
        }
        .us-nav__drop-item--danger:hover::before {
          background: linear-gradient(180deg, #b91c1c, #7f1d1d);
          transform: scaleY(1);
        }

        /* Admin badge in dropdown */
        .us-nav__drop-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.66rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 8px;
          margin-top: 5px;
          letter-spacing: 0.3px;
        }

        /* ── Guest info banner ── */
        .us-nav__guest-banner {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .us-nav__guest-text {
          font-size: 0.8rem;
          color: #9eadc8;
          font-weight: 500;
        }

        /* Notification dot */
        .us-nav__notif-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 10px; height: 10px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* ── Notification Wrapper ── */
        .us-nav__notif-wrap {
          position: relative;
        }

        /* ── Notification Dropdown ── */
        .us-nav__notif-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(21, 101, 192, 0.12);
          border-radius: 18px;
          box-shadow: 
            0 10px 40px rgba(21, 101, 192, 0.15),
            0 0 1px rgba(21, 101, 192, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          width: 400px;
          max-height: 520px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: navDropIn 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
          z-index: 300;
        }

        .us-nav__notif-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(21, 101, 192, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          background: rgba(21, 101, 192, 0.02);
        }
        .us-nav__notif-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0d2257;
        }
        .us-nav__notif-mark-all {
          font-size: 0.73rem;
          color: #1565C0;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.28s ease;
        }
        .us-nav__notif-mark-all:hover {
          color: #0d2257;
          text-decoration: underline;
        }

        .us-nav__notif-list {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }
        .us-nav__notif-list::-webkit-scrollbar {
          width: 6px;
        }
        .us-nav__notif-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .us-nav__notif-list::-webkit-scrollbar-thumb {
          background: rgba(21, 101, 192, 0.2);
          border-radius: 3px;
        }
        .us-nav__notif-list::-webkit-scrollbar-thumb:hover {
          background: rgba(21, 101, 192, 0.3);
        }

        .us-nav__notif-item {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(21, 101, 192, 0.06);
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
          background: transparent;
          position: relative;
        }
        .us-nav__notif-item.unread {
          background: rgba(21, 101, 192, 0.05);
        }
        .us-nav__notif-item:hover {
          background: rgba(21, 101, 192, 0.08);
        }

        .us-nav__notif-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          width: 32px;
          text-align: center;
        }

        .us-nav__notif-content {
          flex: 1;
          min-width: 0;
        }
        .us-nav__notif-msg {
          font-size: 0.76rem;
          font-weight: 600;
          color: #0d2257;
          line-height: 1.4;
          margin-bottom: 4px;
          word-break: break-word;
        }
        .us-nav__notif-meta {
          font-size: 0.68rem;
          color: #6b7280;
          margin-bottom: 2px;
        }
        .us-nav__notif-time {
          font-size: 0.66rem;
          color: #9eadc8;
        }

        .us-nav__notif-unread-dot {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 7px;
          height: 7px;
          background: linear-gradient(135deg, #1565C0, #0d2257);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(21, 101, 192, 0.4);
        }

        .us-nav__notif-empty {
          padding: 48px 24px;
          text-align: center;
          color: #9eadc8;
          font-size: 0.76rem;
        }

        /* ─── MOBILE MENU BUTTON ─────────────────────────────────────── */
        .us-nav__menu-btn {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(21, 101, 192, 0.08);
          border: 1px solid rgba(21, 101, 192, 0.12);
          cursor: pointer;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          color: #1565C0;
          transition: all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        .us-nav__menu-btn:hover {
          background: rgba(21, 101, 192, 0.15);
          border-color: rgba(21, 101, 192, 0.25);
          box-shadow: 0 6px 16px rgba(21, 101, 192, 0.18);
        }
        .us-nav__menu-line {
          width: 20px;
          height: 2px;
          background: currentColor;
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        /* ─── MOBILE NAV DRAWER ─────────────────────────────────────── */
        .us-nav__mobile-menu {
          display: none;
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 200;
          flex-direction: column;
          animation: mobileMenuSlideDown 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        @keyframes mobileMenuSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .us-nav__mobile-menu.open {
          display: flex;
        }
        .us-nav__mobile-links {
          list-style: none;
          padding: 16px 0;
          margin: 0;
          border-bottom: 1px solid rgba(21, 101, 192, 0.08);
        }
        .us-nav__mobile-links a {
          display: block;
          padding: 14px 20px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          color: #5a6a8a;
          border-left: 3px solid transparent;
          transition: all 0.28s ease;
        }
        .us-nav__mobile-links a:hover,
        .us-nav__mobile-links a.active {
          color: #1565C0;
          background: rgba(21, 101, 192, 0.08);
          border-left-color: #1565C0;
        }

        /* ─── RESPONSIVE NOTIFICATION DROPDOWN ───────────────────────── */
        @media (max-width: 900px) {
          .us-nav__notif-dropdown {
            width: 90vw;
            max-width: 320px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        /* ─── TABLET & SMALL SCREENS (900px - 600px) ────────────────── */
        @media (max-width: 900px) {
          .us-nav {
            padding: 0 16px;
            height: 64px;
          }
          .us-nav__logo {
            font-size: 1.2rem;
            gap: 8px;
          }
          .us-nav__logo-icon {
            width: 40px;
            height: 40px;
          }
          .us-nav__links {
            display: none;
          }
          .us-nav__guest-center {
            display: none;
          }
          .us-nav__menu-btn {
            display: flex;
          }
          .us-nav__right {
            gap: 8px;
          }
          .us-nav__icon-btn {
            width: 36px;
            height: 36px;
          }
          .us-nav__user-btn {
            padding: 4px 6px;
          }
          .us-nav__avatar {
            width: 30px;
            height: 30px;
            font-size: 0.65rem;
          }
          .us-nav__user-info {
            display: none;
          }
          .us-nav__dropdown {
            width: 280px;
          }
          .us-nav__notif-dropdown {
            max-height: 60vh;
          }
          .us-nav__login-btn {
            padding: 8px 18px;
            font-size: 0.8rem;
          }
        }

        /* ─── MOBILE (max-width: 600px) ──────────────────────────────── */
        @media (max-width: 600px) {
          .us-nav {
            padding: 0 12px;
            height: 60px;
            justify-content: space-between;
          }
          .us-nav__logo {
            font-size: 1rem;
            gap: 6px;
          }
          .us-nav__logo-icon {
            width: 36px;
            height: 36px;
          }
          .us-nav__right {
            gap: 4px;
          }
          .us-nav__icon-btn {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }
          .us-nav__user-btn {
            padding: 2px 4px;
          }
          .us-nav__avatar {
            width: 28px;
            height: 28px;
            font-size: 0.6rem;
          }
          .us-nav__dropdown {
            width: 240px;
            max-height: 70vh;
            overflow-y: auto;
          }
          .us-nav__drop-header {
            padding: 14px 16px 10px;
          }
          .us-nav__drop-avatar {
            width: 40px;
            height: 40px;
            font-size: 0.9rem;
          }
          .us-nav__drop-name {
            font-size: 0.85rem;
          }
          .us-nav__drop-email {
            font-size: 0.7rem;
            max-width: 140px;
          }
          .us-nav__drop-item {
            padding: 10px 14px;
            font-size: 0.78rem;
          }
          .us-nav__notif-dropdown {
            width: calc(100vw - 24px);
            max-width: 300px;
            max-height: 70vh;
            right: 12px;
          }
          .us-nav__notif-header {
            padding: 12px 16px;
          }
          .us-nav__notif-title {
            font-size: 0.8rem;
          }
          .us-nav__notif-item {
            padding: 10px 12px;
            gap: 8px;
          }
          .us-nav__notif-icon {
            font-size: 1.1rem;
            width: 28px;
          }
          .us-nav__notif-msg {
            font-size: 0.72rem;
          }
          .us-nav__notif-meta {
            font-size: 0.65rem;
          }
          .us-nav__notif-time {
            font-size: 0.64rem;
          }
          .us-nav__login-btn {
            padding: 8px 14px;
            font-size: 0.75rem;
          }
        }

        /* ─── SMALL MOBILE (max-width: 480px) ────────────────────────── */
        @media (max-width: 480px) {
          .us-nav {
            padding: 0 8px;
            height: 56px;
          }
          .us-nav__logo {
            font-size: 0.9rem;
          }
          .us-nav__logo-icon {
            width: 32px;
            height: 32px;
          }
          .us-nav__icon-btn,
          .us-nav__user-btn {
            width: 28px;
            height: 28px;
          }
          .us-nav__avatar {
            width: 24px;
            height: 24px;
            font-size: 0.55rem;
          }
          .us-nav__dropdown {
            width: 220px;
            min-width: calc(100vw - 40px);
            right: auto;
            left: 50%;
            transform: translateX(-50%);
          }
          .us-nav__drop-items {
            padding: 6px 0;
          }
          .us-nav__drop-item {
            padding: 8px 12px;
            font-size: 0.75rem;
            gap: 8px;
          }
          .us-nav__drop-item svg {
            width: 14px;
            height: 14px;
          }
          .us-nav__notif-dropdown {
            width: calc(100vw - 16px);
            max-width: 280px;
            right: 8px;
            left: auto;
          }
          .us-nav__login-btn {
            padding: 6px 12px;
            font-size: 0.7rem;
            white-space: nowrap;
          }
        }
      `}</style>

      <nav className="us-nav">
        {/* ── Logo ── */}
        <Link to={isLoggedIn ? "/" : "/login"} className="us-nav__logo">
          <div className="us-nav__logo-icon">
            <img src="./images/Logo.png" alt="" />
          </div>
          UniShare
        </Link>

        {/* ── Middle: Nav links (logged in) OR guest message (guest) ── */}
        {isLoggedIn ? (
          <ul className="us-nav__links">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={location.pathname === path ? "active" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span className="us-nav__guest-center">
            Sign in to access all features
          </span>
        )}

        {/* ── Mobile Menu Button ── */}
        {isLoggedIn && (
          <button
            className="us-nav__menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="us-nav__menu-line"></div>
            <div className="us-nav__menu-line"></div>
            <div className="us-nav__menu-line"></div>
          </button>
        )}

        {/* ── Right ── */}
        <div className="us-nav__right">
          {isLoggedIn ? (
            <>
              {/* Notification bell */}
              <div className="us-nav__notif-wrap" ref={notifRef}>
                <button 
                  className="us-nav__icon-btn" 
                  aria-label="Notifications"
                  onClick={() => setNotifOpen(p => !p)}
                >
                  {unreadCount > 0 && <div className="us-nav__notif-dot" />}
                  <Bell size={17} strokeWidth={2} />
                </button>

                {notifOpen && (
                  <div className="us-nav__notif-dropdown">
                    <div className="us-nav__notif-header">
                      <div className="us-nav__notif-title">Notifications {unreadCount > 0 && `(${unreadCount})`}</div>
                      {unreadCount > 0 && (
                        <button 
                          className="us-nav__notif-mark-all"
                          onClick={handleMarkAllRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="us-nav__notif-list">
                      {notifications.length === 0 ? (
                        <div className="us-nav__notif-empty">No notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id}
                            className={`us-nav__notif-item${notif.isRead ? ' read' : ' unread'}`}
                            onClick={async () => {
                              if (!notif.isRead) {
                                await handleNotificationRead(notif._id);
                              }
                              setNotifOpen(false);
                              navigate("/notifications", {
                                state: { selectedNotificationId: notif._id },
                              });
                            }}
                          >
                            <div className="us-nav__notif-icon">
                              {notif.type === 'warning' && '⚠️'}
                              {notif.type === 'report' && '🚩'}
                              {notif.type === 'message' && '💬'}
                            </div>
                            <div className="us-nav__notif-content">
                              <div className="us-nav__notif-msg">{notif.message}</div>
                              {notif.data?.sentByName && (
                                <div className="us-nav__notif-meta">From: {notif.data.sentByName}</div>
                              )}
                              <div className="us-nav__notif-time">
                                {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {!notif.isRead && <div className="us-nav__notif-unread-dot" />}
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div style={{ borderTop: "1px solid #f0f4ff", padding: "10px 14px", background: "#fbfdff" }}>
                        <button
                          className="us-nav__notif-mark-all"
                          style={{ textDecoration: "none", fontWeight: 700 }}
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/notifications");
                          }}
                        >
                          View full notification list
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Messages */}
              <button className="us-nav__icon-btn" aria-label="Messages">
                <MessageCircle size={17} strokeWidth={2} />
              </button>

              {/* User dropdown */}
              <div className="us-nav__user-wrap" ref={dropRef}>
                <button
                  className={`us-nav__user-btn${dropOpen ? " open" : ""}`}
                  onClick={() => setDropOpen(p => !p)}
                  aria-expanded={dropOpen}
                >
                  <div className="us-nav__avatar">
                    {profilePicture ? <img src={profilePicture} alt="" /> : initials}
                  </div>
                  <div className="us-nav__user-info">
                    <span className="us-nav__user-name">{displayName}</span>
                    <span
                      className="us-nav__user-role"
                      style={{ background: roleMeta.bg, color: roleMeta.color }}
                    >
                      {roleMeta.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`us-nav__chevron${dropOpen ? " open" : ""}`}
                    strokeWidth={2.5}
                  />
                </button>

                {dropOpen && (
                  <div className="us-nav__dropdown">
                    {/* Header */}
                    <div className="us-nav__drop-header">
                      <div className="us-nav__drop-avatar">
                        {profilePicture ? <img src={profilePicture} alt="" /> : initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="us-nav__drop-name">{displayName}</div>
                        <div className="us-nav__drop-email">{user?.email}</div>
                        <div
                          className="us-nav__drop-role-badge"
                          style={{ background: roleMeta.bg, color: roleMeta.color }}
                        >
                          {role === "admin" && <Shield size={10} />}
                          {roleMeta.label}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="us-nav__drop-items">
                      <Link
                        to="/profile"
                        className="us-nav__drop-item"
                        onClick={() => setDropOpen(false)}
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="us-nav__drop-item"
                        onClick={() => setDropOpen(false)}
                      >
                        <Settings size={15} /> Settings
                      </Link>
                      {role === "admin" && (
                        <Link
                          to="/admin"
                          className="us-nav__drop-item"
                          onClick={() => setDropOpen(false)}
                        >
                          <Shield size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="us-nav__drop-divider" />
                      <button
                        className="us-nav__drop-item us-nav__drop-item--danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest: just the Login button */
            <Link to="/login" className="us-nav__login-btn">
              Sign In →
            </Link>
          )}
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      {isLoggedIn && (
        <div className={`us-nav__mobile-menu${mobileMenuOpen ? " open" : ""}`}>
          <ul className="us-nav__mobile-links">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={location.pathname === path ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;