import { NextRequest } from "next/server";

import { globalErrorHandler } from "@/errors/globalErrorHandler";
import { PreorderController } from "@/modules/preorder/preorder.controller";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    return await PreorderController.getSinglePreorder(id);
  } catch (error) {
    return globalErrorHandler(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;

    return await PreorderController.updatePreorder(id, body);
  } catch (error) {
    return globalErrorHandler(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    return await PreorderController.deletePreorder(id);
  } catch (error) {
    return globalErrorHandler(error);
  }
}
