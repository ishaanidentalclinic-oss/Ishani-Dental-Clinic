"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { changePassword } from "@/lib/adminAuth";
import { ApiError } from "@/lib/adminApi";

function PasswordInput({
  id,
  autoComplete,
  value,
  onChange,
  disabled,
}: {
  id: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder="••••••••"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible((show) => !show)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-700/60 transition-colors hover:text-ink-900"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function ChangePasswordCard() {
  const router = useRouter();
  const { logout } = useAdminAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed — please sign in again with your new password.");
      // Changing password revokes every session server-side, so send the
      // admin back to login rather than leaving them in a dashboard whose
      // session is about to stop refreshing.
      await logout();
      router.push("/admin/login");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Current password" htmlFor="currentPassword">
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
            disabled={isSubmitting}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="New password" htmlFor="newPassword">
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={setNewPassword}
              disabled={isSubmitting}
            />
          </FormField>
          <FormField label="Confirm new password" htmlFor="confirmPassword">
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={isSubmitting}
            />
          </FormField>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Changing…
              </>
            ) : (
              <>
                <KeyRound size={16} /> Change Password
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
