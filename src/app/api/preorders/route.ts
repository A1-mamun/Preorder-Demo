import { NextRequest } from "next/server";

import { globalErrorHandler } from "@/errors/globalErrorHandler";
import { PreorderController } from "@/modules/preorder/preorder.controller";

export async function GET(req: NextRequest) {
  try {
    return await PreorderController.getAllPreorders(req.nextUrl.searchParams);
  } catch (error) {
    return globalErrorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return await PreorderController.createPreorder(body);
  } catch (error) {
    return globalErrorHandler(error);
  }
}
