"use client";

import { useState } from "react";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { TreatmentDetailCard } from "@/components/treatments/TreatmentDetailCard";
import { TreatmentModal } from "@/components/treatments/TreatmentModal";
import type { PublicTreatment } from "@/types/treatment";

export function TreatmentsGrid({ treatments }: { treatments: PublicTreatment[] }) {
  const [selected, setSelected] = useState<PublicTreatment | null>(null);

  return (
    <>
      <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {treatments.map((treatment) => (
          <StaggerItem key={treatment._id}>
            <TreatmentDetailCard
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
