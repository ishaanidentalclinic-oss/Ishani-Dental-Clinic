"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TreatmentForm } from "@/components/admin/TreatmentForm";

export default function NewTreatmentPage() {
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
        <h1 className="text-2xl font-semibold text-ink-900">New Treatment</h1>
        <p className="text-sm text-ink-700">Add a new treatment to the public menu.</p>
      </div>

      <div className="mt-6">
        <TreatmentForm />
      </div>
    </div>
  );
}
