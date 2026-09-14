"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Logo } from "@/components/ui/Logo";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  receptionist: "Receptionist",
};

export function AdminTopbar() {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock the page underneath while drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Auto close if viewport resizes to desktop breakpoint (lg)
  useEffect(() => {
    if (!mobileOpen) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMobileOpen(false);
      }
    };
    mql.addEventListener("change", handleMediaChange);
    return () => mql.removeEventListener("change", handleMediaChange);
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/admin/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-900 transition-colors hover:bg-black/5 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <div className="lg:hidden">
            <Logo href="/admin/dashboard" className="text-primary-950 text-base" />
          </div>
        </div>

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
      </header>

      {/* Render mobile drawer outside header to prevent backdrop-filter containing block issues */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <div
                className="fixed inset-0 z-50 lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Admin Navigation"
              >
                {/* Backdrop */}
                <motion.div
                  key="admin-mobile-backdrop"
                  className="fixed inset-0 bg-ink-950/60 backdrop-blur-xs"
                  onClick={() => setMobileOpen(false)}
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Sidebar Drawer */}
                <motion.div
                  key="admin-mobile-drawer"
                  className="fixed inset-y-0 left-0 h-full w-72 max-w-[85vw] shadow-2xl z-10 flex flex-col"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                >
                  <AdminSidebar
                    onNavigate={() => setMobileOpen(false)}
                    onClose={() => setMobileOpen(false)}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
