import { ZodSchema } from "zod";

const validateRequest = async <T>(
  schema: ZodSchema<T>,
  payload: unknown,
): Promise<T> => {
  return await schema.parseAsync(payload);
};

export default validateRequest;
