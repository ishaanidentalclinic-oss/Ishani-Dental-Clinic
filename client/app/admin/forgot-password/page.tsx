import { MailQuestion } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

// Self-service password reset (email token flow) isn't built yet — this is
// the placeholder the login page's "Forgot password?" link points to until
// that's implemented.
export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-sage-50 px-6 py-12">
      <div className="absolute top-6 left-6">
        <Logo className="text-ink-900" />
      </div>

      <Card className="w-full max-w-sm p-6 text-center sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-primary-700">
          <MailQuestion size={20} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-ink-900">Reset your password</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          Self-service password reset isn&apos;t available yet. Please ask a Super Admin to reset
          your password directly for now.
        </p>
        <Button href="/admin/login" variant="outline" className="mt-6 w-full">
          Back to Sign In
        </Button>
      </Card>
    </div>
  );
}
