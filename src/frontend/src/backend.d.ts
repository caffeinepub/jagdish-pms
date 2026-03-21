import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserTransactionRecord {
    userName: string;
    principal: string;
    transactionType: string;
    navPerUnit: bigint;
    date: Time;
    fundId: string;
    units: bigint;
    amount: bigint;
}
export interface CapitalGainsReport {
    totalLtcg: bigint;
    totalStcg: bigint;
    details: Array<FundCapitalGain>;
}
export interface BlogPost {
    id: string;
    categories: Array<string>;
    status: PostStatus;
    title: string;
    content: Array<string>;
    createdAt: Time;
    tags: Array<string>;
    author: string;
    readTime: string;
    summary: string;
    updatedAt: Time;
    scheduledAt?: Time;
}
export type Time = bigint;
export interface UserHoldingRecord {
    userName: string;
    principal: string;
    fundId: string;
    units: bigint;
    avgCostNav: bigint;
}
export interface HoldingSummary {
    gainLoss: bigint;
    fundId: string;
    currentValue: bigint;
    units: bigint;
    amountInvested: bigint;
}
export interface PortfolioSummary {
    gainLoss: bigint;
    holdings: Array<HoldingSummary>;
    currentValue: bigint;
    investedAmount: bigint;
}
export interface FundCapitalGain {
    ltcg: bigint;
    stcg: bigint;
    fundId: string;
}
export interface UpdateBlogPostInput {
    id: string;
    categories: Array<string>;
    status: PostStatus;
    title: string;
    content: Array<string>;
    tags: Array<string>;
    author: string;
    readTime: string;
    summary: string;
    scheduledAt?: Time;
}
export interface UserRecord {
    principal: string;
    name: string;
}
export interface Transaction {
    transactionType: TransactionType;
    navPerUnit: bigint;
    date: Time;
    fundId: string;
    units: bigint;
    amount: bigint;
}
export interface CreateBlogPostInput {
    categories: Array<string>;
    status: PostStatus;
    title: string;
    content: Array<string>;
    tags: Array<string>;
    author: string;
    readTime: string;
    summary: string;
    scheduledAt?: Time;
}
export interface UserCapitalGainsRecord {
    userName: string;
    principal: string;
    ltcg: bigint;
    stcg: bigint;
    fundId: string;
}
export interface Holding {
    fundId: string;
    units: bigint;
    avgCostNav: bigint;
}
export interface Fund {
    id: string;
    lastNavUpdate: Time;
    name: string;
    category: FundCategory;
    currentNav: bigint;
}
export interface UserProfile {
    name: string;
}
export enum FundCategory {
    debt = "debt",
    elss = "elss",
    hybrid = "hybrid",
    equity = "equity"
}
export enum PostStatus {
    published = "published",
    privateVisibility = "privateVisibility",
    draft = "draft"
}
export enum TransactionType {
    buy = "buy",
    sip = "sip",
    sell = "sell"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: string): Promise<void>;
    addFund(id: string, name: string, category: FundCategory, initialNav: bigint): Promise<void>;
    addTag(tag: string): Promise<void>;
    addTransaction(fundId: string, transactionType: TransactionType, units: bigint, navPerUnit: bigint, amount: bigint): Promise<void>;
    adminGetAllCapitalGains(): Promise<Array<UserCapitalGainsRecord>>;
    adminGetAllHoldings(): Promise<Array<UserHoldingRecord>>;
    adminGetAllTransactions(): Promise<Array<UserTransactionRecord>>;
    adminGetAllUsers(): Promise<Array<UserRecord>>;
    adminRescheduleAllPosts(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapFirstAdmin(): Promise<boolean>;
    createPost(input: CreateBlogPostInput): Promise<string>;
    deleteCategory(category: string): Promise<void>;
    deletePost(postId: string): Promise<void>;
    deleteTag(tag: string): Promise<void>;
    getAllCategories(): Promise<Array<string>>;
    getAllFunds(): Promise<Array<Fund>>;
    getAllPosts(): Promise<Array<BlogPost>>;
    getAllTags(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCapitalGainsReport(): Promise<CapitalGainsReport>;
    getHoldings(): Promise<Array<Holding>>;
    getNextPostId(): Promise<bigint>;
    getPortfolioSummary(): Promise<PortfolioSummary>;
    getPostById(postId: string): Promise<BlogPost | null>;
    getPublishedPosts(): Promise<Array<BlogPost>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateNav(fundId: string, newNav: bigint): Promise<void>;
    updatePost(input: UpdateBlogPostInput): Promise<void>;
    updatePostSchedule(postId: string, scheduledAt: Time | null): Promise<void>;
}
