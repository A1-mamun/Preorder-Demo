// lib/data.ts
import { Preorder } from "./types";

const preordersData: Preorder[] = [
  {
    id: "1",
    name: "Multi variant 3",
    products: 1,
    preorderWhen: "out-of-stock",
    startsAt: "Dec 15, 2025 08:24 PM",
    endsAt: null,
    status: "active",
    createdAt: "2025-12-15T08:24:00Z",
  },
  {
    id: "2",
    name: "Multi variant 2",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Dec 15, 2025 08:24 PM",
    endsAt: "Dec 15, 2025 08:27 PM",
    status: "active",
    createdAt: "2025-12-15T08:24:00Z",
  },
  {
    id: "3",
    name: "Multi variants 1",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Dec 15, 2025 08:24 PM",
    endsAt: null,
    status: "active",
    createdAt: "2025-12-15T08:24:00Z",
  },
  {
    id: "4",
    name: "Partial payment",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Aug 17, 2025 04:56 PM",
    endsAt: null,
    status: "inactive",
    createdAt: "2025-08-17T16:56:00Z",
  },
  {
    id: "5",
    name: "Shipping not sure",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Aug 17, 2025 04:57 PM",
    endsAt: null,
    status: "inactive",
    createdAt: "2025-08-17T16:57:00Z",
  },
  {
    id: "6",
    name: "Full payment",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Aug 17, 2025 04:56 PM",
    endsAt: null,
    status: "inactive",
    createdAt: "2025-08-17T16:56:00Z",
  },
  {
    id: "7",
    name: "Coming soon",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Dec 11, 2025 04:42 AM",
    endsAt: null,
    status: "inactive",
    createdAt: "2025-12-11T04:42:00Z",
  },
  {
    id: "8",
    name: "With ends",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "Aug 14, 2025 03:59 PM",
    endsAt: null,
    status: "inactive",
    createdAt: "2025-08-14T15:59:00Z",
  },
];

export function getPreorders(): Preorder[] {
  return preordersData;
}

export function getPreorderById(id: string): Preorder | undefined {
  return preordersData.find((p) => p.id === id);
}
