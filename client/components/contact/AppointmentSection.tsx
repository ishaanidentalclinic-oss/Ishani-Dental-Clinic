import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { AppointmentForm } from "@/components/shared/AppointmentForm";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { fadeLeft, fadeRight } from "@/motion/variants";
import { APPOINTMENT_FAQS } from "@/constants/appointment-faqs";

export function AppointmentSection() {
  return (
    <Section id="appointment" background="white" className="scroll-mt-24">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal variants={fadeRight}>
          <Eyebrow>Schedule a Visit</Eyebrow>
          <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
            Book Your Appointment
          </h2>
          <div className="mt-8">
            <AppointmentForm />
          </div>
        </Reveal>

        <Reveal variants={fadeLeft} delay={0.1}>
          <Eyebrow>Good to Know</Eyebrow>
          <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
            Appointment questions.
          </h2>
          <FaqAccordion items={APPOINTMENT_FAQS} className="mx-0 mt-8 max-w-none" />
        </Reveal>
      </div>
    </Section>
  );
}
