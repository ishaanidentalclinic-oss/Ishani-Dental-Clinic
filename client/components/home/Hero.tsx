import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { HeroVideoCard } from "@/components/home/HeroVideoCard";
import { HeroCta } from "@/components/home/HeroCta";
import { TRUST_BADGES } from "@/constants/trust-badges";

export function Hero() {
  return (
    <section id="home" className="relative">
      <div className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0 origin-[78%_42%] animate-[kenburns-hero_16s_ease-in-out_infinite]">
          <Image
            src="/images/hero/home-hero-clinic.webp"
            alt="Close-up of a patient's bright, healthy smile being examined by a dentist with a mirror in a clean, modern clinic"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[78%_42%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/72 via-ink-900/45 to-ink-900/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />

        <Container className="relative z-10 pt-24">
          <Reveal className="max-w-xl">
            <h1 className="text-4xl leading-[1.1] font-semibold text-white sm:text-5xl sm:leading-[1.05] md:text-6xl">
              Healthy Smiles
              <br />
              Begin Here.
            </h1>
            <p className="mt-6 max-w-md text-base text-white/85 sm:text-lg">
              Experience gentle, personalized dental care with advanced technology and a
              team dedicated to keeping your smile healthy and confident.
            </p>
            <div className="mt-8">
              <HeroCta />
            </div>
          </Reveal>
        </Container>

        <HeroVideoCard />
      </div>

      <div className="border-b border-black/5 bg-white py-6">
        <Container>
          <StaggerGroup className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {TRUST_BADGES.map((badge) => (
              <StaggerItem
                key={badge.id}
                className="flex items-center gap-2 text-sm text-ink-700"
              >
                <Check size={16} className="shrink-0 text-primary-600" />
                {badge.label}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </div>
    </section>
  );
}
