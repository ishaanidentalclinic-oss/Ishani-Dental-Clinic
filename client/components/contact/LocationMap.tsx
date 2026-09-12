import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { fadeScale } from "@/motion/variants";
import { fetchPublicSiteSettings } from "@/lib/publicSettings";
import { SITE } from "@/constants/site";

export async function LocationMap() {
  const settings = await fetchPublicSiteSettings();
  const address = settings?.contact.address || SITE.address;

  return (
    <Section background="white">
      <Reveal
        variants={fadeScale}
        className="mx-auto h-80 w-full max-w-5xl overflow-hidden rounded-card shadow-card md:h-[440px]"
      >
        <iframe
          title="Ishaani Dental Clinic location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>
    </Section>
  );
}
