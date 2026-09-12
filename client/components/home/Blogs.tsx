import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { BlogCard } from "@/components/shared/BlogCard";
import { fetchPublicBlogs } from "@/lib/publicBlogs";

export async function Blogs() {
  const blogPosts = await fetchPublicBlogs();

  return (
    <Section background="white">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <Eyebrow>From the Blog</Eyebrow>
        <h2 className="text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Dental insights worth reading.
        </h2>
      </Reveal>

      <Reveal delay={0.15} className="mt-14 -mx-6 md:-mx-8 lg:-mx-12">
        <Marquee speed={28} className="px-6 py-2 md:px-8 lg:px-12">
          {blogPosts.map((post) => (
            <div key={post._id} className="w-[300px] shrink-0 sm:w-[340px]">
              <BlogCard post={post} />
            </div>
          ))}
        </Marquee>
      </Reveal>

      <Reveal className="mt-10 text-center">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          View All Articles
          <ArrowRight size={16} />
        </Link>
      </Reveal>
    </Section>
  );
}
