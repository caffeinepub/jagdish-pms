import { Badge } from "@/components/ui/badge";
import {
  PostStatus,
  useCreatePost,
  useGetAllCategories,
  useGetAllTags,
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

const FALLBACK_CATEGORIES = [
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
  "Version Guide",
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
  "Version Guide": "oklch(0.50 0.18 45)",
  "Platform Guide": "oklch(0.50 0.14 290)",
};

function getCategoryColor(categories: string[]): string {
  for (const cat of categories) {
    if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  }
  return "oklch(0.52 0.13 185)";
}

function PostCard({
  post,
  onClick,
}: {
  post: BlogPost;
  onClick: () => void;
}) {
  const color = getCategoryColor(post.categories);
  const tags = post.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const extraTags = tags.length - visibleTags.length;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="text-left w-full rounded-2xl p-6 border transition-shadow hover:shadow-lg flex flex-col"
      style={{
        background: "oklch(0.99 0.005 220)",
        borderColor: "oklch(0.90 0.012 220)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-1">
          {post.categories.map((cat) => {
            const catColor = CATEGORY_COLORS[cat] ?? color;
            return (
              <span
                key={cat}
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: `${catColor}18`,
                  color: catColor,
                }}
              >
                {cat}
              </span>
            );
          })}
        </div>
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
        className="text-sm mb-4 leading-relaxed line-clamp-2 flex-1"
        style={{ color: "oklch(0.42 0.018 240)" }}
      >
        {post.summary}
      </p>
      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs border"
              style={{
                borderColor: "oklch(0.75 0.06 185)",
                color: "oklch(0.42 0.10 185)",
                background: "oklch(0.96 0.02 185)",
              }}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border"
              style={{
                borderColor: "oklch(0.85 0.01 220)",
                color: "oklch(0.58 0.018 240)",
                background: "oklch(0.96 0.005 220)",
              }}
            >
              +{extraTags} more
            </span>
          )}
        </div>
      )}
      <div
        className="flex items-center gap-4 text-xs mt-auto"
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
  const color = getCategoryColor(post.categories);
  const tags = post.tags ?? [];

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
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {post.categories.map((cat) => {
            const catColor = CATEGORY_COLORS[cat] ?? color;
            return (
              <span
                key={cat}
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: `${catColor}18`, color: catColor }}
              >
                {cat}
              </span>
            );
          })}
        </div>

        <h1
          className="font-display font-bold text-2xl sm:text-3xl mb-4 leading-snug"
          style={{ color: "oklch(0.18 0.065 240)" }}
        >
          {post.title}
        </h1>

        {/* Tags below title */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border font-medium"
                style={{
                  borderColor: "oklch(0.75 0.06 185)",
                  color: "oklch(0.38 0.12 185)",
                  background: "oklch(0.96 0.02 185)",
                }}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

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
    const existingTitles = new Set((backendPosts ?? []).map((p) => p.title));
    const missing = BLOG_POSTS.filter((p) => !existingTitles.has(p.title));
    if (missing.length === 0) return;
    seeded.current = true;
    const mutateAsync = createPost.mutateAsync;
    (async () => {
      for (const post of missing) {
        try {
          await mutateAsync({
            title: post.title,
            summary: post.summary,
            categories: post.categories,
            tags: post.tags ?? [],
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
  }, [isFetched, backendPosts, createPost.mutateAsync]);

  return null;
}

function toLocalPost(bp: {
  id: string;
  title: string;
  summary: string;
  categories: string[];
  tags: string[];
  author: string;
  readTime: string;
  content: string[];
  createdAt: bigint;
}): BlogPost {
  const ms = Number(bp.createdAt / 1_000_000n);
  const date =
    ms > 0
      ? new Date(ms).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  return {
    id: bp.id,
    title: bp.title,
    summary: bp.summary,
    categories: bp.categories,
    tags: bp.tags,
    author: bp.author,
    readTime: bp.readTime,
    content: bp.content,
    date,
  };
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { data: backendPosts, isLoading } = useGetPublishedPosts();
  const { data: backendCategories } = useGetAllCategories();
  const { data: backendTags } = useGetAllTags();

  const categories = backendCategories
    ? ["All", ...backendCategories.filter((c) => c !== "Static Page")]
    : FALLBACK_CATEGORIES;

  const posts: BlogPost[] =
    backendPosts && backendPosts.length > 0
      ? backendPosts
          .filter((p) => !p.categories.includes("Static Page"))
          .map(toLocalPost)
      : BLOG_POSTS;

  const categoryFiltered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.categories.includes(activeCategory));

  const filtered = activeTag
    ? categoryFiltered.filter((p) => (p.tags ?? []).includes(activeTag))
    : categoryFiltered;

  // Tags present in current category-filtered results
  const availableTags = backendTags
    ? backendTags.filter((tag) =>
        categoryFiltered.some((p) => (p.tags ?? []).includes(tag)),
      )
    : [];

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveTag(null);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

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
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            data-ocid="blog.category.tab"
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

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              data-ocid="blog.tag.toggle"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border"
              style={{
                background:
                  activeTag === tag ? "oklch(0.50 0.13 185)" : "transparent",
                color: activeTag === tag ? "white" : "oklch(0.42 0.10 185)",
                borderColor:
                  activeTag === tag
                    ? "oklch(0.50 0.13 185)"
                    : "oklch(0.75 0.06 185)",
              }}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <div
        className="flex items-center gap-1.5 text-xs mb-6"
        style={{ color: "oklch(0.58 0.018 240)" }}
      >
        <Tag className="w-3 h-3" />
        {filtered.length} post{filtered.length !== 1 ? "s" : ""}
        {activeTag && (
          <span className="ml-1">
            tagged <strong>{activeTag}</strong>{" "}
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="underline ml-0.5"
            >
              (clear)
            </button>
          </span>
        )}
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
