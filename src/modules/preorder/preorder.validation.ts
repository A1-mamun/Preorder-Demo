import z from "zod";

const preorderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  products: z.number().min(1, "Products must be greater than 0"),
  preorderWhen: z.enum(["out-of-stock", "regardless-of-stock"], {
    message:
      "Preorder When must be either 'out-of-stock' or 'regardless-of-stock'",
  }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  startsAt: z.coerce.date({
    message: "Invalid start date",
  }),
  endsAt: z.coerce.date({
    message: "Invalid end date",
  }),
});

const createPreorderSchema = preorderSchema.refine(
  (data) => data.endsAt > data.startsAt,
  {
    message: "End date must be greater than start date",
    path: ["endsAt"],
  },
);

const updatePreorderSchema = preorderSchema.partial();

const preorderIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const PreorderValidation = {
  createPreorderSchema,
  updatePreorderSchema,
  preorderIdParamSchema,
};
