"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  FileText,
  ShieldAlert,
  BookOpen,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  Menu,
  Bell,
  CheckCheck,
  ScanLine,
  MessageSquare,
  Activity,
  Wifi,
  Cpu,
  Clock,
} from "lucide-react";

const API_SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5000";

type AppNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── NAV ITEMS ───
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/scanner", label: "Threat Scanner", icon: ScanLine },
  { href: "/incidents", label: "Incident Log", icon: ShieldAlert },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/tickets", label: "Support", icon: MessageSquare },
];

const NotificationCenter = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_SERVER_BASE_URL}/notifications?userId=${encodeURIComponent(userId)}&limit=25`,
        { cache: "no-store" },
      );
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const markOneRead = async (notificationId: string) => {
    try {
      await fetch(`${API_SERVER_BASE_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setNotifications((prev) =>
        prev.map((item) => item.id === notificationId ? { ...item, isRead: true } : item),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_SERVER_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="relative z-30">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl border border-[#d9d0bf] bg-white p-2.5 text-[#1A2406] shadow-sm"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#8f1f2f] px-1.5 py-0.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#d9d0bf] bg-white p-3 shadow-[0_20px_50px_rgba(13,17,4,0.15)]">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-bold text-[#122016]">Notifications</p>
            <button type="button" onClick={markAllRead} className="inline-flex items-center gap-1 rounded-md border border-[#d9d0bf] px-2 py-1 text-xs text-[#1f6a42]">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {loading ? <p className="p-3 text-xs text-[#526157]">Loading notifications...</p> : null}
            {!loading && notifications.length === 0 ? <p className="p-3 text-xs text-[#526157]">No notifications yet.</p> : null}
            {notifications.map((item) => (
              <button key={item.id} type="button" onClick={() => markOneRead(item.id)}
                className={`w-full rounded-xl border p-3 text-left ${item.isRead ? "border-[#ece6d9] bg-[#fcfbf8]" : "border-[#d9d0bf] bg-[#f9fdf3]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#122016]">{item.title}</p>
                  {!item.isRead ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1f6a42]" /> : null}
                </div>
                <p className="mt-1 text-xs text-[#526157]">{item.message}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-[#8b968f]">{new Date(item.createdAt).toLocaleString("en-IN")}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ─── SYSTEM STATUS WIDGET ───
const SystemStatusWidget = ({ collapsed }: { collapsed: boolean }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 mb-4">
      {!collapsed && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">System Status</p>
      )}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shrink-0" />
          {!collapsed && <span className="text-xs text-white/70">All systems operational</span>}
        </div>
        {!collapsed && (
          <>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-[#D9F24F] shrink-0" />
              <span className="text-xs text-white/50">Models: <span className="text-[#D9F24F]">Active</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/30 shrink-0" />
              <span className="text-xs text-white/40">Updated: {time}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── SIDEBAR ───
const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) => {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully");
    window.location.href = "/";
  };

  return (
    <div className="hidden md:block sticky top-6 h-[calc(100vh-3rem)] ml-6 shrink-0 z-50">
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col h-full bg-[#1A2406] text-white overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(13,17,4,0.15)] border border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center gap-4 px-6 py-10 border-b border-white/5 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#D9F24F] flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(217,242,79,0.25)]">
            <ShieldCheck className="w-5 h-5 text-[#1A2406]" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span key="logo-text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}
                className="font-jakarta font-bold text-xl tracking-[-0.04em] whitespace-nowrap">
                NullThreat
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-10 px-2 space-y-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}>
                <div className={`relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group cursor-pointer
                  ${active ? "bg-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.03)]" : "text-white/40 hover:bg-white/5 hover:text-white"}`}>
                  {active && (
                    <motion.div layoutId="sidebar-active-pill"
                      className="absolute left-1 top-3 bottom-3 w-1 bg-[#D9F24F] rounded-full shadow-[0_0_15px_rgba(217,242,79,0.6)]" />
                  )}
                  <div className="w-10 flex justify-center shrink-0">
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${active ? "text-[#D9F24F]" : "text-white/40 group-hover:text-white"}`} />
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span key={`label-${href}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
                        className={`text-sm font-medium whitespace-nowrap font-jakarta tracking-[-0.02em] ${active ? "opacity-100" : "opacity-80"}`}>
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-8 border-t border-white/5 flex flex-col items-center">
          <SystemStatusWidget collapsed={collapsed} />
          <button onClick={handleSignOut}
            className="flex items-center gap-4 px-4 py-4 w-full rounded-xl text-white/30 hover:bg-white/5 hover:text-white transition-all duration-300 group">
            <div className="w-10 flex justify-center shrink-0">
              <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors duration-300" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span key="signout-label" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap font-jakarta tracking-[-0.02em]">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-7 h-7 rounded-full bg-[#1A2406] text-[#D9F24F] border border-white/10 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-10">
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.4, ease: "backOut" }}>
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.aside>
    </div>
  );
};

// ─── DASHBOARD LAYOUT ───
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [banRedirecting, setBanRedirecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const validateAccess = async () => {
      if (isPending) return;
      if (session == null) {
        if (!banRedirecting) {
          toast.error("You must be logged in to access the dashboard.");
          router.push("/login");
        }
        if (!cancelled) setIsChecking(false);
        return;
      }
      try {
        const response = await fetch("/api/user/access-status", { cache: "no-store" });
        const data = await response.json();
        if (response.ok && data?.isBanned) {
          setBanRedirecting(true);
          toast.error("Your account has been banned. Please contact admin support.");
          await authClient.signOut();
          window.location.href = "/banned";
          return;
        }
      } catch (error) {
        console.error("Failed to validate account status:", error);
      }
      if (!cancelled) setIsChecking(false);
    };
    validateAccess();
    return () => { cancelled = true; };
  }, [session, isPending, router, banRedirecting]);

  if (isPending || isChecking) return <Loading />;

  return (
    <div className="flex min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#D9F24F] selection:text-[#1A2406]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,244,241,1)_0%,rgba(250,250,249,1)_100%)] pointer-events-none" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="relative flex-1 flex flex-col min-h-screen overflow-hidden">
        {session?.user?.id ? (
          <div className="pointer-events-none absolute right-6 top-6 hidden md:block">
            <div className="pointer-events-auto">
              <NotificationCenter userId={session.user.id} />
            </div>
          </div>
        ) : null}

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#1A2406] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D9F24F] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#1A2406]" />
            </div>
            <span className="font-jakarta font-bold text-lg tracking-[-0.04em]">NullThreat</span>
          </div>
          <div className="flex items-center gap-2">
            {session?.user?.id ? <NotificationCenter userId={session.user.id} /> : null}
            <Link href="/docs" className="p-2 bg-white/5 rounded-xl" aria-label="Open documentation">
              <BookOpen className="w-5 h-5" />
            </Link>
            <button className="p-2 bg-white/5 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto scrollbar-none scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
