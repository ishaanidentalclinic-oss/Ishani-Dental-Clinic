import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { getWhatsappLink } from "@/lib/whatsapp";
import { fetchPublicSiteSettings } from "@/lib/publicSettings";
import { SITE } from "@/constants/site";

export async function ClinicInfo() {
  const settings = await fetchPublicSiteSettings();

  const address = settings?.contact.address || SITE.address;
  const phone = settings?.contact.phone || SITE.phone;
  const email = settings?.contact.email || SITE.email;
  const whatsappNumber = settings?.contact.whatsappNumber || SITE.whatsappNumber;
  const hours = settings?.businessHours || SITE.workingHours;

  const CONTACT_ITEMS = [
    { id: "address", icon: MapPin, label: "Address", value: address, href: undefined },
    { id: "phone", icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    { id: "email", icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    {
      id: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      value: phone,
      href: getWhatsappLink("Hi, I'd like to get in touch.", whatsappNumber),
    },
    { id: "hours", icon: Clock3, label: "Working Hours", value: hours, href: undefined },
  ] as const;

  return (
    <Section id="contact" background="sage">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Visit Us</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Find us in Pune.
        </h2>
      </Reveal>

      <StaggerGroup className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_ITEMS.map((item) => (
          <StaggerItem key={item.id}>
            <Card className="flex h-full items-start gap-4 p-6">
              <IconBox>
                <item.icon size={20} />
              </IconBox>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-700">{item.label}</p>
                {item.href ? (
                  <Link
                    href={item.href}
                    target={item.id === "whatsapp" ? "_blank" : undefined}
                    rel={item.id === "whatsapp" ? "noopener noreferrer" : undefined}
                    className="font-medium break-words text-ink-900 hover:text-primary-700"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className="font-medium break-words text-ink-900">{item.value}</p>
                )}
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
