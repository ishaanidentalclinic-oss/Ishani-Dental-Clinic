"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Plus, Search, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listTreatments, updateTreatment, deleteTreatment } from "@/lib/adminTreatments";
import { ApiError } from "@/lib/adminApi";
import { TREATMENT_STATUS_VALUES, type TreatmentStatus } from "@/constants/adminTreatmentStatus";
import type { AdminTreatment, PaginationMeta } from "@/types/admin";

const PAGE_SIZE = 10;

const STATUS_CLASSES: Record<TreatmentStatus, string> = {
  draft: "bg-amber-50 text-amber-700",
  published: "bg-primary-50 text-primary-700",
};

export default function AdminTreatmentsListPage() {
  const { admin } = useAdminAuth();
  const canDelete = admin?.role === "super_admin";

  const [treatments, setTreatments] = useState<AdminTreatment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"newest" | "oldest" | "order">("order");
  const [statusFilter, setStatusFilter] = useState<TreatmentStatus | "">("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput);

  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTreatment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  function updateSort(value: "newest" | "oldest" | "order") {
    setSort(value);
    setPage(1);
  }
  function updateStatusFilter(value: TreatmentStatus | "") {
    setStatusFilter(value);
    setPage(1);
  }
  function updateSearchInput(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  const currentQueryKey = JSON.stringify({ page, sort, statusFilter, debouncedSearch, reloadToken });
  const [resolvedQueryKey, setResolvedQueryKey] = useState<string | null>(null);
  const isLoading = resolvedQueryKey !== currentQueryKey;

  useEffect(() => {
    let ignore = false;

    listTreatments({
      page,
      limit: PAGE_SIZE,
      sort,
      status: statusFilter || undefined,
      search: debouncedSearch || undefined,
    })
      .then((data) => {
        if (ignore) return;
        setTreatments(data.treatments);
        setMeta(data.meta);
      })
      .catch((err) => {
        if (ignore) return;
        toast.error(err instanceof ApiError ? err.message : "Failed to load treatments");
      })
      .finally(() => {
        if (!ignore) setResolvedQueryKey(currentQueryKey);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- currentQueryKey is derived from the same deps listed here
  }, [page, sort, statusFilter, debouncedSearch, reloadToken]);

  const handleToggleStatus = async (treatment: AdminTreatment) => {
    const nextStatus: TreatmentStatus = treatment.status === "published" ? "draft" : "published";
    setActionId(treatment._id);
    try {
      const updated = await updateTreatment(treatment._id, { status: nextStatus });
      setTreatments((current) => current.map((t) => (t._id === updated._id ? updated : t)));
      toast.success(nextStatus === "published" ? "Treatment published" : "Treatment unpublished");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTreatment(deleteTarget._id);
      toast.success("Treatment deleted");
      setDeleteTarget(null);
      if (treatments.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setReloadToken((t) => t + 1);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete treatment");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Treatments</h1>
          <p className="text-sm text-ink-700">Manage the treatment menu shown across the site.</p>
        </div>
        <Button href="/admin/treatments/new" className="w-fit">
          <Plus size={16} />
          New Treatment
        </Button>
      </div>

      <Card className="mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-700/50" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => updateSearchInput(event.target.value)}
            placeholder="Search by name or short description..."
            className="w-full rounded-lg border border-black/10 bg-white py-2.5 pr-4 pl-10 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(event) => updateStatusFilter(event.target.value as TreatmentStatus | "")}
          className="sm:w-44"
        >
          <option value="">All statuses</option>
          {TREATMENT_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {status === "draft" ? "Draft" : "Published"}
            </option>
          ))}
        </Select>

        <Select
          value={sort}
          onChange={(event) => updateSort(event.target.value as "newest" | "oldest" | "order")}
          className="sm:w-44"
        >
          <option value="order">Display order</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </Card>

      <Card className="mt-4 overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-black/[0.04]" />
            ))}
          </div>
        ) : treatments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Stethoscope size={28} className="text-ink-700/40" />
            <p className="text-sm text-ink-700">No treatments match your filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="divide-y divide-black/5 sm:hidden">
              {treatments.map((treatment, index) => (
                <motion.div
                  key={treatment._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-900">{treatment.name}</p>
                      <p className="text-xs text-ink-700">/{treatment.slug}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-pill px-3 py-1 text-xs font-medium ${STATUS_CLASSES[treatment.status]}`}
                    >
                      {treatment.status === "draft" ? "Draft" : "Published"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-ink-700">
                    Order {treatment.displayOrder} · Updated{" "}
                    {new Date(treatment.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    {actionId === treatment._id ? (
                      <Loader2 size={16} className="animate-spin text-ink-700" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(treatment)}
                        aria-label={treatment.status === "published" ? "Unpublish" : "Publish"}
                        title={treatment.status === "published" ? "Unpublish" : "Publish"}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-black/5"
                      >
                        {treatment.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                    <Link
                      href={`/admin/treatments/${treatment._id}`}
                      className="flex h-10 items-center rounded-full px-3.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
                    >
                      Edit
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(treatment)}
                        aria-label="Delete treatment"
                        title="Delete"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-xs font-semibold tracking-wide text-ink-700 uppercase">
                    <th className="px-5 py-3">Treatment</th>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Updated</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment, index) => (
                    <motion.tr
                      key={treatment._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="border-b border-black/5 last:border-0 hover:bg-sage-50/60"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-ink-900">{treatment.name}</p>
                        <p className="text-xs text-ink-700">/{treatment.slug}</p>
                      </td>
                      <td className="px-5 py-3.5 text-ink-700">{treatment.displayOrder}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium ${STATUS_CLASSES[treatment.status]}`}
                        >
                          {treatment.status === "draft" ? "Draft" : "Published"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-700">
                        {new Date(treatment.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {actionId === treatment._id ? (
                            <Loader2 size={16} className="animate-spin text-ink-700" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(treatment)}
                              aria-label={treatment.status === "published" ? "Unpublish" : "Publish"}
                              title={treatment.status === "published" ? "Unpublish" : "Publish"}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 hover:bg-black/5"
                            >
                              {treatment.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          )}
                          <Link
                            href={`/admin/treatments/${treatment._id}`}
                            className="rounded-full px-3.5 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
                          >
                            Edit
                          </Link>
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(treatment)}
                              aria-label="Delete treatment"
                              title="Delete"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-700">
          <p>
            Page {meta.currentPage} of {meta.totalPages} · {meta.totalRecords} total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-black/10 px-4 py-1.5 font-medium text-ink-900 transition-colors hover:border-primary-300 disabled:pointer-events-none disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="rounded-full border border-black/10 px-4 py-1.5 font-medium text-ink-900 transition-colors hover:border-primary-300 disabled:pointer-events-none disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this treatment?"
        description={`This will permanently delete "${deleteTarget?.name ?? "this treatment"}" and remove it from any other treatment's Related Treatments list. This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
