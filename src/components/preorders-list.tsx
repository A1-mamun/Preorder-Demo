"use client";

import { useState } from "react";
import Link from "next/link";
// import { getPreorders } from "@/lib/data";
// import { PreorderStatus, type Preorder } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  // ChevronLeft,
  // ChevronRight,
} from "lucide-react";
// import { getPreorders } from "@/lib/data";
import { Meta, Preorder } from "@/lib/types";

type SortField = "name" | "createdAt" | "startsAt" | "endsAt";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "active" | "inactive";

export function PreordersList({
  data,
  meta,
}: {
  data: Preorder[];
  meta: Meta;
}) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const allPreorders = data;

  const filteredPreorders = allPreorders.filter((p) => {
    if (filter === "all") return true;
    if (filter === "active") return p.status === "ACTIVE";
    if (filter === "inactive") return p.status === "INACTIVE";
    return true;
  });

  const sortedPreorders = [...filteredPreorders].sort((a, b) => {
    const aVal = a[sortField] ?? "";
    const bVal = b[sortField] ?? "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Preorders</h1>
        <Link
          href="/preorders/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Preorder
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {(["all", "active", "inactive"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              filter === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="relative flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Sort by
          <ChevronDown className="w-4 h-4" />
        </button>
        {showSortMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-40">
            {(["name", "createdAt", "startsAt", "endsAt"] as const).map(
              (field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    sortField === field ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  <span className="capitalize">
                    {field.replace("At", " at")}
                  </span>
                  {sortField === field &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </button>
              ),
            )}
            <div className="border-t border-gray-100 px-4 py-2 flex gap-2">
              <button
                onClick={() => setSortOrder("asc")}
                className={`text-sm px-2 py-0.5 rounded ${sortOrder === "asc" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
              >
                Asc
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                className={`text-sm px-2 py-0.5 rounded ${sortOrder === "desc" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}
              >
                Desc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preorder when
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Starts at
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ends at
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedPreorders.map((preorder) => (
                <tr key={preorder.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{preorder.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {preorder.products}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {preorder.preorderWhen}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {preorder.startsAt}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {preorder.endsAt || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        preorder.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {preorder.status || "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/preorders/${preorder.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500 bg-gray-50">
          Showing {meta.page * meta.limit - meta.limit + 1} to{" "}
          {Math.min(meta.page * meta.limit, meta.total)} from {meta.total}
        </div>
      </div>
    </div>
  );
}
