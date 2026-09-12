import type { AppointmentStatus } from "@/constants/adminAppointmentStatus";
import { cn } from "@/lib/cn";

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Completed: "bg-primary-50 text-primary-700",
  Cancelled: "bg-red-50 text-red-700",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium",
        STATUS_CLASSES[status],
      )}
    >
      {status}
    </span>
  );
}
