import validateRequest from "@/utils/validateRequest";

import { PreorderService } from "./preorder.service";
import { PreorderValidation } from "./preorder.validation";
import { sendResponse } from "@/utils/sendResponse";

const getAllPreorders = async (searchParams: URLSearchParams) => {
  const result = await PreorderService.getAllPreordersFromDB({
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder:
      (searchParams.get("sortOrder") as "asc" | "desc" | null) || undefined,
  });

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Preorders fetched successfully",
    meta: result.meta,
    data: result.data,
  });
};

const getSinglePreorder = async (id: string) => {
  const result = await PreorderService.getSinglePreorderFromDB(Number(id));

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Preorder fetched successfully",
    data: result,
  });
};

const createPreorder = async (body: unknown) => {
  const validatedData = await validateRequest(
    PreorderValidation.createPreorderSchema,
    body,
  );

  const result = await PreorderService.createPreorderIntoDB(validatedData);

  return sendResponse({
    statusCode: 201,
    success: true,
    message: "Preorder created successfully",
    data: result,
  });
};

const updatePreorder = async (id: string, body: unknown) => {
  const validatedData = await validateRequest(
    PreorderValidation.updatePreorderSchema,
    body,
  );

  const result = await PreorderService.updatePreorderIntoDB(
    Number(id),
    validatedData,
  );

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Preorder updated successfully",
    data: result,
  });
};

const deletePreorder = async (id: string) => {
  await PreorderService.deletePreorderFromDB(Number(id));

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Preorder deleted successfully",
    data: null,
  });
};

const toggleStatus = async (id: string) => {
  const result = await PreorderService.toggleStatusInDB(Number(id));

  return sendResponse({
    statusCode: 200,
    success: true,
    message: "Status updated successfully",
    data: result,
  });
};

export const PreorderController = {
  getAllPreorders,
  getSinglePreorder,
  createPreorder,
  updatePreorder,
  deletePreorder,
  toggleStatus,
};
