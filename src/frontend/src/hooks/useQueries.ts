import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type BlogPost,
  type CreateBlogPostInput,
  FundCategory,
  PostStatus,
  TransactionType,
  type UpdateBlogPostInput,
  type UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export { FundCategory, PostStatus, TransactionType };
export type { BlogPost, CreateBlogPostInput, UpdateBlogPostInput };

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
    }: {
      id: string;
      name: string;
      category: FundCategory;
      initialNav: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addFund(id, name, category, initialNav);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["funds"] }),
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fundId,
      transactionType,
      units,
      navPerUnit,
      amount,
    }: {
      fundId: string;
      transactionType: TransactionType;
      units: bigint;
      navPerUnit: bigint;
      amount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addTransaction(
        fundId,
        transactionType,
        units,
        navPerUnit,
        amount,
      );
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
