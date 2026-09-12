"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DropdownWithOther } from "@/components/admin/DropdownWithOther";
import { StringListEditor } from "@/components/admin/StringListEditor";
import { TreatmentProcedureEditor } from "@/components/admin/TreatmentProcedureEditor";
import { TreatmentFaqEditor } from "@/components/admin/TreatmentFaqEditor";
import { RelatedTreatmentsPicker } from "@/components/admin/RelatedTreatmentsPicker";
import { TreatmentPreviewModal } from "@/components/admin/TreatmentPreviewModal";
import { MEDIA_FOLDER } from "@/lib/adminMedia";
import { createTreatment, updateTreatment, listTreatments, type TreatmentPayload } from "@/lib/adminTreatments";
import { ApiError } from "@/lib/adminApi";
import type { AdminTreatment } from "@/types/admin";

interface TreatmentFormProps {
  treatment?: AdminTreatment;
}

const TREATMENT_CATEGORY_OPTIONS = [
  "Preventive",
  "Restorative",
  "Cosmetic",
  "Surgical",
  "Orthodontic",
  "Periodontal",
  "Pediatric",
  "Diagnostic",
];

function toFormState(treatment?: AdminTreatment) {
  const relatedTreatments = treatment?.relatedTreatments ?? [];
  return {
    name: treatment?.name ?? "",
    slug: treatment?.slug ?? "",
    shortDescription: treatment?.shortDescription ?? "",
    overview: treatment?.overview ?? "",
    bannerImage: treatment?.bannerImage ?? "",
    category: treatment?.category ?? "",
    benefits: treatment?.benefits ?? ([] as string[]),
    idealFor: treatment?.idealFor ?? ([] as string[]),
    duration: treatment?.duration ?? "",
    recovery: treatment?.recovery ?? "",
    procedure: treatment?.procedure ?? [],
    faqs: treatment?.faqs ?? [],
    relatedTreatments: relatedTreatments.map((item) => (typeof item === "string" ? item : item._id)),
    displayOrder: treatment?.displayOrder ?? 0,
    metaTitle: treatment?.seo?.metaTitle ?? "",
    metaDescription: treatment?.seo?.metaDescription ?? "",
    ogImageUrl: treatment?.seo?.ogImageUrl ?? "",
  };
}

