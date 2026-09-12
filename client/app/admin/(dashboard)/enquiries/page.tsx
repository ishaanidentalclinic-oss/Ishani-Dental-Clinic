"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, Loader2, Mail, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ContactStatusBadge } from "@/components/admin/ContactStatusBadge";
import { ContactDetailModal } from "@/components/admin/ContactDetailModal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listContacts, updateContactStatus, deleteContact } from "@/lib/adminContacts";
import { ApiError } from "@/lib/adminApi";
import { CONTACT_STATUS_VALUES, type ContactStatus } from "@/constants/adminContactStatus";
import type { AdminContact, PaginationMeta } from "@/types/admin";

const PAGE_SIZE = 10;

export default function AdminEnquiriesPage() {
  const { admin } = useAdminAuth();
  const canDelete = admin?.role === "super_admin";

  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "">("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput);

  const [actionId, setActionId] = useState<string | null>(null);
  const [detailTarget, setDetailTarget] = useState<AdminContact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminContact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  function updateSort(value: "newest" | "oldest") {
    setSort(value);
    setPage(1);
  }
  function updateStatusFilter(value: ContactStatus | "") {
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

    listContacts({
      page,
      limit: PAGE_SIZE,
      sort,
      status: statusFilter || undefined,
      search: debouncedSearch || undefined,
    })
      .then((data) => {
        if (ignore) return;
        setContacts(data.contacts);
        setMeta(data.meta);
      })
      .catch((err) => {
        if (ignore) return;
        toast.error(err instanceof ApiError ? err.message : "Failed to load enquiries");
      })
      .finally(() => {
        if (!ignore) setResolvedQueryKey(currentQueryKey);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- currentQueryKey is derived from the same deps listed here
  }, [page, sort, statusFilter, debouncedSearch, reloadToken]);

  const handleResolve = async (contact: AdminContact) => {
    setActionId(contact._id);
    try {
      const updated = await updateContactStatus(contact._id, "resolved");
      setContacts((current) => current.map((c) => (c._id === updated._id ? updated : c)));
      toast.success("Marked as resolved");
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
      await deleteContact(deleteTarget._id);
      toast.success("Enquiry deleted");
      setDeleteTarget(null);
      if (contacts.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setReloadToken((t) => t + 1);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete enquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink-900">Enquiries</h1>
        <p className="text-sm text-ink-700">View, filter, and manage every contact enquiry.</p>
      </div>

      <Card className="mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-700/50" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => updateSearchInput(event.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full rounded-lg border border-black/10 bg-white py-2.5 pr-4 pl-10 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(event) => updateStatusFilter(event.target.value as ContactStatus | "")}
          className="sm:w-44"
        >
          <option value="">All statuses</option>
          {CONTACT_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {status === "new" ? "New" : "Resolved"}
            </option>
          ))}
        </Select>

        <Select
          value={sort}
          onChange={(event) => updateSort(event.target.value as "newest" | "oldest")}
          className="sm:w-40"
        >
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
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Mail size={28} className="text-ink-700/40" />
            <p className="text-sm text-ink-700">No enquiries match your filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="divide-y divide-black/5 sm:hidden">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-900">{contact.name}</p>
                      <p className="text-xs text-ink-700">{contact.email}</p>
                    </div>
                    <ContactStatusBadge status={contact.status} />
                  </div>
                  <p className="mt-2 text-sm text-ink-900">{contact.subject || "—"}</p>
                  <p className="text-xs text-ink-700">
                    {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    {actionId === contact._id ? (
                      <Loader2 size={16} className="animate-spin text-ink-700" />
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setDetailTarget(contact)}
                          aria-label="View details"
                          title="View details"
                          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-black/5"
                        >
                          <Eye size={16} />
                        </button>
                        {contact.status === "new" && (
                          <button
                            type="button"
                            onClick={() => handleResolve(contact)}
                            aria-label="Mark as resolved"
                            title="Mark as resolved"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-primary-700 hover:bg-primary-50"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(contact)}
                            aria-label="Delete enquiry"
                            title="Delete"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </>
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
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Subject</th>
                    <th className="px-5 py-3">Received</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, index) => (
                    <motion.tr
                      key={contact._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="border-b border-black/5 last:border-0 hover:bg-sage-50/60"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-ink-900">{contact.name}</p>
                        <p className="text-xs text-ink-700">{contact.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-ink-900">{contact.subject || "—"}</td>
                      <td className="px-5 py-3.5 text-ink-700">
                        {new Date(contact.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <ContactStatusBadge status={contact.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {actionId === contact._id ? (
                            <Loader2 size={16} className="animate-spin text-ink-700" />
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setDetailTarget(contact)}
                                aria-label="View details"
                                title="View details"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 hover:bg-black/5"
                              >
                                <Eye size={16} />
                              </button>
                              {contact.status === "new" && (
                                <button
                                  type="button"
                                  onClick={() => handleResolve(contact)}
                                  aria-label="Mark as resolved"
                                  title="Mark as resolved"
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-primary-700 hover:bg-primary-50"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(contact)}
                                  aria-label="Delete enquiry"
                                  title="Delete"
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </>
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

      <ContactDetailModal contact={detailTarget} onClose={() => setDetailTarget(null)} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this enquiry?"
        description={`This will permanently delete ${deleteTarget?.name ?? "this"}'s enquiry. This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
