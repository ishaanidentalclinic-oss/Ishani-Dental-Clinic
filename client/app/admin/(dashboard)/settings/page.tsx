"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { BusinessHoursEditor } from "@/components/admin/BusinessHoursEditor";
import { ChangePasswordCard } from "@/components/admin/ChangePasswordCard";
import { MEDIA_FOLDER } from "@/lib/adminMedia";
import { getSiteSettings, updateSiteSettings } from "@/lib/adminSettings";
import { ApiError } from "@/lib/adminApi";
import type { SiteSettings, SchedulingHours } from "@/types/admin";

function toFormState(settings: SiteSettings) {
  return {
    clinicName: settings.clinicName,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    phone: settings.contact.phone,
    email: settings.contact.email,
    address: settings.contact.address,
    whatsappNumber: settings.contact.whatsappNumber,
    googleMapsUrl: settings.contact.googleMapsUrl,
    googleReviewsUrl: settings.contact.googleReviewsUrl,
    businessHours: settings.businessHours,
    schedulingHours: settings.schedulingHours,
    metaTitle: settings.seo.metaTitle,
    metaDescription: settings.seo.metaDescription,
    ogImageUrl: settings.seo.ogImageUrl,
    footerAbout: settings.footer.about,
  };
}

type FormState = ReturnType<typeof toFormState>;

export default function AdminSettingsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    getSiteSettings()
      .then((data) => {
        if (ignore) return;
        setForm(toFormState(data));
      })
      .catch((err) => {
        if (ignore) return;
        toast.error(err instanceof ApiError ? err.message : "Failed to load settings");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  function patch(fields: Partial<FormState>) {
    setForm((current) => (current ? { ...current, ...fields } : current));
  }

  async function handleSave() {
    if (!form) return;

    setIsSaving(true);
    try {
      const updated = await updateSiteSettings({
        clinicName: form.clinicName.trim(),
        logoUrl: form.logoUrl,
        faviconUrl: form.faviconUrl,
        contact: {
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          whatsappNumber: form.whatsappNumber.trim(),
          googleMapsUrl: form.googleMapsUrl.trim(),
          googleReviewsUrl: form.googleReviewsUrl.trim(),
        },
        businessHours: form.businessHours.trim(),
        schedulingHours: form.schedulingHours,
        seo: {
          metaTitle: form.metaTitle.trim(),
          metaDescription: form.metaDescription.trim(),
          ogImageUrl: form.ogImageUrl,
        },
        footer: {
          about: form.footerAbout.trim(),
        },
      });
      setForm(toFormState(updated));
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-700">
          Manage the clinic&apos;s contact details, branding, and default SEO.
        </p>
      </div>

      {isLoading || !form ? (
        <Card className="mt-6 space-y-3 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-black/[0.04]" />
          ))}
        </Card>
      ) : (
        <div className="mt-6 space-y-6">
          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              Clinic identity
            </h2>
            <FormField label="Clinic name" htmlFor="clinicName">
              <Input
                id="clinicName"
                value={form.clinicName}
                onChange={(event) => patch({ clinicName: event.target.value })}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ImageUploader
                value={form.logoUrl}
                onChange={(url) => patch({ logoUrl: url })}
                folder={MEDIA_FOLDER.HOMEPAGE}
                label="Logo"
                aspectClassName="aspect-square"
              />
              <ImageUploader
                value={form.faviconUrl}
                onChange={(url) => patch({ faviconUrl: url })}
                folder={MEDIA_FOLDER.HOMEPAGE}
                label="Favicon"
                aspectClassName="aspect-square"
              />
            </div>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              Contact information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Phone" htmlFor="phone">
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => patch({ phone: event.target.value })}
                />
              </FormField>
              <FormField label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => patch({ email: event.target.value })}
                />
              </FormField>
              <FormField label="WhatsApp number" htmlFor="whatsappNumber">
                <Input
                  id="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={(event) => patch({ whatsappNumber: event.target.value })}
                  placeholder="919876543210"
                />
              </FormField>
              <FormField label="Business hours" htmlFor="businessHours">
                <Input
                  id="businessHours"
                  value={form.businessHours}
                  onChange={(event) => patch({ businessHours: event.target.value })}
                  placeholder="Mon–Sat: 9:00 AM – 8:00 PM"
                />
              </FormField>
            </div>
            <FormField label="Address" htmlFor="address">
              <Textarea
                id="address"
                rows={2}
                value={form.address}
                onChange={(event) => patch({ address: event.target.value })}
              />
            </FormField>
            <FormField label="Google Maps URL" htmlFor="googleMapsUrl">
              <Input
                id="googleMapsUrl"
                value={form.googleMapsUrl}
                onChange={(event) => patch({ googleMapsUrl: event.target.value })}
                placeholder="https://maps.app.goo.gl/..."
              />
            </FormField>
            <FormField label="Google Reviews URL" htmlFor="googleReviewsUrl">
              <Input
                id="googleReviewsUrl"
                value={form.googleReviewsUrl}
                onChange={(event) => patch({ googleReviewsUrl: event.target.value })}
                placeholder="https://g.page/r/..."
              />
            </FormField>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              Appointment Scheduling Hours
            </h2>
            <BusinessHoursEditor
              value={form.schedulingHours}
              onChange={(schedulingHours: SchedulingHours) => patch({ schedulingHours })}
            />
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              Default SEO
            </h2>
            <FormField label="Meta title" htmlFor="metaTitle">
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(event) => patch({ metaTitle: event.target.value })}
                maxLength={70}
              />
            </FormField>
            <FormField label="Meta description" htmlFor="metaDescription">
              <Textarea
                id="metaDescription"
                rows={2}
                value={form.metaDescription}
                onChange={(event) => patch({ metaDescription: event.target.value })}
                maxLength={160}
              />
            </FormField>
            <ImageUploader
              value={form.ogImageUrl}
              onChange={(url) => patch({ ogImageUrl: url })}
              folder={MEDIA_FOLDER.HOMEPAGE}
              label="Open Graph image"
            />
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">Footer</h2>
            <FormField label="About blurb" htmlFor="footerAbout">
              <Textarea
                id="footerAbout"
                rows={3}
                value={form.footerAbout}
                onChange={(event) => patch({ footerAbout: event.target.value })}
              />
            </FormField>
          </Card>

          <ChangePasswordCard />

          <div className="flex justify-end">
            <Button type="button" disabled={isSaving} onClick={handleSave}>
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={16} /> Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
