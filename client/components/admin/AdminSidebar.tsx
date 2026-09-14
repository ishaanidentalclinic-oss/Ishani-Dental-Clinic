"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { useAdminAuth, type AdminUser } from "@/context/AdminAuthContext";

type AdminRole = AdminUser["role"];

const ALL_ROLES: AdminRole[] = ["receptionist", "admin", "super_admin"];
const CMS_ROLES: AdminRole[] = ["admin", "super_admin"];

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  receptionist: "Receptionist",
};

// Receptionists are scoped to the scheduling engine only (Dashboard,
// Appointments, Patients) — never Blog/Treatments CMS, Enquiries, or
// Settings. See constants/adminRoles.js on the server for the same policy.
const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, comingSoon: false, roles: ALL_ROLES },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck, comingSoon: false, roles: ALL_ROLES },
  { href: "/admin/patients", label: "Patients", icon: Users, comingSoon: false, roles: ALL_ROLES },
  { href: "/admin/treatments", label: "Treatments", icon: Stethoscope, comingSoon: false, roles: CMS_ROLES },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, comingSoon: false, roles: CMS_ROLES },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare, comingSoon: false, roles: CMS_ROLES },
  { href: "/admin/settings", label: "Settings", icon: Settings, comingSoon: false, roles: CMS_ROLES },
] as const;

export function AdminSidebar({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void;
  /** Renders a close button next to the logo — used by the mobile drawer. */
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();
  const visibleItems = NAV_ITEMS.filter((item) => !admin || item.roles.includes(admin.role));

  const handleLogout = async () => {
    onClose?.();
    await logout();
    toast.success("Logged out");
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full flex-col bg-primary-950 text-white">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-6 py-5">
        <div>
          <Logo href="/admin/dashboard" className="text-white" onClick={onNavigate} />
          <p className="mt-1 text-xs text-white/50">Admin Portal</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {visibleItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/35"
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {item.label}
                </span>
                <span className="rounded-pill bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                  Soon
                </span>
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary-700 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {admin && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <InitialsAvatar name={admin.name} />
              <div className="min-w-0 text-sm">
                <p className="truncate font-medium text-white">{admin.name}</p>
                <p className="text-xs text-white/50">{ROLE_LABEL[admin.role] ?? admin.role}</p>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
