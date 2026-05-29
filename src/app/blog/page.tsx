import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GradientText } from "@/components/ui/GradientText";
import { CTASection } from "@/components/sections/home/CTASection";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on web development, design, SEO, and digital marketing from The Web Start team.",
};

const posts = [
  {
    title: "10 Next.js Performance Optimizations for 2025",
    excerpt: "Boost your Next.js app's Core Web Vitals with these battle-tested techniques — from streaming SSR to advanced caching strategies.",
    tag: "Development",
    date: "May 2025",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    slug: "nextjs-performance-2025",
  },
  {
    title: "The Complete Guide to Glassmorphism UI in 2025",
    excerpt: "Everything you need to know to implement stunning glassmorphism effects that work across all browsers and devices.",
    tag: "Design",
    date: "Apr 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80",
    slug: "glassmorphism-guide-2025",
  },
  {
    title: "Why Your WordPress Site Is Slow (And How to Fix It)",
    excerpt: "Common causes of slow WordPress sites and actionable fixes — from caching and image optimization to server configuration.",
    tag: "WordPress",
    date: "Apr 2025",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop&q=80",
    slug: "wordpress-speed-optimization",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-8 text-center px-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">Insights & Articles</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white mb-4">
            The <GradientText>Blog</GradientText>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Practical insights on web development, design trends, and digital growth from our team.
          </p>
        </section>

        <section className="section-padding">
          <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="glass rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/15 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px)100vw,33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-full">{post.tag}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime} read</span>
                  </div>
                  <h2 className="font-display font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
