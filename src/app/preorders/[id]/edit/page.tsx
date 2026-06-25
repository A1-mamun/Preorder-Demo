// app/preorders/[id]/edit/page.tsx
import { PreorderEditForm } from "@/components/preorder-edit-form";
import { notFound } from "next/navigation";
import { getPreorderById } from "@/lib/data";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPreorderPage({ params }: EditPageProps) {
  const { id } = await params;
  const preorder = getPreorderById(id);

  if (!preorder) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <PreorderEditForm preorder={preorder} />
    </main>
  );
}
