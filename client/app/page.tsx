import { Hero } from "@/components/home/Hero";
import { Treatments } from "@/components/home/Treatments";
import { Technology } from "@/components/home/Technology";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { Testimonials } from "@/components/home/Testimonials";
import { Blogs } from "@/components/home/Blogs";
import { Faq } from "@/components/home/Faq";
import { ClosingCta } from "@/components/home/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Treatments />
      <Technology />
      <BeforeAfter />
      <Testimonials />
      <Blogs />
      <Faq />
      <ClosingCta />
    </>
  );
}
