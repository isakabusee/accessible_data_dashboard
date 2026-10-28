"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenuePoint } from "../types";

export function RevenueChart({
  data,
}: {
  data: RevenuePoint[];
}) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <section
      aria-labelledby="revenue-heading"
      className="min-w-0 rounded-xl border p-4"
    >
      <h2 id="revenue-heading" className="text-lg font-semibold">
        Revenue over time
      </h2>

      <p id="revenue-description" className="mt-1 text-sm text-gray-600">
        Monthly revenue in US dollars. Exact values are available
        in the data table below.
      </p>

      <div
        role="group"
        aria-label="Monthly revenue chart"
        aria-describedby="revenue-description"
        className="mt-4 h-72 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            accessibilityLayer
            margin={{ top: 8, right: 16, bottom: 8, left: 12 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value: number) =>
                `$${Number(value) / 1000}k`
              }
            />
            <Tooltip
              formatter={(value) => [
                currency.format(Number(value)),
                "Revenue",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#1d4ed8"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <details className="mt-4">
        <summary className="min-h-10 cursor-pointer py-2 font-medium">
          View revenue data
        </summary>

        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Monthly revenue values in US dollars
            </caption>
            <thead>
              <tr className="border-b">
                <th scope="col" className="p-2">Month</th>
                <th scope="col" className="p-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.month} className="border-b">
                  <th scope="row" className="p-2 font-normal">
                    {point.month}
                  </th>
                  <td className="p-2 text-right tabular-nums">
                    {currency.format(point.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}