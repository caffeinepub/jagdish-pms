import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/hooks/useQueries";
import {
  PostStatus,
  useAddCategory,
  useAddTag,
  useAdminRescheduleAllPosts,
  useCreatePost,
  useDeleteCategory,
  useDeletePost,
  useDeleteTag,
  useGetAllCategories,
  useGetAllPosts,
  useGetAllTags,
  useGetPageContent,
  useSavePageContent,
  useUpdatePost,
  useUpdatePostSchedule,
} from "@/hooks/useQueries";
import {
  CalendarClock,
  Clock,
  Edit2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  HardDrive,
  Loader2,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DataExportTab } from "../components/DataExportTab";
import { BLOG_POSTS } from "../data/blogPosts";

const FALLBACK_BLOG_CATEGORIES = [
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

type StatusFilter = "all" | "published" | "scheduled" | "draft" | "private";

function statusLabel(status: PostStatus): string {
  if (status === PostStatus.published) return "Published";
  if (status === PostStatus.draft) return "Draft";
  return "Private";
}

// Convert nanoseconds bigint → JS Date
function nsToDate(ns: bigint): Date {
  return new Date(Number(ns / 1_000_000n));
}

// Convert JS Date → nanoseconds bigint
function dateToNs(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

function isScheduledInFuture(scheduledAt?: bigint): boolean {
  if (!scheduledAt) return false;
  return scheduledAt > BigInt(Date.now()) * 1_000_000n;
}

function formatScheduledDate(ns: bigint): string {
  return nsToDate(ns).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({
  status,
  scheduledAt,
}: { status: PostStatus; scheduledAt?: bigint }) {
  if (status === PostStatus.draft) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
        Draft
      </Badge>
    );
  }
  if (status === PostStatus.privateVisibility) {
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
        Private
      </Badge>
    );
  }
  // Published
  if (isScheduledInFuture(scheduledAt)) {
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 gap-1">
        <CalendarClock className="w-3 h-3" />
        Scheduled: {formatScheduledDate(scheduledAt!)}
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
      Live
    </Badge>
  );
}

interface PostFormData {
  title: string;
  summary: string;
  categories: string[];
  tags: string[];
  author: string;
  readTime: string;
  status: PostStatus;
  content: string[];
}

const DEFAULT_FORM: PostFormData = {
  title: "",
  summary: "",
  categories: [],
  tags: [],
  author: "Jagdish",
  readTime: "5 min read",
  status: PostStatus.draft,
  content: [""],
};

