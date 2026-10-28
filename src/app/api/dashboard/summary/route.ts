import { NextRequest, NextResponse } from "next/server";
// import { sampleOrders } from "@/features/dashboard/server/sample-data";
import { sampleOrders } from "@/src/features/dashboard/server/sample-data";

export async function GET(_request: NextRequest) {
  // Demo only: replace with the shared filtered dataset.
  const orders = sampleOrders.filter(
    (order) => order.status !== "cancelled",
  );

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.revenue,
    0,
  );

  return NextResponse.json({
    totalRevenue,
    totalOrders: orders.length,
    activeCustomers: new Set(
      orders.map((order) => order.customer),
    ).size,
    conversionRate: 0,
  });
}