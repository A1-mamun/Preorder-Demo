"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { createPreorder, updatePreorder } from "@/lib/actions";
import { type Preorder } from "@/lib/types";
import { Field, FieldLabel } from "./ui/field";

interface PreorderEditFormProps {
  preorder?: Preorder;
}

// Convert "2024-06-01 14:00:00" or ISO string → "2024-06-01T14:00" for datetime-local
function toInputValue(val?: string | null): string {
  if (!val) return "";
  return val.replace(" ", "T").slice(0, 16);
}

// Convert datetime-local value back → ISO-like string the API expects
function fromInputValue(val: string): string {
  return val ? val.replace("T", " ") + ":00" : "";
}

export function PreorderEditForm({ preorder }: PreorderEditFormProps) {
  const router = useRouter();
  const isNew = !preorder;
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(preorder?.name ?? "");
  const [products, setProducts] = useState<number>(preorder?.products ?? 0);
  const [preorderWhen, setPreorderWhen] = useState(
    preorder?.preorderWhen ?? "regardless-of-stock",
  );
  const [startsAt, setStartsAt] = useState(toInputValue(preorder?.startsAt));
  const [endsAt, setEndsAt] = useState(toInputValue(preorder?.endsAt));
  const [isActive, setIsActive] = useState(
    preorder ? preorder.status === "ACTIVE" : true,
  );

  // Field-level validation errors
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (products < 0) next.products = "Products must be 0 or more.";
    if (startsAt && endsAt && endsAt <= startsAt)
      next.endsAt = "End date must be after start date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: name.trim(),
      products,
      preorderWhen,
      startsAt: fromInputValue(startsAt),
      endsAt: fromInputValue(endsAt),
      status: isActive ? ("ACTIVE" as const) : ("INACTIVE" as const),
    };

    startTransition(async () => {
      const result = isNew
        ? await createPreorder(payload)
        : await updatePreorder(preorder.id, payload);

      console.log("Result from create/update preorder:", result.data?.success);

      if (result.error) {
        toast.error(
          isNew ? "Failed to create preorder" : "Failed to update preorder",
          {
            description: result.error,
          },
        );

        return;
      }

      if (result.data?.success) {
        toast.success(result.data?.message);

        router.push("/");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm ">
          <Button variant="outline" size="sm" asChild className="p-2">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <span>{isNew ? "" : `/ Edit "${preorder.name}"`}</span>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? "Create Preorder" : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Preorder Details</CardTitle>
            <CardDescription>
              These values apprea in the preorder list.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-6">
            {/* Name */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Label
                htmlFor="name"
                className="flex flex-col items-start justify-start w-full sm:w-1/2"
              >
                <div>
                  Name <span className="text-destructive">*</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  A label to recognise this preorder by.
                </p>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="e.g. Summer Drop 2025"
                aria-invalid={!!errors.name}
                className="w-full sm:w-1/2"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <Separator />

            {/* Products */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Label
                htmlFor="name"
                className="flex flex-col items-start justify-start w-full sm:w-1/2"
              >
                <div>Products</div>
                <p className="text-xs text-muted-foreground">
                  Number of products covered by this preorder.
                </p>
              </Label>
              <Input
                id="products"
                type="number"
                min={0}
                value={products}
                onChange={(e) => {
                  setProducts(parseInt(e.target.value, 10) || 0);
                  if (errors.products)
                    setErrors((p) => ({ ...p, products: undefined }));
                }}
                aria-invalid={!!errors.products}
                className="w-full sm:w-1/2"
              />
              {errors.products && (
                <p className="text-xs text-destructive">{errors.products}</p>
              )}
            </div>

            <Separator />

            {/* Preorder when */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Label
                htmlFor="name"
                className="flex flex-col items-start justify-start w-full sm:w-1/2"
              >
                <div>Preorder when</div>
                <p className="text-xs text-muted-foreground">
                  When customers are allowed to preorder.
                </p>
              </Label>
              <div className="w-full sm:w-1/2">
                <Select
                  value={preorderWhen}
                  onValueChange={(value) =>
                    setPreorderWhen(
                      value as "out-of-stock" | "regardless-of-stock",
                    )
                  }
                >
                  <SelectTrigger id="preorderWhen" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="out-of-stock">Out of stock</SelectItem>
                    <SelectItem value="regardless-of-stock">
                      Regardless of stock
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Starts at */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Label
                htmlFor="name"
                className="flex flex-col items-start justify-start w-full sm:w-1/2"
              >
                <div>Starts at</div>
                <p className="text-xs text-muted-foreground">
                  When the preorder window opens.
                </p>
              </Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => {
                  setStartsAt(e.target.value);
                  if (errors.endsAt)
                    setErrors((p) => ({ ...p, endsAt: undefined }));
                }}
                className="w-full sm:w-1/2"
              />
            </div>

            <Separator />

            {/* Ends at */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Label
                htmlFor="name"
                className="flex flex-col items-start justify-start w-full sm:w-1/2"
              >
                <div>Ends at</div>
                <p className="text-xs text-muted-foreground">
                  When the preorder window closes.
                </p>
              </Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => {
                  setEndsAt(e.target.value);
                  if (errors.endsAt)
                    setErrors((p) => ({ ...p, endsAt: undefined }));
                }}
                aria-invalid={!!errors.endsAt}
                className="w-full sm:w-1/2"
              />
              {errors.endsAt && (
                <p className="text-xs text-destructive">{errors.endsAt}</p>
              )}
            </div>

            <Separator />

            {/* Status toggle */}
            <div className="flex flex-col sm:flex-row gap-5 items-center ">
              <Label
                htmlFor="status-toggle"
                className="flex flex-col items-start justify-start w-full sm:w-1/2"
              >
                <div>Status</div>
                <p className="text-xs text-muted-foreground">
                  Active preorders are visible to customers.
                </p>
              </Label>
              <Field
                orientation="horizontal"
                data-disabled
                className="w-full sm:w-1/2"
              >
                <Switch
                  className=""
                  id="status-toggle"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <FieldLabel htmlFor="status-toggle">Active</FieldLabel>
              </Field>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t pt-0">
            <Button variant="outline" type="button" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNew ? "Create Preorder" : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
