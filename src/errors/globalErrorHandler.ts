// src/errors/globalErrorHandler.ts

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import AppError from "./AppError";

export const globalErrorHandler = (error: unknown) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors = [
    {
      path: "",
      message: "An unexpected error occurred",
    },
  ];

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    {
      status: statusCode,
    },
  );
};
