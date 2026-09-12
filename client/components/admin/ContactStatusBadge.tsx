import type { ContactStatus } from "@/constants/adminContactStatus";
import { cn } from "@/lib/cn";

const STATUS_CLASSES: Record<ContactStatus, string> = {
  new: "bg-amber-50 text-amber-700",
  resolved: "bg-primary-50 text-primary-700",
};

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: "New",
  resolved: "Resolved",
};

export function ContactStatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium",
        STATUS_CLASSES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
