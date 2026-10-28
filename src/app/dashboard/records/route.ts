import { NextRequest, NextResponse } from "next/server";
// import { sampleOrders } from "@/features/dashboard/server/sample-data";
import { sampleOrders } from "@/src/features/dashboard/server/sample-data";
// import type { Order, SortField } from "@/features/dashboard/types";
import type { Order, SortField } from "@/src/features/dashboard/types"

const sortFields: SortField[] = [
  "customer",
  "region",
  "category",
  "status",
  "revenue",
  "createdAt",
];

function parseMoney(value: string | null) {
  if (value === null || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : null;
}

function compareOrders(
  a: Order,
  b: Order,
  field: SortField,
) {
  if (field === "revenue") return a.revenue - b.revenue;

  if (field === "createdAt") {
    return a.createdAt.localeCompare(b.createdAt);
  }

  return String(a[field]).localeCompare(String(b[field]));
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const q = (params.get("q") ?? "").trim().toLowerCase();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  const minRevenue = parseMoney(params.get("minRevenue"));
  const maxRevenue = parseMoney(params.get("maxRevenue"));

  if (
    (params.has("minRevenue") && params.get("minRevenue") !== "" && minRevenue === null) ||
    (params.has("maxRevenue") && params.get("maxRevenue") !== "" && maxRevenue === null)
  ) {
    return NextResponse.json(
      { error: "Revenue boundaries must be non-negative numbers." },
      { status: 400 },
    );
  }

  if (minRevenue !== null && maxRevenue !== null && minRevenue > maxRevenue) {
    return NextResponse.json(
      { error: "Minimum revenue cannot exceed maximum revenue." },
      { status: 400 },
    );
  }

  const validDate = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

  if (
    (from && !validDate(from)) ||
    (to && !validDate(to)) ||
    (from && to && from > to)
  ) {
    return NextResponse.json(
      { error: "Provide a valid date range." },
      { status: 400 },
    );
  }

  const regions = params.getAll("regions");
  const statuses = params.getAll("statuses");
  const categories = params.getAll("categories");

  const allowedRegions = ["west", "east", "central"];
  const allowedStatuses = ["pending", "completed", "cancelled"];
  const allowedCategories = ["software", "hardware", "services"];

  if (
    regions.some((v) => !allowedRegions.includes(v)) ||
    statuses.some((v) => !allowedStatuses.includes(v)) ||
    categories.some((v) => !allowedCategories.includes(v))
  ) {
    return NextResponse.json(
      { error: "One or more filter values are invalid." },
      { status: 400 },
    );
  }

  const sortByParam = params.get("sortBy") ?? "createdAt";
  const sortBy = sortFields.includes(sortByParam as SortField)
    ? (sortByParam as SortField)
    : "createdAt";

  const sortOrderParam = params.get("sortOrder") ?? "desc";

  if (!["asc", "desc"].includes(sortOrderParam)) {
    return NextResponse.json(
      { error: "Invalid sort direction." },
      { status: 400 },
    );
  }

  const page = Math.max(
    1,
    Math.min(1_000_000, Number(params.get("page")) || 1),
  );

  const rawPageSize = Number(params.get("pageSize")) || 25;
  const pageSize = [10, 25, 50, 100].includes(rawPageSize)
    ? rawPageSize
    : 25;

  const filtered = sampleOrders
    .filter((order) => {
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q);

      const date = order.createdAt.slice(0, 10);

      return (
        matchesSearch &&
        (!from || date >= from) &&
        (!to || date <= to) &&
        (!regions.length || regions.includes(order.region)) &&
        (!statuses.length || statuses.includes(order.status)) &&
        (!categories.length || categories.includes(order.category)) &&
        (minRevenue === null || order.revenue >= minRevenue) &&
        (maxRevenue === null || order.revenue <= maxRevenue)
      );
    })
    .sort((a, b) => {
      const result = compareOrders(a, b, sortBy);
      return (sortOrderParam === "asc" ? 1 : -1) * result;
    });

  const total = filtered.length;
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    data: filtered.slice(start, start + pageSize),
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}