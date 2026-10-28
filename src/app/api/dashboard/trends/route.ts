import { NextResponse } from "next/server";
// import { sampleOrders } from "@/features/dashboard/server/sample-data";
import { sampleOrders } from "@/src/features/dashboard/server/sample-data";

export async function GET() {
  const monthly = new Map<string, number>();

  for (const order of sampleOrders) {
    if (order.status === "cancelled") continue;

    const month = order.createdAt.slice(0, 7);
    monthly.set(
      month,
      (monthly.get(month) ?? 0) + order.revenue,
    );
  }

  const data = Array.from(monthly, ([month, revenue]) => ({
    month,
    revenue,
  })).sort((a, b) => a.month.localeCompare(b.month));

  return NextResponse.json(data);
}