import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { OurApproach } from "@/components/about/OurApproach";
import { OurPromise } from "@/components/about/OurPromise";
import { Doctors } from "@/components/home/Doctors";

export const metadata: Metadata = {
  title: "About Us | Ishaani Dental Clinic",
  description:
    "Meet the specialists behind Ishaani Dental Clinic — Advanced Implant and Laser Center, and learn about our prevention-first approach to dental care.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <Doctors />
      <OurApproach />
      <OurPromise />
    </>
  );
}
