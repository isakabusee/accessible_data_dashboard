import type { DashboardSummary } from "../types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface Props {
  summary: DashboardSummary;
}

export function KpiCards({ summary }: Props) {
  const metrics = [
    {
      label: "Total revenue",
      value: currency.format(summary.totalRevenue),
    },
    {
      label: "Total orders",
      value: summary.totalOrders.toLocaleString("en-US"),
    },
    {
      label: "Active customers",
      value: summary.activeCustomers.toLocaleString("en-US"),
    },
    {
      label: "Conversion rate",
      value: `${summary.conversionRate.toFixed(1)}%`,
    },
  ];

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="mb-3 text-lg font-semibold">
        Overview
      </h2>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 rounded-xl border p-5"
          >
            <dt className="text-sm text-gray-600">
              {metric.label}
            </dt>
            <dd className="mt-2 break-words text-2xl font-bold tabular-nums">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}