import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { fadeRight } from "@/motion/variants";
import { ABOUT_CONTENT } from "@/constants/about";

export function OurStory() {
  return (
    <Section id="about" background="sage">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="text-2xl leading-tight font-semibold text-ink-900 sm:text-3xl">
            {ABOUT_CONTENT.heading}
          </h2>
          <div className="mt-6 space-y-4">
            {ABOUT_CONTENT.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-ink-700">
                {paragraph}
              </p>
            ))}
          </div>

          <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 border-t border-black/10 pt-8 sm:grid-cols-3 sm:gap-6">
            {ABOUT_CONTENT.stats.map((stat) => (
              <StaggerItem key={stat.id} className="flex items-baseline gap-3 sm:block sm:gap-0">
                <p className="font-serif text-3xl font-semibold text-primary-700">
                  {stat.value}
                </p>
                <p className="text-sm text-ink-700 sm:mt-1">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>

        <Reveal variants={fadeRight} className="group relative">
          <div className="relative mx-auto aspect-3/4 w-full max-w-sm overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/about/our-story.jpg"
              alt="A dentist showing a patient a dental model during a warm consultation"
              fill
              sizes="(min-width: 1024px) 384px, 80vw"
              className="object-cover transition-transform duration-700 ease-(--ease-premium) group-hover:scale-[1.05]"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
