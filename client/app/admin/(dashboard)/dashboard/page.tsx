"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CalendarClock, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AppointmentStatusBadge } from "@/components/admin/AppointmentStatusBadge";
import { listAppointments } from "@/lib/adminAppointments";
import { toDateOnlyString } from "@/lib/dateOnly";
import type { AdminAppointment } from "@/types/admin";

interface Stats {
  total: number;
  pending: number;
  today: number;
}

const STAT_CARDS = [
  { key: "today" as const, label: "Today's Appointments", icon: CalendarClock },
  { key: "pending" as const, label: "Pending Appointments", icon: Clock },
  { key: "total" as const, label: "Total Appointments", icon: Users },
];

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<AdminAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        const [totalRes, pendingRes, todayRes, recentRes] = await Promise.all([
          listAppointments({ page: 1, limit: 1 }),
          listAppointments({ page: 1, limit: 1, status: "Pending" }),
          listAppointments({ page: 1, limit: 1, preferredDate: toDateOnlyString(new Date()) }),
          listAppointments({ page: 1, limit: 5, sort: "newest" }),
        ]);

        if (cancelled) return;
        setStats({
          total: totalRes.meta.totalRecords,
          pending: pendingRes.meta.totalRecords,
          today: todayRes.meta.totalRecords,
        });
        setRecent(recentRes.appointments);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">
        Welcome back{admin ? `, ${admin.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-ink-700">Here&apos;s what&apos;s happening at the clinic.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STAT_CARDS.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
          >
            <Card className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-primary-700">
                <stat.icon size={20} />
              </span>
              <div>
                <p className="text-2xl font-semibold text-ink-900">
                  {isLoading ? "—" : (stats?.[stat.key] ?? 0)}
                </p>
                <p className="text-sm text-ink-700">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recent Activity</h2>
            <Button href="/admin/appointments" variant="ghost" size="sm">
              View all
            </Button>
          </div>

          <div className="mt-4 space-y-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-black/[0.04]" />
              ))
            ) : recent.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-700">No appointments yet.</p>
            ) : (
              recent.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between gap-3 border-b border-black/5 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{appointment.name}</p>
                    <p className="truncate text-xs text-ink-700">{appointment.treatment}</p>
                  </div>
                  <AppointmentStatusBadge status={appointment.status} />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-ink-900">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <Button href="/admin/appointments" className="w-full">
              <Calendar size={16} />
              Manage Appointments
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
