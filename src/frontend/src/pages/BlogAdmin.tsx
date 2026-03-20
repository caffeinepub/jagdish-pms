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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/hooks/useQueries";
import {
  PostStatus,
  useCreatePost,
  useDeletePost,
  useGetAllPosts,
  useUpdatePost,
} from "@/hooks/useQueries";
import {
  Edit2,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BLOG_POSTS } from "../data/blogPosts";

const BLOG_CATEGORIES = [
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

type StatusFilter = "all" | "published" | "draft" | "private";

function statusLabel(status: PostStatus): string {
  if (status === PostStatus.published) return "Published";
  if (status === PostStatus.draft) return "Draft";
  return "Private";
}

function StatusBadge({ status }: { status: PostStatus }) {
  if (status === PostStatus.published) {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
        Published
      </Badge>
    );
  }
  if (status === PostStatus.draft) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
        Draft
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
      Private
    </Badge>
  );
}

interface PostFormData {
  title: string;
  summary: string;
  category: string;
  author: string;
  readTime: string;
  status: PostStatus;
  content: string[];
}

const DEFAULT_FORM: PostFormData = {
  title: "",
  summary: "",
  category: "Vision",
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
}: {
  initial: PostFormData;
  onSave: (data: PostFormData) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<PostFormData>(initial);
  const paraKeys = Array.from({ length: 20 }, (_, i) => i);

  const set = (
    field: keyof PostFormData,
    value: string | PostStatus | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

        {/* Row: Category + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger
                data-ocid="blog_admin.category.select"
                className="text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

export default function BlogAdmin() {
  const { data: posts = [], isLoading, isFetched } = useGetAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [seedProgress, setSeedProgress] = useState(0);
  const [isSeeding, setIsSeeding] = useState(false);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!isFetched || seededRef.current || posts.length > 0) return;
    seededRef.current = true;
    setIsSeeding(true);
    const seed = async () => {
      let count = 0;
      for (const post of BLOG_POSTS) {
        try {
          await createPost.mutateAsync({
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
        count++;
        setSeedProgress(count);
      }
      setIsSeeding(false);
    };
    seed();
  }, [isFetched, posts.length, createPost.mutateAsync]);

  const filteredPosts = posts.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "published") return p.status === PostStatus.published;
    if (statusFilter === "draft") return p.status === PostStatus.draft;
    if (statusFilter === "private")
      return p.status === PostStatus.privateVisibility;
    return true;
  });

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === PostStatus.published).length,
    draft: posts.filter((p) => p.status === PostStatus.draft).length,
    private: posts.filter((p) => p.status === PostStatus.privateVisibility)
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
          category: data.category,
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
          category: data.category,
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
        category: post.category,
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

  const formInitial: PostFormData = editingPost
    ? {
        title: editingPost.title,
        summary: editingPost.summary,
        category: editingPost.category,
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
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, edit, and manage blog content
          </p>
        </div>
        <Button
          onClick={openNew}
          data-ocid="blog_admin.new_post.button"
          className="gap-2"
          style={{ background: "oklch(0.35 0.10 240)", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </motion.div>

      {/* Stats + Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
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
      </motion.div>

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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
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
                        <span className="text-xs text-muted-foreground">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {post.author}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick status buttons */}
                          {post.status !== PostStatus.published && (
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickStatus(post, PostStatus.published)
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
                          {post.status !== PostStatus.privateVisibility && (
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
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEdit(post)}
                            className="p-1.5 rounded-md hover:bg-blue-50 text-muted-foreground hover:text-blue-700 transition-colors"
                            title="Edit"
                            data-ocid={`blog_admin.edit.button.${idx + 1}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete */}
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
            />
          </div>
        </SheetContent>
      </Sheet>

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
