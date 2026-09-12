"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminIndexPage() {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(admin ? "/admin/dashboard" : "/admin/login");
  }, [isLoading, admin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-50">
      <Loader2 size={28} className="animate-spin text-primary-700" />
    </div>
  );
}
