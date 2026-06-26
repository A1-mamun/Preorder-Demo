import { notFound } from "next/navigation";
import { PreorderEditForm } from "@/components/preorder-edit-form";
import { getPreorderById } from "@/lib/actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPreorderPage({ params }: EditPageProps) {
  const { id } = await params;
  const result = await getPreorderById(id);

  if (result.error) {
    // 404 from an unexpected API failure
    if (result.error === "not_found") notFound();
    // For other errors
    throw new Error(result.error);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <PreorderEditForm preorder={result.data?.data} />
    </main>
  );
}
