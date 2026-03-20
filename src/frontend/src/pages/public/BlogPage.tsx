import { Badge } from "@/components/ui/badge";
import {
  PostStatus,
  useCreatePost,
  useGetPublishedPosts,
} from "@/hooks/useQueries";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Loader2,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  BLOG_POSTS,
  type StaticBlogPost as BlogPost,
} from "../../data/blogPosts";
const CATEGORIES = [
  "All",
  "Vision",
  "Technology",
  "Architecture",
  "Features",
  "Finance",
  "Design",
  "Roadmap",
  "Infrastructure",
  "Developer Guide",
  "History",
  "Growth",
  "Troubleshooting",
  "User Guide",
  "Release Notes",
  "FAQ",
  "Consumer Education",
  "Excel Users",
  "Google Sheets Users",
  "Platform Guide",
];

const CATEGORY_COLORS: Record<string, string> = {
  Vision: "oklch(0.52 0.13 185)",
  Technology: "oklch(0.55 0.15 260)",
  Architecture: "oklch(0.52 0.14 300)",
  Features: "oklch(0.50 0.15 140)",
  Finance: "oklch(0.55 0.14 60)",
  Design: "oklch(0.52 0.14 340)",
  Roadmap: "oklch(0.52 0.13 185)",
  Infrastructure: "oklch(0.50 0.12 220)",
  "Developer Guide": "oklch(0.52 0.15 30)",
  History: "oklch(0.52 0.12 200)",
  Growth: "oklch(0.50 0.14 80)",
  Troubleshooting: "oklch(0.52 0.14 15)",
  "User Guide": "oklch(0.48 0.16 160)",
  "Release Notes": "oklch(0.50 0.14 250)",
  FAQ: "oklch(0.52 0.14 270)",
  "Consumer Education": "oklch(0.50 0.15 100)",
  "Excel Users": "oklch(0.48 0.16 200)",
  "Google Sheets Users": "oklch(0.48 0.14 130)",
};

function PostCard({
  post,
  onClick,
}: {
  post: BlogPost;
  onClick: () => void;
}) {
  const color = CATEGORY_COLORS[post.category] ?? "oklch(0.52 0.13 185)";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="text-left w-full rounded-2xl p-6 border transition-shadow hover:shadow-lg"
      style={{
        background: "oklch(0.99 0.005 220)",
        borderColor: "oklch(0.90 0.012 220)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          {post.category}
        </span>
        <span
          className="text-xs flex items-center gap-1 flex-shrink-0"
          style={{ color: "oklch(0.58 0.018 240)" }}
        >
          <Clock className="w-3 h-3" />
          {post.readTime}
        </span>
      </div>
      <h2
        className="font-display font-bold text-lg mb-2 leading-snug"
        style={{ color: "oklch(0.18 0.065 240)" }}
      >
        {post.title}
      </h2>
      <p
        className="text-sm mb-4 leading-relaxed line-clamp-2"
        style={{ color: "oklch(0.42 0.018 240)" }}
      >
        {post.summary}
      </p>
      <div
        className="flex items-center gap-4 text-xs"
        style={{ color: "oklch(0.58 0.018 240)" }}
      >
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {post.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {post.date}
        </span>
      </div>
    </motion.button>
  );
}

function PostDetail({
  post,
  onBack,
}: {
  post: BlogPost;
  onBack: () => void;
}) {
  const color = CATEGORY_COLORS[post.category] ?? "oklch(0.52 0.13 185)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors"
        style={{ color: "oklch(0.52 0.13 185)" }}
      >
        <ChevronLeft className="w-4 h-4" />
        Back to all posts
      </button>

      <div
        className="rounded-2xl p-8 border"
        style={{
          background: "oklch(0.99 0.005 220)",
          borderColor: "oklch(0.90 0.012 220)",
        }}
      >
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: `${color}18`, color }}
        >
          {post.category}
        </span>

        <h1
          className="font-display font-bold text-2xl sm:text-3xl mb-4 leading-snug"
          style={{ color: "oklch(0.18 0.065 240)" }}
        >
          {post.title}
        </h1>

        <div
          className="flex flex-wrap items-center gap-4 text-xs mb-6 pb-6 border-b"
          style={{
            color: "oklch(0.58 0.018 240)",
            borderColor: "oklch(0.90 0.012 220)",
          }}
        >
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        <p
          className="text-base font-medium mb-6 leading-relaxed"
          style={{ color: "oklch(0.32 0.025 240)" }}
        >
          {post.summary}
        </p>

        <div className="space-y-4">
          {post.content.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.38 0.018 240)" }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SeedBlogPosts() {
  const { data: backendPosts, isFetched } = useGetPublishedPosts();
  const createPost = useCreatePost();
  const seeded = useRef(false);

  useEffect(() => {
    if (!isFetched || seeded.current) return;
    if (backendPosts && backendPosts.length === 0) {
      seeded.current = true;
      const mutateAsync = createPost.mutateAsync;
      (async () => {
        for (const post of BLOG_POSTS) {
          try {
            await mutateAsync({
              title: post.title,
              summary: post.summary,
              category: post.category,
              author: post.author,
              readTime: post.readTime,
              status: PostStatus.published,
              content: post.content,
            });
          } catch {
            // ignore individual failures
          }
        }
      })();
    }
  }, [isFetched, backendPosts, createPost.mutateAsync]);

  return null;
}

function toLocalPost(bp: {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  readTime: string;
  content: string[];
  createdAt: bigint;
}): BlogPost {
  const ms = Number(bp.createdAt / 1_000_000n);
  const date =
    ms > 0
      ? new Date(ms).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  return {
    id: bp.id,
    title: bp.title,
    summary: bp.summary,
    category: bp.category,
    author: bp.author,
    readTime: bp.readTime,
    content: bp.content,
    date,
  };
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { data: backendPosts, isLoading } = useGetPublishedPosts();

  const posts: BlogPost[] =
    backendPosts && backendPosts.length > 0
      ? backendPosts.map(toLocalPost)
      : BLOG_POSTS;

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  if (selectedPost) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SeedBlogPosts />
        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeedBlogPosts />
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading posts...
        </div>
      )}
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <BookOpen
            className="w-6 h-6"
            style={{ color: "oklch(0.52 0.13 185)" }}
          />
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.52 0.13 185)" }}
          >
            Development Blog
          </span>
        </div>
        <h1
          className="font-display font-bold text-3xl sm:text-4xl mb-3"
          style={{ color: "oklch(0.18 0.065 240)" }}
        >
          Building Jagdish PMS
        </h1>
        <p
          className="text-base max-w-2xl leading-relaxed"
          style={{ color: "oklch(0.42 0.018 240)" }}
        >
          The complete development story — vision, architecture, features, and
          the roadmap ahead. Written as a handover reference for anyone joining
          or taking charge of this project.
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background:
                activeCategory === cat
                  ? "oklch(0.52 0.13 185)"
                  : "oklch(0.93 0.01 220)",
              color: activeCategory === cat ? "white" : "oklch(0.42 0.018 240)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <div
        className="flex items-center gap-1.5 text-xs mb-6"
        style={{ color: "oklch(0.58 0.018 240)" }}
      >
        <Tag className="w-3 h-3" />
        {filtered.length} post{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => {
              setSelectedPost(post);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ))}
      </div>
    </section>
  );
}
