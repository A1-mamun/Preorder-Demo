/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import AppError from "@/errors/AppError";
import calculatePagination from "@/utils/pagination";

const getAllPreordersFromDB = async (query: {
  status?: string;
  page?: string;
  limit?: string;
  //   pageSize?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination({
    page: Number(query.page),
    limit: Number(query.limit),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  const where = {
    isDeleted: false,
    ...(query.status ? { status: query.status as any } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.preorder.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.preorder.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getSinglePreorderFromDB = async (id: number) => {
  const preorder = await prisma.preorder.findUnique({
    where: {
      id,
    },
  });

  if (!preorder) {
    throw new AppError(404, "Preorder not found");
  }

  return preorder;
};

const createPreorderIntoDB = async (payload: any) => {
  return prisma.preorder.create({
    data: {
      ...payload,
      startsAt: new Date(payload.startsAt),
      endsAt: new Date(payload.endsAt),
    },
  });
};

const updatePreorderIntoDB = async (id: number, payload: any) => {
  const existing = await prisma.preorder.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new AppError(404, "Preorder not found");
  }

  return prisma.preorder.update({
    where: {
      id,
    },
    data: {
      ...payload,
      startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
      endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,
    },
  });
};

const deletePreorderFromDB = async (id: number) => {
  const preorder = await prisma.preorder.findUnique({
    where: {
      id,
    },
  });

  if (!preorder) {
    throw new AppError(404, "Preorder not found");
  }

  await prisma.preorder.delete({
    where: {
      id,
    },
  });

  return null;
};

const toggleStatusInDB = async (id: number) => {
  const preorder = await prisma.preorder.findUnique({
    where: {
      id,
    },
  });

  if (!preorder) {
    throw new AppError(404, "Preorder not found");
  }

  return prisma.preorder.update({
    where: {
      id,
    },
    data: {
      status: preorder.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });
};

export const PreorderService = {
  getAllPreordersFromDB,
  getSinglePreorderFromDB,
  createPreorderIntoDB,
  updatePreorderIntoDB,
  deletePreorderFromDB,
  toggleStatusInDB,
};
