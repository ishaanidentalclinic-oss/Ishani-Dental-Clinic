"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
};

export function AdminTopbar() {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Drawer covers the full screen while open — lock the page underneath so
  // it can't scroll behind it.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-900 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        {admin && (
          <div className="hidden items-center gap-2.5 sm:flex">
            <InitialsAvatar name={admin.name} />
            <div className="text-sm">
              <p className="font-medium text-ink-900">{admin.name}</p>
              <p className="text-xs text-ink-700">{ROLE_LABEL[admin.role] ?? admin.role}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-black/10 px-3.5 py-2 text-sm font-medium text-ink-900 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-ink-900/50"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="relative h-full w-64 max-w-[80vw] shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <AdminSidebar onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
