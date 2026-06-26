// lib/types.ts
export type PreorderWhen = "out-of-stock" | "regardless-of-stock";
export type PreorderStatus = "ACTIVE" | "INACTIVE";

export interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: PreorderWhen;
  startsAt: string;
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

export interface TResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export interface GetPreordersParams {
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}