function PostForm({
  initial,
  onSave,
  onCancel,
  isSaving,
  availableCategories,
  availableTags,
}: {
  initial: PostFormData;
  onSave: (data: PostFormData) => void;
  onCancel: () => void;
  isSaving: boolean;
  availableCategories: string[];
  availableTags: string[];
}) {
  const [form, setForm] = useState<PostFormData>(initial);
  const paraKeys = Array.from({ length: 20 }, (_, i) => i);

  const set = (
    field: keyof PostFormData,
    value: string | PostStatus | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const updateParagraph = (index: number, value: string) => {
    const updated = [...form.content];
    updated[index] = value;
    setForm((prev) => ({ ...prev, content: updated }));
  };

  const addParagraph = () => {
    setForm((prev) => ({ ...prev, content: [...prev.content, ""] }));
  };

  const removeParagraph = (index: number) => {
    if (form.content.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.summary.trim()) {
      toast.error("Summary is required");
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
      <div className="flex-1 overflow-y-auto pr-1 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="post-title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="post-title"
            data-ocid="blog_admin.title.input"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Enter post title..."
            className="text-sm"
          />
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <Label htmlFor="post-summary" className="text-sm font-medium">
            Summary <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="post-summary"
            data-ocid="blog_admin.summary.textarea"
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
            placeholder="Brief description of the post..."
            rows={3}
            className="text-sm resize-none"
          />
        </div>

        {/* Categories multi-select */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Categories{" "}
            <span className="text-xs text-muted-foreground font-normal">
              (select one or more)
            </span>
          </Label>
          <div
            className="border border-border rounded-md overflow-y-auto max-h-36 p-2 flex flex-wrap gap-1.5"
            data-ocid="blog_admin.categories.select"
          >
            {availableCategories.map((cat) => {
              const active = form.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all border"
                  style={{
                    background: active ? "oklch(0.35 0.10 240)" : "transparent",
                    color: active ? "white" : "oklch(0.42 0.018 240)",
                    borderColor: active
                      ? "oklch(0.35 0.10 240)"
                      : "oklch(0.85 0.01 220)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags multi-select */}
        {availableTags.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Tags{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (select any)
              </span>
            </Label>
            <div
              className="border border-border rounded-md overflow-y-auto max-h-28 p-2 flex flex-wrap gap-1.5"
              data-ocid="blog_admin.tags.select"
            >
              {availableTags.map((tag) => {
                const active = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-all border"
                    style={{
                      background: active
                        ? "oklch(0.50 0.13 185)"
                        : "transparent",
                      color: active ? "white" : "oklch(0.42 0.018 240)",
                      borderColor: active
                        ? "oklch(0.50 0.13 185)"
                        : "oklch(0.85 0.01 220)",
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => set("status", v as PostStatus)}
          >
            <SelectTrigger
              data-ocid="blog_admin.status.select"
              className="text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PostStatus.draft}>Draft</SelectItem>
              <SelectItem value={PostStatus.published}>Published</SelectItem>
              <SelectItem value={PostStatus.privateVisibility}>
                Private
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row: Author + Read Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="post-author" className="text-sm font-medium">
              Author
            </Label>
            <Input
              id="post-author"
              data-ocid="blog_admin.author.input"
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Author name"
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-readtime" className="text-sm font-medium">
              Read Time
            </Label>
            <Input
              id="post-readtime"
              data-ocid="blog_admin.readtime.input"
              value={form.readTime}
              onChange={(e) => set("readTime", e.target.value)}
              placeholder="e.g. 5 min read"
              className="text-sm"
            />
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Content Paragraphs</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addParagraph}
              data-ocid="blog_admin.add_paragraph.button"
              className="text-xs h-7"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Paragraph
            </Button>
          </div>
          <div className="space-y-3">
            {form.content.map((para, i) => (
              <div key={paraKeys[i]} className="relative group">
                <Textarea
                  value={para}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  placeholder={`Paragraph ${i + 1}...`}
                  rows={4}
                  className="text-sm resize-none pr-8"
                  data-ocid={`blog_admin.paragraph.input.${i + 1}`}
                />
                {form.content.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="blog_admin.cancel.button"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          data-ocid="blog_admin.save.button"
          className="flex-1"
          style={{ background: "oklch(0.35 0.10 240)", color: "white" }}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Post"
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Schedule Date Cell ───────────────────────────────────────────────────────

function ScheduleDateCell({ post }: { post: BlogPost }) {
  const updateSchedule = useUpdatePostSchedule();

  // Convert current scheduledAt to YYYY-MM-DD for <input type="date">
  const toInputValue = (ns?: bigint): string => {
    if (!ns) return "";
    const d = nsToDate(ns);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [dateVal, setDateVal] = useState(toInputValue(post.scheduledAt));

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateVal(val);
    try {
      const ns = val ? dateToNs(new Date(val)) : null;
      await updateSchedule.mutateAsync({ postId: post.id, scheduledAt: ns });
      toast.success(val ? "Schedule updated" : "Schedule cleared");
    } catch {
      toast.error("Failed to update schedule");
    }
  };

  return (
    <input
      type="date"
      value={dateVal}
      onChange={handleChange}
      data-ocid="blog_admin.schedule.input"
      className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      style={{ minWidth: "130px" }}
    />
  );
}

// ─── Page Editor ─────────────────────────────────────────────────────────────

const PAGE_DEFAULTS: Record<string, { title: string; content: string[] }> = {
  "page-about": {
    title: "About Us",
    content: [
      "Jagdish PMS is a personal project built to simplify mutual fund portfolio tracking for Indian investors. We believe every investor deserves a professional-grade tool without the complexity of spreadsheets or the cost of financial advisors.",
      "Founded by Jagdish, this project was born out of frustration with existing solutions — maintaining Excel sheets, updating NAVs manually, calculating capital gains at tax time. There had to be a better way.",
      "Our mission is to empower every Indian mutual fund investor with clear, accurate, and real-time visibility into their portfolio — from a simple SIP to a complex multi-fund, multi-AMC portfolio.",
    ],
  },
  "page-contact": {
    title: "Contact Us",
    content: [
      "We'd love to hear from you. Whether you have a question about the app, found a bug, or have a feature request — reach out and we'll do our best to help.",
      "We typically respond within 1–2 business days.",
      "Email: midja85@gmail.com",
    ],
  },
};

function PageEditorSheet({
  slug,
  label,
  open,
  onOpenChange,
}: {
  slug: string;
  label: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data: existing, isLoading } = useGetPageContent(slug);
  const savePage = useSavePageContent();

  const defaults = PAGE_DEFAULTS[slug];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!open) {
      initialized.current = false;
      return;
    }
    if (initialized.current) return;
    if (isLoading) return;
    initialized.current = true;
    if (existing) {
      setTitle(existing.title);
      setContent(
        existing.content.length > 0 ? existing.content : defaults.content,
      );
    } else {
      setTitle(defaults.title);
      setContent([...defaults.content]);
    }
  }, [open, isLoading, existing, defaults]);

  const updateParagraph = (i: number, val: string) => {
    setContent((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const addParagraph = () => setContent((prev) => [...prev, ""]);

  const removeParagraph = (i: number) => {
    if (content.length <= 1) return;
    setContent((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      await savePage.mutateAsync({
        slug,
        title,
        content: content.filter((p) => p.trim() !== ""),
        existingId: existing?.id,
      });
      toast.success(`${label} page saved`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to save page");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-6"
        data-ocid="pages_admin.editor.sheet"
      >
        <SheetHeader className="shrink-0 mb-4">
          <SheetTitle>Edit: {label}</SheetTitle>
          <SheetDescription>
            Update the content for the {label} public page.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div
            className="flex items-center justify-center flex-1 gap-2 text-sm text-muted-foreground"
            data-ocid="pages_admin.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-5 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Page Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  data-ocid="pages_admin.title.input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page title"
                  className="text-sm"
                />
              </div>

              {/* Content Paragraphs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Content Paragraphs
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addParagraph}
                    data-ocid="pages_admin.add_paragraph.button"
                    className="text-xs h-7"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Paragraph
                  </Button>
                </div>
                <div className="space-y-3">
                  {content.map((para, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: paragraph order is meaningful
                    <div key={i} className="relative group">
                      <Textarea
                        value={para}
                        onChange={(e) => updateParagraph(i, e.target.value)}
                        placeholder={`Paragraph ${i + 1}...`}
                        rows={4}
                        className="text-sm resize-none pr-8"
                        data-ocid={`pages_admin.paragraph.input.${i + 1}`}
                      />
                      {content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(i)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-ocid="pages_admin.cancel.button"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={savePage.isPending}
                data-ocid="pages_admin.save.button"
                className="flex-1"
                style={{ background: "oklch(0.35 0.10 240)", color: "white" }}
              >
                {savePage.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Page"
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const STATIC_PAGES = [
  { slug: "page-about", label: "About Us" },
  { slug: "page-contact", label: "Contact Us" },
];

function PagesTab() {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Edit the content for your public static pages. Changes are published
        immediately.
      </p>

      <div className="grid gap-3">
        {STATIC_PAGES.map((pg) => (
          <div
            key={pg.slug}
            className="flex items-center justify-between rounded-xl border border-border p-4"
            style={{ background: "oklch(0.99 0.004 220)" }}
            data-ocid={`pages_admin.${pg.slug}.card`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.35 0.10 240 / 0.10)" }}
              >
                <Globe
                  className="w-4 h-4"
                  style={{ color: "oklch(0.35 0.10 240)" }}
                />
              </div>
              <div>
                <p
                  className="font-medium text-sm"
                  style={{ color: "oklch(0.20 0.065 240)" }}
                >
                  {pg.label}
                </p>
                <p className="text-xs text-muted-foreground">Public page</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingSlug(pg.slug)}
              data-ocid={`pages_admin.${pg.slug}.edit_button`}
              className="gap-1.5 text-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        ))}
      </div>

      {STATIC_PAGES.map((pg) => (
        <PageEditorSheet
          key={pg.slug}
          slug={pg.slug}
          label={pg.label}
          open={editingSlug === pg.slug}
          onOpenChange={(v) => {
            if (!v) setEditingSlug(null);
          }}
        />
      ))}
    </div>
  );
}

// ─── Main BlogAdmin Component ─────────────────────────────────────────────────

// ─── Tags & Categories Tab ───────────────────────────────────────────────────

function TagsCategoriesTab() {
  const { data: categories = [], isLoading: catsLoading } =
    useGetAllCategories();
  const { data: tags = [], isLoading: tagsLoading } = useGetAllTags();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const addTag = useAddTag();
  const deleteTag = useDeleteTag();

  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleAddCategory = async () => {
    const val = newCategory.trim();
    if (!val) return;
    try {
      await addCategory.mutateAsync(val);
      setNewCategory("");
      toast.success(`Category "${val}" added`);
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    try {
      await deleteCategory.mutateAsync(cat);
      toast.success(`Category "${cat}" deleted`);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleAddTag = async () => {
    const val = newTag.trim();
    if (!val) return;
    try {
      await addTag.mutateAsync(val);
      setNewTag("");
      toast.success(`Tag "${val}" added`);
    } catch {
      toast.error("Failed to add tag");
    }
  };

  const handleDeleteTag = async (tag: string) => {
    try {
      await deleteTag.mutateAsync(tag);
      toast.success(`Tag "${tag}" deleted`);
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Categories */}
      <div
        className="rounded-xl border border-border p-5 space-y-4"
        style={{ background: "oklch(0.99 0.004 220)" }}
        data-ocid="tags_categories.categories.panel"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.35 0.10 240 / 0.10)" }}
          >
            <Globe
              className="w-4 h-4"
              style={{ color: "oklch(0.35 0.10 240)" }}
            />
          </div>
          <div>
            <h3
              className="font-semibold text-sm"
              style={{ color: "oklch(0.18 0.065 240)" }}
            >
              Categories
            </h3>
            <p className="text-xs text-muted-foreground">
              Predefined list for blog posts
            </p>
          </div>
        </div>

        {catsLoading ? (
          <div
            className="flex items-center gap-2 py-4 text-sm text-muted-foreground"
            data-ocid="tags_categories.categories.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading categories...
          </div>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {categories.length === 0 ? (
              <p
                className="text-xs text-muted-foreground py-4 text-center"
                data-ocid="tags_categories.categories.empty_state"
              >
                No categories yet. Add one below.
              </p>
            ) : (
              categories.map((cat, idx) => (
                <div
                  key={cat}
                  data-ocid={`tags_categories.category.item.${idx + 1}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 group"
                  style={{ background: "oklch(0.965 0.008 220)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.25 0.05 240)" }}
                  >
                    {cat}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    disabled={deleteCategory.isPending}
                    data-ocid={`tags_categories.category.delete_button.${idx + 1}`}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all"
                    title={`Delete "${cat}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add category */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            placeholder="New category name..."
            className="text-sm h-8"
            data-ocid="tags_categories.category.input"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddCategory}
            disabled={addCategory.isPending || !newCategory.trim()}
            data-ocid="tags_categories.category.primary_button"
            className="h-8 px-3 shrink-0"
            style={{ background: "oklch(0.35 0.10 240)", color: "white" }}
          >
            {addCategory.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div
        className="rounded-xl border border-border p-5 space-y-4"
        style={{ background: "oklch(0.99 0.004 220)" }}
        data-ocid="tags_categories.tags.panel"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.50 0.13 185 / 0.10)" }}
          >
            <Tag
              className="w-4 h-4"
              style={{ color: "oklch(0.50 0.13 185)" }}
            />
          </div>
          <div>
            <h3
              className="font-semibold text-sm"
              style={{ color: "oklch(0.18 0.065 240)" }}
            >
              Tags
            </h3>
            <p className="text-xs text-muted-foreground">
              Clickable filter labels for posts
            </p>
          </div>
        </div>

        {tagsLoading ? (
          <div
            className="flex items-center gap-2 py-4 text-sm text-muted-foreground"
            data-ocid="tags_categories.tags.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading tags...
          </div>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {tags.length === 0 ? (
              <p
                className="text-xs text-muted-foreground py-4 text-center"
                data-ocid="tags_categories.tags.empty_state"
              >
                No tags yet. Add one below.
              </p>
            ) : (
              tags.map((tag, idx) => (
                <div
                  key={tag}
                  data-ocid={`tags_categories.tag.item.${idx + 1}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 group"
                  style={{ background: "oklch(0.965 0.008 220)" }}
                >
                  <span className="text-sm flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    <span style={{ color: "oklch(0.25 0.05 240)" }}>{tag}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(tag)}
                    disabled={deleteTag.isPending}
                    data-ocid={`tags_categories.tag.delete_button.${idx + 1}`}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all"
                    title={`Delete "${tag}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add tag */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="New tag name..."
            className="text-sm h-8"
            data-ocid="tags_categories.tag.input"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddTag}
            disabled={addTag.isPending || !newTag.trim()}
            data-ocid="tags_categories.tag.primary_button"
            className="h-8 px-3 shrink-0"
            style={{ background: "oklch(0.50 0.13 185)", color: "white" }}
          >
            {addTag.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BlogAdmin() {
  const { data: posts = [], isLoading, isFetched } = useGetAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const rescheduleAll = useAdminRescheduleAllPosts();

  const [adminTab, setAdminTab] = useState<
    "posts" | "pages" | "data-export" | "tags-categories"
  >("posts");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!isFetched || seededRef.current) return;
    const existingTitles = new Set(posts.map((p) => p.title));
    const missing = BLOG_POSTS.filter((p) => !existingTitles.has(p.title));
    if (missing.length === 0) return;
    seededRef.current = true;
    setIsSeeding(true);
    const seed = async () => {
      let count = 0;
      for (const post of missing) {
        try {
          await createPost.mutateAsync({
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
        count++;
        setSeedProgress(count);
      }
      setIsSeeding(false);
    };
    seed();
  }, [isFetched, posts, createPost.mutateAsync]);

  // Filter out static pages from blog post list
  const blogPosts = posts.filter((p) => !p.categories.includes("Static Page"));

  const filteredPosts = blogPosts.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "published")
      return (
        p.status === PostStatus.published && !isScheduledInFuture(p.scheduledAt)
      );
    if (statusFilter === "scheduled")
      return (
        p.status === PostStatus.published && isScheduledInFuture(p.scheduledAt)
      );
    if (statusFilter === "draft") return p.status === PostStatus.draft;
    if (statusFilter === "private")
      return p.status === PostStatus.privateVisibility;
    return true;
  });

  const counts = {
    all: blogPosts.length,
    published: blogPosts.filter(
      (p) =>
        p.status === PostStatus.published &&
        !isScheduledInFuture(p.scheduledAt),
    ).length,
    scheduled: blogPosts.filter(
      (p) =>
        p.status === PostStatus.published && isScheduledInFuture(p.scheduledAt),
    ).length,
    draft: blogPosts.filter((p) => p.status === PostStatus.draft).length,
    private: blogPosts.filter((p) => p.status === PostStatus.privateVisibility)
      .length,
  };

  const openNew = () => {
    setEditingPost(null);
    setSheetOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setSheetOpen(true);
  };

  const handleSave = async (data: PostFormData) => {
    try {
      if (editingPost) {
        const input: UpdateBlogPostInput = {
          id: editingPost.id,
          title: data.title,
          summary: data.summary,
          categories: data.categories,
          tags: data.tags,
          author: data.author,
          readTime: data.readTime,
          status: data.status,
          content: data.content.filter((p) => p.trim() !== ""),
        };
        await updatePost.mutateAsync(input);
        toast.success("Post updated successfully");
      } else {
        const input: CreateBlogPostInput = {
          title: data.title,
          summary: data.summary,
          categories: data.categories,
          tags: data.tags,
          author: data.author,
          readTime: data.readTime,
          status: data.status,
          content: data.content.filter((p) => p.trim() !== ""),
        };
        await createPost.mutateAsync(input);
        toast.success("Post created successfully");
      }
      setSheetOpen(false);
    } catch {
      toast.error("Failed to save post");
    }
  };

  const handleQuickStatus = async (post: BlogPost, status: PostStatus) => {
    try {
      await updatePost.mutateAsync({
        id: post.id,
        title: post.title,
        summary: post.summary,
        categories: post.categories,
        tags: post.tags,
        author: post.author,
        readTime: post.readTime,
        status,
        content: post.content,
      });
      toast.success(`Post ${statusLabel(status).toLowerCase()}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePost.mutateAsync(deleteTarget.id);
      toast.success("Post deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleRescheduleAll = async () => {
    try {
      await rescheduleAll.mutateAsync();
      toast.success(
        "All posts rescheduled — oldest post today, one every 2 days",
      );
      setRescheduleDialogOpen(false);
    } catch {
      toast.error("Failed to reschedule posts");
    }
  };

  const { data: allCategories = FALLBACK_BLOG_CATEGORIES } =
    useGetAllCategories();
  const { data: allTags = [] } = useGetAllTags();

  const formInitial: PostFormData = editingPost
    ? {
        title: editingPost.title,
        summary: editingPost.summary,
        categories: editingPost.categories,
        tags: editingPost.tags,
        author: editingPost.author,
        readTime: editingPost.readTime,
        status: editingPost.status,
        content: editingPost.content.length > 0 ? editingPost.content : [""],
      }
    : DEFAULT_FORM;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "oklch(0.18 0.065 240)" }}
          >
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage blog posts and static pages
          </p>
        </div>
        {adminTab === "posts" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(true)}
              data-ocid="blog_admin.reschedule_all.button"
              className="gap-2 text-sm"
            >
              <CalendarClock className="w-4 h-4" />
              Reschedule All
            </Button>
            <Button
              onClick={openNew}
              data-ocid="blog_admin.new_post.button"
              className="gap-2"
              style={{ background: "oklch(0.35 0.10 240)", color: "white" }}
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>
        )}
      </motion.div>

      {/* Top-level tab: Blog Posts vs Pages */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.04 }}
      >
        <Tabs
          value={adminTab}
          onValueChange={(v) =>
            setAdminTab(
              v as "posts" | "pages" | "data-export" | "tags-categories",
            )
          }
        >
          <TabsList className="h-9 mb-6" data-ocid="blog_admin.section.tab">
            <TabsTrigger value="posts" className="text-xs px-5 gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="pages" className="text-xs px-5 gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="data-export" className="text-xs px-5 gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              Data Export
            </TabsTrigger>
            <TabsTrigger
              value="tags-categories"
              className="text-xs px-5 gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" />
              Tags &amp; Categories
            </TabsTrigger>
          </TabsList>

          {/* ── Blog Posts Tab ── */}
          <TabsContent value="posts" className="space-y-4 mt-0">
            {/* Status filter sub-tabs */}
            <Tabs
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <TabsList className="h-9" data-ocid="blog_admin.filter.tab">
                <TabsTrigger value="all" className="text-xs px-4">
                  All{" "}
                  <span className="ml-1.5 text-muted-foreground">
                    ({counts.all})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="published" className="text-xs px-4">
                  Published{" "}
                  <span className="ml-1.5 text-muted-foreground">
                    ({counts.published})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="text-xs px-4 gap-1">
                  <Clock className="w-3 h-3" />
                  Scheduled{" "}
                  <span
                    className="ml-1"
                    style={{
                      color:
                        counts.scheduled > 0
                          ? "oklch(0.65 0.15 60)"
                          : undefined,
                      fontWeight: counts.scheduled > 0 ? 600 : undefined,
                    }}
                  >
                    ({counts.scheduled})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="draft" className="text-xs px-4">
                  Drafts{" "}
                  <span className="ml-1.5 text-muted-foreground">
                    ({counts.draft})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="private" className="text-xs px-4">
                  Private{" "}
                  <span className="ml-1.5 text-muted-foreground">
                    ({counts.private})
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts Table */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border border-border overflow-hidden"
              style={{ background: "oklch(0.99 0.004 220)" }}
            >
              {isSeeding ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center gap-3"
                  data-ocid="blog_admin.loading_state"
                >
                  <Loader2
                    className="w-6 h-6 animate-spin"
                    style={{ color: "oklch(0.35 0.10 240)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.35 0.10 240)" }}
                  >
                    Importing blog posts...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {seedProgress} / {BLOG_POSTS.length} posts imported
                  </p>
                  <div className="w-64 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((seedProgress / BLOG_POSTS.length) * 100)}%`,
                        background: "oklch(0.35 0.10 240)",
                      }}
                    />
                  </div>
                </div>
              ) : isLoading ? (
                <div
                  className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2"
                  data-ocid="blog_admin.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading posts...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-ocid="blog_admin.empty_state"
                >
                  <FileText
                    className="w-10 h-10 mb-3"
                    style={{ color: "oklch(0.75 0.01 220)" }}
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    No posts found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statusFilter === "all"
                      ? "Create your first post using the New Post button."
                      : statusFilter === "scheduled"
                        ? "No posts are scheduled for future publishing."
                        : `No ${statusFilter} posts yet.`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          background: "oklch(0.955 0.01 220)",
                          borderBottom: "1px solid oklch(0.90 0.01 220)",
                        }}
                      >
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Title
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                          Category
                        </th>
                        {statusFilter === "scheduled" && (
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Tags
                          </th>
                        )}
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Status
                        </th>
                        <th
                          className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${statusFilter === "scheduled" ? "" : "hidden xl:table-cell"}`}
                        >
                          {statusFilter === "scheduled"
                            ? "Publishes On"
                            : "Schedule"}
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                          Author
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredPosts.map((post, idx) => (
                          <motion.tr
                            key={post.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, delay: idx * 0.02 }}
                            data-ocid={`blog_admin.post.item.${idx + 1}`}
                            className="border-b border-border/50 hover:bg-accent/40 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <p
                                className="font-medium text-sm line-clamp-1 max-w-xs"
                                style={{ color: "oklch(0.22 0.05 240)" }}
                                title={post.title}
                              >
                                {post.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">
                                {post.summary}
                              </p>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {post.categories.map((cat) => (
                                  <span
                                    key={cat}
                                    className="text-xs text-muted-foreground"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </td>
                            {statusFilter === "scheduled" && (
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1 max-w-[160px]">
                                  {post.tags && post.tags.length > 0 ? (
                                    post.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{
                                          background: "oklch(0.94 0.03 240)",
                                          color: "oklch(0.35 0.10 240)",
                                          border:
                                            "1px solid oklch(0.85 0.05 240)",
                                        }}
                                      >
                                        {tag}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <StatusBadge
                                status={post.status}
                                scheduledAt={post.scheduledAt}
                              />
                            </td>
                            <td
                              className={`px-4 py-3 ${statusFilter === "scheduled" ? "" : "hidden xl:table-cell"}`}
                            >
                              <ScheduleDateCell post={post} />
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="text-xs text-muted-foreground">
                                {post.author}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {statusFilter === "scheduled" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatus(
                                        post,
                                        PostStatus.published,
                                      )
                                    }
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors"
                                    style={{
                                      background: "oklch(0.45 0.12 160)",
                                      color: "white",
                                    }}
                                    title="Publish Now"
                                    data-ocid={`blog_admin.publish_now.button.${idx + 1}`}
                                  >
                                    <Eye className="w-3 h-3" />
                                    Publish Now
                                  </button>
                                )}
                                {post.status !== PostStatus.published && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatus(
                                        post,
                                        PostStatus.published,
                                      )
                                    }
                                    className="p-1.5 rounded-md hover:bg-green-50 text-muted-foreground hover:text-green-700 transition-colors"
                                    title="Publish"
                                    data-ocid={`blog_admin.publish.button.${idx + 1}`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {post.status !== PostStatus.draft && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatus(post, PostStatus.draft)
                                    }
                                    className="p-1.5 rounded-md hover:bg-yellow-50 text-muted-foreground hover:text-yellow-700 transition-colors"
                                    title="Move to Draft"
                                    data-ocid={`blog_admin.draft.button.${idx + 1}`}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {post.status !==
                                  PostStatus.privateVisibility && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuickStatus(
                                        post,
                                        PostStatus.privateVisibility,
                                      )
                                    }
                                    className="p-1.5 rounded-md hover:bg-gray-100 text-muted-foreground hover:text-gray-700 transition-colors"
                                    title="Make Private"
                                    data-ocid={`blog_admin.private.button.${idx + 1}`}
                                  >
                                    <EyeOff className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openEdit(post)}
                                  className="p-1.5 rounded-md hover:bg-blue-50 text-muted-foreground hover:text-blue-700 transition-colors"
                                  title="Edit"
                                  data-ocid={`blog_admin.edit.button.${idx + 1}`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(post)}
                                  className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                                  title="Delete"
                                  data-ocid={`blog_admin.delete.button.${idx + 1}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* ── Pages Tab ── */}
          <TabsContent value="pages" className="mt-0">
            <PagesTab />
          </TabsContent>

          {/* ── Data Export Tab ── */}
          <TabsContent value="data-export" className="mt-0">
            <DataExportTab />
          </TabsContent>

          {/* ── Tags & Categories Tab ── */}
          <TabsContent value="tags-categories" className="mt-0">
            <TagsCategoriesTab />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl flex flex-col p-6"
          data-ocid="blog_admin.editor.sheet"
        >
          <SheetHeader className="shrink-0 mb-4">
            <SheetTitle>{editingPost ? "Edit Post" : "New Post"}</SheetTitle>
            <SheetDescription>
              {editingPost
                ? "Make changes to the post below."
                : "Fill in the details below to create a new blog post."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <PostForm
              key={editingPost?.id ?? "new"}
              initial={formInitial}
              onSave={handleSave}
              onCancel={() => setSheetOpen(false)}
              isSaving={createPost.isPending || updatePost.isPending}
              availableCategories={allCategories}
              availableTags={allTags}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Reschedule All Confirmation Dialog */}
      <Dialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
      >
        <DialogContent data-ocid="blog_admin.reschedule.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw
                className="w-5 h-5"
                style={{ color: "oklch(0.35 0.10 240)" }}
              />
              Reschedule All Posts?
            </DialogTitle>
            <DialogDescription>
              This will reschedule all published blog posts starting today,
              publishing one post every 2 days (oldest post first, newest post
              last). Scheduled posts will be hidden from visitors until their
              publish date arrives. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleDialogOpen(false)}
              data-ocid="blog_admin.reschedule.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRescheduleAll}
              disabled={rescheduleAll.isPending}
              data-ocid="blog_admin.reschedule.confirm_button"
              style={{ background: "oklch(0.35 0.10 240)", color: "white" }}
            >
              {rescheduleAll.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Rescheduling...
                </>
              ) : (
                "Yes, Reschedule All"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent data-ocid="blog_admin.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Post?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="blog_admin.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePost.isPending}
              data-ocid="blog_admin.delete.confirm_button"
            >
              {deletePost.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
