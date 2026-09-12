"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { TreatmentForm } from "@/components/admin/TreatmentForm";
import { getTreatment } from "@/lib/adminTreatments";
import { ApiError } from "@/lib/adminApi";
import type { AdminTreatment } from "@/types/admin";

export default function EditTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [treatment, setTreatment] = useState<AdminTreatment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    getTreatment(id)
      .then((data) => {
        if (ignore) return;
        setTreatment(data);
      })
      .catch((err) => {
        if (ignore) return;
        setNotFound(true);
        toast.error(err instanceof ApiError ? err.message : "Failed to load treatment");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div>
      <Link
        href="/admin/treatments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800"
      >
        <ArrowLeft size={16} />
        Back to Treatments
      </Link>

      <div className="mt-3">
        <h1 className="text-2xl font-semibold text-ink-900">Edit Treatment</h1>
        <p className="text-sm text-ink-700">Update this treatment&apos;s content and settings.</p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Card className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-black/[0.04]" />
            ))}
          </Card>
        ) : notFound || !treatment ? (
          <Card className="p-6 text-sm text-ink-700">This treatment could not be found.</Card>
        ) : (
          <TreatmentForm treatment={treatment} />
        )}
      </div>
    </div>
  );
}
