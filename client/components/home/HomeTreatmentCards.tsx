"use client";

import { useState } from "react";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { TreatmentCard } from "@/components/shared/TreatmentCard";
import { TreatmentModal } from "@/components/treatments/TreatmentModal";
import type { PublicTreatment } from "@/types/treatment";

/**
 * Holds the "which treatment is open" state for the homepage preview cards —
 * mirrors TreatmentsGrid's own state shape so both mount the exact same
 * TreatmentModal component rather than each rolling their own modal.
 */
export function HomeTreatmentCards({ treatments }: { treatments: PublicTreatment[] }) {
  const [selected, setSelected] = useState<PublicTreatment | null>(null);

  return (
    <>
      <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {treatments.map((treatment) => (
          <StaggerItem key={treatment._id}>
            <TreatmentCard
              image={treatment.bannerImage}
              name={treatment.name}
              description={treatment.shortDescription}
              onClick={() => setSelected(treatment)}
            />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <TreatmentModal
        treatment={selected}
        allTreatments={treatments}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </>
  );
}
