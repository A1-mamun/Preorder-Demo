"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  ArrowUpDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { togglePreorderStatus, deletePreorder } from "@/lib/actions";
import { Meta, Preorder } from "@/lib/types";

type SortField = "name" | "createdAt" | "startsAt" | "endsAt";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "ACTIVE" | "INACTIVE";

interface PreordersListProps {
  initialData: {
    data: Preorder[];
    meta: Meta;
  };
  initialParams: {
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  };
}

const SORT_FIELD_LABELS: Record<SortField, string> = {
  name: "Name",
  createdAt: "Created At",
  startsAt: "Starts At",
  endsAt: "Ends At",
};

function SortIcon({
  field,
  currentSortField,
  currentSortOrder,
}: {
  field: SortField;
  currentSortField: SortField;
  currentSortOrder: SortOrder;
}) {
  if (currentSortField !== field) return null;
  return currentSortOrder === "asc" ? (
    <ChevronUp className="inline ml-1 h-3 w-3" />
  ) : (
    <ChevronDown className="inline ml-1 h-3 w-3" />
  );
}

// row action cell
function PreorderActions({ preorder }: { preorder: Preorder }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(preorder.status === "ACTIVE");

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next);
    startTransition(async () => {
      const result = await togglePreorderStatus(preorder.id);
      if (result.error) {
        setIsActive(!next);
        toast.error("Failed to update status", { description: result.error });
      } else {
        toast.success(`Preorder ${next ? "activated" : "deactivated"}`);
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePreorder(preorder.id);
      if (result.error) {
        toast.error("Failed to delete preorder", { description: result.error });
      } else {
        toast.success("Preorder deleted");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
          aria-label={`Toggle ${preorder.name}`}
        />
      )}

      <Button size="icon" variant="ghost" asChild>
        <Link href={`/preorders/${preorder.id}/edit`} aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{preorder.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The preorder will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Main list component
export function PreordersList({
  initialData,
  initialParams,
}: PreordersListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, meta } = initialData;

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = data.map((p) => p.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = allIds.some((id) => selectedIds.has(id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(allIds) : new Set());
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // helpers
  const currentStatus = (searchParams.get("status") ??
    initialParams.status ??
    "all") as FilterStatus;
  const currentSortField = (searchParams.get("sortField") ??
    initialParams.sortBy ??
    "name") as SortField;
  const currentSortOrder = (searchParams.get("sortOrder") ??
    initialParams.sortOrder ??
    "asc") as SortOrder;
  const currentPage = Number(
    searchParams.get("page") ?? initialParams.page ?? 1,
  );

  const buildUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) params.delete(key);
        else params.set(key, value);
      });
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  const handleFilterChange = (value: string) => {
    setSelectedIds(new Set());
    router.push(
      buildUrl({ status: value === "all" ? null : value, page: null }),
    );
  };

  const handleSortField = (field: SortField) => {
    const newOrder =
      currentSortField === field && currentSortOrder === "asc" ? "desc" : "asc";
    router.push(
      buildUrl({ sortField: field, sortOrder: newOrder, page: null }),
    );
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <Card className="container mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Preorders</CardTitle>

        <Button asChild>
          <Link href="/preorders/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Preorder
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters + Sort */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Tabs value={currentStatus} onValueChange={handleFilterChange}>
            <TabsList className="bg-white">
              <TabsTrigger
                className="data-[state=active]:bg-gray-200"
                value="all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-gray-200"
                value="ACTIVE"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-gray-200"
                value="INACTIVE"
              >
                Inactive
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4" />
                {SORT_FIELD_LABELS[currentSortField]}
                {currentSortOrder === "asc" ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {(Object.keys(SORT_FIELD_LABELS) as SortField[]).map((field) => (
                <DropdownMenuItem
                  key={field}
                  onClick={() => handleSortField(field)}
                >
                  <span
                    className={currentSortField === field ? "font-medium" : ""}
                  >
                    {SORT_FIELD_LABELS[field]}
                  </span>
                  {currentSortField === field && (
                    <ChevronUp
                      className={`ml-auto h-3 w-3 transition-transform ${currentSortOrder === "desc" ? "rotate-180" : ""}`}
                    />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <div className="flex gap-1 px-1 py-1">
                <Button
                  size="sm"
                  variant={currentSortOrder === "asc" ? "default" : "outline"}
                  className="flex-1 h-7 text-xs"
                  onClick={() => {
                    router.push(buildUrl({ sortOrder: "asc", page: null }));
                  }}
                >
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Asc
                </Button>
                <Button
                  size="sm"
                  variant={currentSortOrder === "desc" ? "default" : "outline"}
                  className="flex-1 h-7 text-xs"
                  onClick={() => {
                    router.push(buildUrl({ sortOrder: "desc", page: null }));
                  }}
                >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Desc
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    aria-label="Select all"
                    checked={
                      allSelected
                        ? true
                        : someSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAll(
                        checked === true || checked === "indeterminate"
                          ? !allSelected
                          : false,
                      )
                    }
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSortField("name")}
                >
                  Name{" "}
                  <SortIcon
                    field="name"
                    currentSortField={currentSortField}
                    currentSortOrder={currentSortOrder}
                  />
                </TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Preorder When</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSortField("startsAt")}
                >
                  Starts At{" "}
                  <SortIcon
                    field="startsAt"
                    currentSortField={currentSortField}
                    currentSortOrder={currentSortOrder}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSortField("endsAt")}
                >
                  Ends At{" "}
                  <SortIcon
                    field="endsAt"
                    currentSortField={currentSortField}
                    currentSortOrder={currentSortOrder}
                  />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No preorders found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((preorder) => (
                  <TableRow
                    key={preorder.id}
                    data-state={
                      selectedIds.has(preorder.id) ? "selected" : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${preorder.name}`}
                        checked={selectedIds.has(preorder.id)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(preorder.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {preorder.name}
                    </TableCell>
                    <TableCell>{preorder.products}</TableCell>
                    <TableCell className="capitalize">
                      {preorder.preorderWhen}
                    </TableCell>
                    <TableCell>
                      {preorder.startsAt
                        ? new Date(preorder.startsAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {preorder.endsAt
                        ? new Date(preorder.endsAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          preorder.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {preorder.status ?? "INACTIVE"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PreorderActions preorder={preorder} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
          <span className="w-full">
            {meta.total === 0
              ? "No results"
              : `Showing ${(currentPage - 1) * meta.limit + 1}–${Math.min(
                  currentPage * meta.limit,
                  meta.total,
                )} of ${meta.total}`}{" "}
            {selectedIds.size > 0 && (
              <span className="text-sm text-green-600 font-medium">
                {selectedIds.size} selected
              </span>
            )}
          </span>

          {totalPages > 1 && (
            <Pagination className="w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      currentPage > 1
                        ? buildUrl({ page: String(currentPage - 1) })
                        : undefined
                    }
                    aria-disabled={currentPage <= 1}
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1,
                  )
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                      acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <span className="px-3 py-2 text-muted-foreground">
                          …
                        </span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href={buildUrl({ page: String(item) })}
                          isActive={item === currentPage}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                <PaginationItem>
                  <PaginationNext
                    href={
                      currentPage < totalPages
                        ? buildUrl({ page: String(currentPage + 1) })
                        : undefined
                    }
                    aria-disabled={currentPage >= totalPages}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
