"use server";

import {
  ActionResult,
  GetPreordersParams,
  TResponse,
  type Preorder,
} from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Fetch all preorders with optional query parameters
export async function getPreorders(
  params: GetPreordersParams = {},
): Promise<ActionResult<TResponse<Preorder[]>>> {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => Boolean(v))),
    ).toString();

    const res = await fetch(
      `${BASE_URL}/api/preorders${query ? `?${query}` : ""}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body?.message ?? `Server error ${res.status}` };
    }

    const data: TResponse<Preorder[]> = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// Fetch single preorder by ID
export async function getPreorderById(
  id: string,
): Promise<ActionResult<TResponse<Preorder>>> {
  try {
    const res = await fetch(`${BASE_URL}/api/preorders/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) return { error: "not_found" };

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body?.message ?? `Server error ${res.status}` };
    }

    const data: TResponse<Preorder> = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// Create preorder
export async function createPreorder(
  payload: Omit<Preorder, "id" | "createdAt" | "updatedAt">,
): Promise<ActionResult<TResponse<Preorder>>> {
  try {
    const res = await fetch(`${BASE_URL}/api/preorders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));

      return {
        error: body?.message ?? `Server error ${res.status}`,
      };
    }

    const data: TResponse<Preorder> = await res.json();

    return { data };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Update preorder
export async function updatePreorder(
  id: string,
  payload: Partial<Omit<Preorder, "id" | "createdAt" | "updatedAt">>,
): Promise<ActionResult<TResponse<Preorder>>> {
  try {
    const res = await fetch(`${BASE_URL}/api/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body?.message ?? `Server error ${res.status}` };
    }

    const data: TResponse<Preorder> = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// Toggle preorder status
export async function togglePreorderStatus(
  id: string,
): Promise<ActionResult<TResponse<Preorder>>> {
  try {
    const res = await fetch(`${BASE_URL}/api/preorders/${id}/status`, {
      method: "PATCH",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));

      return {
        error: body?.message ?? `Server error ${res.status}`,
      };
    }

    const data: TResponse<Preorder> = await res.json();

    return { data };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Delete preorder
export async function deletePreorder(
  id: string,
): Promise<ActionResult<TResponse<{ id: string }>>> {
  try {
    const res = await fetch(`${BASE_URL}/api/preorders/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body?.message ?? `Server error ${res.status}` };
    }

    const data: TResponse<{ id: string }> = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
