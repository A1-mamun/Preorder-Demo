"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { type Preorder } from "@/lib/types";

interface PreorderEditFormProps {
  preorder?: Preorder;
}

export function PreorderEditForm({ preorder }: PreorderEditFormProps) {
  const router = useRouter();
  const isNew = !preorder;

  const [formData, setFormData] = useState<Partial<Preorder>>({
    name: preorder?.name || "",
    products: preorder?.products || 1,
    preorderWhen: preorder?.preorderWhen || "regardless-of-stock",
    startsAt: preorder?.startsAt || "",
    endsAt: preorder?.endsAt || "",
    status: preorder?.status || "ACTIVE",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd save to an API here
    console.log("Saving preorder:", formData);
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">
          {isNew ? "Create Preorder" : "Edit Preorder"}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              {isNew ? "Create Preorder" : "Edit Preorder"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-500 mb-2">
              These values appear in the preorders list.
            </p>

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Multi variant 3"
              />
              <p className="text-xs text-gray-500">
                A label to recognize this preorder by.
              </p>
            </div>

            {/* Products */}
            <div className="space-y-1.5">
              <label
                htmlFor="products"
                className="block text-sm font-medium text-gray-700"
              >
                Products
              </label>
              <input
                type="number"
                id="products"
                name="products"
                value={formData.products}
                onChange={handleChange}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <p className="text-xs text-gray-500">
                Number of products covered by this preorder.
              </p>
            </div>

            {/* Preorder when */}
            <div className="space-y-1.5">
              <label
                htmlFor="preorderWhen"
                className="block text-sm font-medium text-gray-700"
              >
                Preorder when
              </label>
              <select
                id="preorderWhen"
                name="preorderWhen"
                value={formData.preorderWhen}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="out-of-stock">Out of stock</option>
                <option value="regardless-of-stock">Regardless of stock</option>
              </select>
              <p className="text-xs text-gray-500">
                When customers are allowed to preorder.
              </p>
            </div>

            {/* Starts at */}
            <div className="space-y-1.5">
              <label
                htmlFor="startsAt"
                className="block text-sm font-medium text-gray-700"
              >
                Starts at
              </label>
              <input
                type="datetime-local"
                id="startsAt"
                name="startsAt"
                value={formData.startsAt?.replace(" ", "T") || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    startsAt: val ? val.replace("T", " ") : "",
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <p className="text-xs text-gray-500">
                When the preorder window opens.
              </p>
            </div>

            {/* Ends at */}
            <div className="space-y-1.5">
              <label
                htmlFor="endsAt"
                className="block text-sm font-medium text-gray-700"
              >
                Ends at
              </label>
              <input
                type="datetime-local"
                id="endsAt"
                name="endsAt"
                value={formData.endsAt?.replace(" ", "T") || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    endsAt: val ? val.replace("T", " ") : "",
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <p className="text-xs text-gray-500">
                Leave empty for no end date.
              </p>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
              <p className="text-xs text-gray-500">
                Active preorders are visible to customers.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
