import { Suspense } from "react";
import { PreordersList } from "@/components/preorders-list";

export const dynamic = "force-dynamic";

export default async function PreordersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;

  const params = {
    ...(sp?.status && { status: sp.status }),
    ...(sp?.sortField && { sortBy: sp.sortField }),
    ...(sp?.sortOrder && { sortOrder: sp.sortOrder }),
    ...(sp?.page && { page: sp.page }),
    ...(sp?.pageSize && { limit: sp.pageSize }),
  };

  const query = new URLSearchParams(params).toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/preorders?${query}`, {
    cache: "no-store",
  });
  const data = await res.json();

  console.log("data", data);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <Suspense>
        <PreordersList initialData={data} initialParams={params} />
        {/* <PreordersList data={data.data} meta={data.meta} /> */}
      </Suspense>
    </main>
  );
}
