import Image from "next/image";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { DOCTORS } from "@/constants/doctors";

export function Doctors() {
  return (
    <Section id="doctors" background="white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Our Specialists</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Meet the <span className="text-primary-600">Doctors</span> behind your smile.
        </h2>
        <p className="mt-4 text-base text-ink-700">
          Dedicated professionals delivering exceptional dental care with compassion and
          expertise.
        </p>
      </Reveal>

      <StaggerGroup className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2">
        {DOCTORS.map((doctor) => {
          return (
            <StaggerItem key={doctor.id}>
              <Card className="group relative h-full overflow-hidden border border-transparent transition-all duration-500 ease-(--ease-premium) hover:-translate-y-2 hover:border-primary-200 hover:shadow-float">
                <div className="absolute inset-x-0 top-0 h-1 bg-primary-600" />
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src={doctor.photo}
                    alt={`Portrait of ${doctor.name}`}
                    fill
                    sizes="(min-width: 640px) 400px, 90vw"
                    className="object-cover transition-transform duration-700 ease-(--ease-premium) group-hover:-translate-y-1 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  <span className="absolute top-4 left-4 rounded-pill bg-white/90 px-3 py-1 text-xs font-medium text-ink-900">
                    {doctor.experience}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-semibold text-ink-900">{doctor.name}</h3>
                  <p className="mt-1 text-sm font-medium tracking-wide text-primary-600 uppercase">
                    {doctor.role}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {doctor.credentials.map((credential) => (
                      <li
                        key={credential}
                        className="flex items-start gap-2 text-sm text-ink-700"
                      >
                        <Check size={15} className="mt-0.5 shrink-0 text-primary-600" />
                        {credential}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {doctor.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </Section>
  );
}