export function TreatmentForm({ treatment }: TreatmentFormProps) {
  const router = useRouter();
  const isEditing = Boolean(treatment);

  const [form, setForm] = useState(toFormState(treatment));
  const [isSaving, setIsSaving] = useState<"draft" | "published" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [allTreatments, setAllTreatments] = useState<AdminTreatment[]>([]);

  useEffect(() => {
    let ignore = false;
    listTreatments({ page: 1, limit: 100, sort: "order" })
      .then((data) => {
        if (!ignore) setAllTreatments(data.treatments);
      })
      .catch(() => {
        // Related-treatments picker just shows empty — not worth a toast for a secondary field.
      });
    return () => {
      ignore = true;
    };
  }, []);

  function patch(fields: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...fields }));
  }

  function buildPayload(status: "draft" | "published"): TreatmentPayload {
    return {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      shortDescription: form.shortDescription.trim(),
      overview: form.overview.trim(),
      bannerImage: form.bannerImage,
      category: form.category.trim(),
      benefits: form.benefits.map((b) => b.trim()).filter(Boolean),
      idealFor: form.idealFor.map((i) => i.trim()).filter(Boolean),
      duration: form.duration.trim(),
      recovery: form.recovery.trim(),
      procedure: form.procedure,
      faqs: form.faqs,
      relatedTreatments: form.relatedTreatments,
      status,
      displayOrder: form.displayOrder,
      seo: {
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        ogImageUrl: form.ogImageUrl,
      },
    };
  }

  async function handleSave(status: "draft" | "published") {
    if (!form.name.trim() || !form.shortDescription.trim() || !form.overview.trim()) {
      toast.error("Please fill in the treatment name, short description, and full description.");
      return;
    }

    setIsSaving(status);
    try {
      const payload = buildPayload(status);
      if (isEditing && treatment) {
        await updateTreatment(treatment._id, payload);
      } else {
        await createTreatment(payload);
      }
      toast.success(status === "published" ? "Treatment published" : "Treatment saved as draft");
      router.push("/admin/treatments");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save treatment");
    } finally {
      setIsSaving(null);
    }
  }

  const relatedPreview = allTreatments
    .filter((t) => form.relatedTreatments.includes(t._id))
    .map((t) => ({ name: t.name, slug: t.slug }));

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">Essentials</h2>

        <FormField label="Treatment name" htmlFor="name">
          <Input
            id="name"
            value={form.name}
            onChange={(event) => patch({ name: event.target.value })}
            placeholder="e.g. Dental Implants"
          />
        </FormField>

        <FormField label="Category" htmlFor="category">
          <DropdownWithOther
            id="category"
            value={form.category}
            options={TREATMENT_CATEGORY_OPTIONS}
            onChange={(category) => patch({ category })}
            placeholder="Select a category"
            otherPlaceholder="e.g. Preventive"
          />
        </FormField>

        <FormField label="Short description" htmlFor="shortDescription">
          <Textarea
            id="shortDescription"
            rows={2}
            value={form.shortDescription}
            onChange={(event) => patch({ shortDescription: event.target.value })}
            placeholder="Shown on treatment cards..."
          />
        </FormField>

        <FormField label="Full description" htmlFor="overview">
          <Textarea
            id="overview"
            rows={4}
            value={form.overview}
            onChange={(event) => patch({ overview: event.target.value })}
            placeholder="Shown at the top of the treatment detail view..."
          />
        </FormField>

        <ImageUploader
          value={form.bannerImage}
          onChange={(url) => patch({ bannerImage: url })}
          folder={MEDIA_FOLDER.TREATMENTS}
          label="Banner image"
        />
      </Card>

      <button
        type="button"
        onClick={() => setShowMoreDetails((show) => !show)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700"
      >
        {showMoreDetails ? "Hide more details" : "Show more details (optional)"}
        <ChevronDown
          size={16}
          className={`transition-transform ${showMoreDetails ? "rotate-180" : ""}`}
        />
      </button>

      {showMoreDetails && (
        <>
          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              More details
            </h2>
            <FormField
              label="URL slug (optional — auto-generated from name if left blank)"
              htmlFor="slug"
            >
              <Input
                id="slug"
                value={form.slug}
                onChange={(event) => patch({ slug: event.target.value })}
                placeholder="dental-implants"
              />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Duration" htmlFor="duration">
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(event) => patch({ duration: event.target.value })}
                  placeholder="30–45 minutes"
                />
              </FormField>
              <FormField label="Recovery (optional)" htmlFor="recovery">
                <Input
                  id="recovery"
                  value={form.recovery}
                  onChange={(event) => patch({ recovery: event.target.value })}
                  placeholder="Mild sensitivity for a day"
                />
              </FormField>
              <FormField label="Display order" htmlFor="displayOrder">
                <Input
                  id="displayOrder"
                  type="number"
                  value={form.displayOrder}
                  onChange={(event) => patch({ displayOrder: Number(event.target.value) })}
                />
              </FormField>
            </div>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">Benefits</h2>
            <StringListEditor
              items={form.benefits}
              onChange={(benefits) => patch({ benefits })}
              placeholder="e.g. Restores strength to a weakened tooth"
              addLabel="Add benefit"
            />
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              Ideal Candidates
            </h2>
            <StringListEditor
              items={form.idealFor}
              onChange={(idealFor) => patch({ idealFor })}
              placeholder="e.g. Adults with one or more missing teeth"
              addLabel="Add candidate"
            />
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">Procedure</h2>
            <TreatmentProcedureEditor
              steps={form.procedure}
              onChange={(procedure) => patch({ procedure })}
            />
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">FAQs</h2>
            <TreatmentFaqEditor faqs={form.faqs} onChange={(faqs) => patch({ faqs })} />
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
              Related Treatments
            </h2>
            <RelatedTreatmentsPicker
              options={allTreatments}
              selectedIds={form.relatedTreatments}
              excludeId={treatment?._id}
              onChange={(relatedTreatments) => patch({ relatedTreatments })}
            />
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">SEO</h2>
            <FormField label="SEO title" htmlFor="metaTitle">
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(event) => patch({ metaTitle: event.target.value })}
                maxLength={70}
              />
            </FormField>
            <FormField label="SEO description" htmlFor="metaDescription">
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
              folder={MEDIA_FOLDER.TREATMENTS}
              label="Open Graph image"
            />
          </Card>
        </>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
          Preview
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving !== null}
          onClick={() => handleSave("draft")}
        >
          {isSaving === "draft" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving…
            </>
          ) : (
            "Save as Draft"
          )}
        </Button>
        <Button type="button" disabled={isSaving !== null} onClick={() => handleSave("published")}>
          {isSaving === "published" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Publishing…
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>

      <TreatmentPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        treatment={{
          name: form.name,
          overview: form.overview,
          bannerImage: form.bannerImage,
          benefits: form.benefits,
          idealFor: form.idealFor,
          duration: form.duration,
          recovery: form.recovery,
          procedure: form.procedure,
          faqs: form.faqs,
          relatedTreatments: relatedPreview,
        }}
      />
    </div>
  );
}
