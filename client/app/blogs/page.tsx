import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { BlogsGrid } from "@/components/blog/BlogsGrid";
import { fetchPublicBlogs } from "@/lib/publicBlogs";

export const metadata: Metadata = {
  title: "Dental Health Articles | Ishaani Dental Clinic",
  description:
    "Patient education and dental health articles from Ishaani Dental Clinic — implants, root canals, cavity prevention, orthodontics, and more.",
};

export default async function BlogsPage() {
  const blogs = await fetchPublicBlogs();

  return (
    <>
      <PageHeader
        eyebrow="Our Blog"
        heading="Dental insights worth reading."
        description="Practical, patient-first guidance on treatments, prevention, and everyday oral care."
      />
      <Section background="white">
        <BlogsGrid blogs={blogs} />
      </Section>
    </>
  );
}
