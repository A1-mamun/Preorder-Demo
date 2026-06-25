import { NextRequest } from "next/server";

import { globalErrorHandler } from "@/errors/globalErrorHandler";
import { PreorderController } from "@/modules/preorder/preorder.controller";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    return await PreorderController.toggleStatus(id);
  } catch (error) {
    return globalErrorHandler(error);
  }
}
