"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { PublicBlog } from "@/types/blog";

const EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 24px rgb(11 44 38 / 0.06)",
    borderColor: "rgba(157, 216, 192, 0)",
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 42px rgb(11 44 38 / 0.16)",
    borderColor: "rgba(157, 216, 192, 1)",
    transition: { duration: 0.6, ease: EASE },
  },
};

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.7, ease: EASE } },
};

const readMoreVariants: Variants = {
  rest: { opacity: 0.6, x: 0 },
  hover: { opacity: 1, x: 3, transition: { duration: 0.35, ease: EASE, delay: 0.08 } },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: PublicBlog }) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest" className="h-full">
      <Link href={`/blogs/${post.slug}`} className="block h-full">
        <motion.div
          variants={cardVariants}
          className="flex h-full flex-col overflow-hidden rounded-card border bg-white"
        >
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <motion.div variants={imageVariants} className="absolute inset-0">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </motion.div>
            <Badge className="absolute top-3 left-3 bg-white/90">{post.category}</Badge>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs text-ink-700">
              {formatDate(post.publishedAt)} · {post.readTime}
            </p>
            <h3 className="mt-2 text-base font-semibold text-ink-900">{post.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-700">
              {post.excerpt}
            </p>
            <motion.span
              variants={readMoreVariants}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700"
            >
              Read More
              <ArrowRight size={14} />
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
