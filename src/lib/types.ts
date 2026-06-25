// lib/types.ts
export type PreorderWhen = "out-of-stock" | "regardless-of-stock";
export type PreorderStatus = "ACTIVE" | "INACTIVE";

export interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: PreorderWhen;
  startsAt: string; // formatted date string
  endsAt: string | null;
  status: PreorderStatus;
  createdAt: string;
}
export interface Meta {
  page: number;
  limit: number;
  total: number;
}

// Sort fields
export type SortField = "name" | "createdAt" | "startsAt" | "endsAt";
export type SortOrder = "asc" | "desc";
