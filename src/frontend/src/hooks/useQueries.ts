import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type BlogPost,
  type CreateBlogPostInput,
  FundCategory,
  PostStatus,
  type TransactionInput,
  TransactionType,
  type UpdateBlogPostInput,
  type UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export { FundCategory, PostStatus, TransactionType };
export type {
  BlogPost,
  CreateBlogPostInput,
  TransactionInput,
  UpdateBlogPostInput,
};

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useGetAllFunds() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFunds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHoldings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["holdings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHoldings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPortfolioSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["portfolioSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPortfolioSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCapitalGains() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["capitalGains"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCapitalGainsReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFund() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      category,
      initialNav,
      amc,
      fundType,
    }: {
      id: string;
      name: string;
      category: FundCategory;
      initialNav: bigint;
      amc?: string;
      fundType?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addFund(
        id,
        name,
        category,
        initialNav,
        amc ?? "",
        fundType ?? "",
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["funds"] }),
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TransactionInput) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addTransaction(input);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          [
            "transactions",
            "holdings",
            "portfolioSummary",
            "capitalGains",
          ].includes(q.queryKey[0] as string),
      }),
  });
}

export function useUpdateNav() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fundId,
      newNav,
    }: { fundId: string; newNav: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateNav(fundId, newNav);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          ["funds", "holdings", "portfolioSummary", "capitalGains"].includes(
            q.queryKey[0] as string,
          ),
      }),
  });
}

// ─── Favorite Funds Hooks ─────────────────────────────────────────────────────

export function useGetFavoriteFunds() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["favoriteFunds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavoriteFunds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFavoriteFund() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fundId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addFavoriteFund(fundId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favoriteFunds"] }),
  });
}

export function useRemoveFavoriteFund() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fundId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.removeFavoriteFund(fundId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favoriteFunds"] }),
  });
}

// ─── Blog Hooks ───────────────────────────────────────────────────────────────

export function useGetPublishedPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["publishedPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["allPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBlogPostInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPost(input);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          ["allPosts", "publishedPosts"].includes(q.queryKey[0] as string),
      }),
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateBlogPostInput) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updatePost(input);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          ["allPosts", "publishedPosts"].includes(q.queryKey[0] as string),
      }),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deletePost(postId);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          ["allPosts", "publishedPosts"].includes(q.queryKey[0] as string),
      }),
  });
}

export function useAdminRescheduleAllPosts() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      await actor.adminRescheduleAllPosts();
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          ["allPosts", "publishedPosts"].includes(q.queryKey[0] as string),
      }),
  });
}

export function useUpdatePostSchedule() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      scheduledAt,
    }: { postId: string; scheduledAt: bigint | null }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updatePostSchedule(postId, scheduledAt);
    },
    onSuccess: () =>
      qc.invalidateQueries({
        predicate: (q) =>
          ["allPosts", "publishedPosts"].includes(q.queryKey[0] as string),
      }),
  });
}

// ─── Static Page Hooks ────────────────────────────────────────────────────────

export function useGetPageContent(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost | null>({
    queryKey: ["page", slug],
    queryFn: async () => {
      if (!actor) return null;
      const all = await actor.getAllPosts();
      return (
        all.find(
          (p) => p.categories.includes("Static Page") && p.author === slug,
        ) ?? null
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePageContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      title,
      content,
      existingId,
    }: {
      slug: string;
      title: string;
      content: string[];
      existingId?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      if (existingId) {
        await actor.updatePost({
          id: existingId,
          title,
          summary: title,
          categories: ["Static Page"],
          tags: [],
          author: slug,
          readTime: "",
          status: PostStatus.published,
          content,
        });
      } else {
        await actor.createPost({
          title,
          summary: title,
          categories: ["Static Page"],
          tags: [],
          author: slug,
          readTime: "",
          status: PostStatus.published,
          content,
        });
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["page", vars.slug] });
      qc.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
}

// ── Admin Data Export Hooks ──────────────────────────────────────────────────

export interface UserRecord {
  principal: string;
  name: string;
}

export interface UserTransactionRecord {
  principal: string;
  userName: string;
  fundId: string;
  transactionType: string;
  units: bigint;
  navPerUnit: bigint;
  amount: bigint;
  date: bigint;
  amc?: string;
  folioNumber?: string;
  agentCode?: string;
  agentName?: string;
  subAgentCode?: string;
  subAgentName?: string;
  bankAccount?: string;
  paymentMode?: string;
  isin?: string;
  remarks?: string;
  txnDate?: bigint;
}

export interface UserHoldingRecord {
  principal: string;
  userName: string;
  fundId: string;
  units: bigint;
  avgCostNav: bigint;
}

export interface UserCapitalGainsRecord {
  principal: string;
  userName: string;
  fundId: string;
  stcg: bigint;
  ltcg: bigint;
}

export function useAdminGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRecord[]>({
    queryKey: ["adminGetAllUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).adminGetAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminGetAllTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<UserTransactionRecord[]>({
    queryKey: ["adminGetAllTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).adminGetAllTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminGetAllHoldings() {
  const { actor, isFetching } = useActor();
  return useQuery<UserHoldingRecord[]>({
    queryKey: ["adminGetAllHoldings"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).adminGetAllHoldings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminGetAllCapitalGains() {
  const { actor, isFetching } = useActor();
  return useQuery<UserCapitalGainsRecord[]>({
    queryKey: ["adminGetAllCapitalGains"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).adminGetAllCapitalGains();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Tags & Categories Hooks ──────────────────────────────────────────────────

export function useGetAllTags() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["allTags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTags();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["allBlogCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTag() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tag: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addTag(tag);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTags"] }),
  });
}

export function useDeleteTag() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tag: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteTag(tag);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTags"] }),
  });
}

export function useAddCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addCategory(category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBlogCategories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteCategory(category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBlogCategories"] }),
  });
}

// ─── Admin User List & Portfolio Hooks ────────────────────────────────────────

export interface UserSummary {
  principal: string;
  gmail: string;
  registeredAt: bigint;
  lastSeen: bigint;
  totalInvested: bigint;
  transactionCount: bigint;
}

export interface UserPortfolio {
  transactions: Array<{
    fundId: string;
    transactionType: string;
    units: bigint;
    navPerUnit: bigint;
    amount: bigint;
    date: bigint;
    txnDate?: bigint;
    amc?: string;
    folioNumber?: string;
    agentCode?: string;
    agentName?: string;
    subAgentCode?: string;
    subAgentName?: string;
    bankAccount?: string;
    isin?: string;
    paymentMode?: string;
    remarks?: string;
  }>;
  holdings: Array<{
    fundId: string;
    units: bigint;
    avgCostNav: bigint;
  }>;
  capitalGains: {
    totalLtcg: bigint;
    totalStcg: bigint;
    details: Array<{ fundId: string; ltcg: bigint; stcg: bigint }>;
  };
}

export function useGetAdminUserList() {
  const { actor, isFetching } = useActor();
  return useQuery<UserSummary[]>({
    queryKey: ["adminUserList"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAdminUserList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminUserPortfolio(principal: string) {
  const { actor, isFetching } = useActor();
  return useQuery<UserPortfolio | null>({
    queryKey: ["adminUserPortfolio", principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      const result = await (actor as any).getAdminUserPortfolio(principal);
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}
