import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { BlogCard } from "@/components/shared/BlogCard";
import { fetchPublicBlogs, fetchPublicBlogBySlug } from "@/lib/publicBlogs";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await fetchPublicBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublicBlogBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Ishaani Dental Clinic`,
    description: post.excerpt,
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await fetchPublicBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await fetchPublicBlogs();
  const relatedPosts = allPosts
    .filter((p) => p._id !== post._id && p.category === post.category)
    .slice(0, 3);
  const fallbackRelated =
    relatedPosts.length > 0
      ? relatedPosts
      : allPosts.filter((p) => p._id !== post._id).slice(0, 3);

  return (
    <>
      <Section background="white" className="pt-28 pb-0 md:pt-32">
        <Reveal className="mx-auto max-w-3xl">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft size={16} />
            All Articles
          </Link>

          <Badge className="mt-6">{post.category}</Badge>
          <h1 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-ink-700">
            {post.author} · {formatDate(post.publishedAt)} · {post.readTime}
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-card shadow-card"
        >
          <div className="absolute inset-0 animate-[kenburns_16s_ease-in-out_infinite]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      </Section>

      <Section background="white" className="pt-8 pb-20 md:pt-10 md:pb-28">
        <Reveal className="mx-auto max-w-3xl">
          {post.sections.map((section, index) => (
            <div key={section.heading ?? index} className={index > 0 ? "mt-8" : ""}>
              {section.heading && (
                <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className={`text-base leading-relaxed text-ink-700 ${section.heading || pIndex > 0 ? "mt-4" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-base text-ink-700">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Reveal>
      </Section>

      {fallbackRelated.length > 0 && (
        <Section background="sage">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">
              More from the blog
            </h2>
          </Reveal>
          <StaggerGroup className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackRelated.map((related) => (
              <StaggerItem key={related._id} className="h-full">
                <BlogCard post={related} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>
      )}
    </>
  );
}
