import { NextResponse } from "next/server";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T;
};

export const sendResponse = <T>({
  statusCode,
  success,
  message,
  meta,
  data,
}: TResponse<T>) => {
  return NextResponse.json(
    {
      success,
      message,
      meta,
      data,
    },
    {
      status: statusCode,
    },
  );
};
