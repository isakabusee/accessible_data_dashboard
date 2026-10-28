import type { Order } from "../types";

export const sampleOrders: Order[] = [
  {
    id: "ORD-1001",
    customer: "Acme Inc.",
    region: "west",
    category: "software",
    status: "completed",
    revenue: 12450,
    createdAt: "2026-10-12T15:30:00Z",
  },
  {
    id: "ORD-1002",
    customer: "Northstar Ltd.",
    region: "east",
    category: "hardware",
    status: "pending",
    revenue: 4200,
    createdAt: "2026-10-10T10:00:00Z",
  },
  {
    id: "ORD-1003",
    customer: "Acme Inc.",
    region: "central",
    category: "services",
    status: "completed",
    revenue: 8700,
    createdAt: "2026-10-05T12:00:00Z",
  },
  {
    id: "ORD-1004",
    customer: "Bluebird Co.",
    region: "west",
    category: "hardware",
    status: "cancelled",
    revenue: 1600,
    createdAt: "2026-10-03T09:15:00Z",
  },
  {
    id: "ORD-1005",
    customer: "Summit Group",
    region: "east",
    category: "software",
    status: "completed",
    revenue: 19800,
    createdAt: "2026-10-01T08:00:00Z",
  },
];