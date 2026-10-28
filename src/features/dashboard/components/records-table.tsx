"use client";

import type {
  DashboardFilters,
  Order,
  SortField,
} from "../types";

interface Props {
  rows: Order[];
  filters: DashboardFilters;
  total: number;
  isFetching: boolean;
  onSort: (field: SortField) => void;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export function RecordsTable({
  rows,
  filters,
  total,
  isFetching,
  onSort,
}: Props) {
  function sortButton(
    label: string,
    field: SortField,
  ) {
    const active = filters.sortBy === field;
    const direction = active ? filters.sortOrder : undefined;

    return (
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex min-h-10 items-center gap-1 rounded-sm text-left font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {label}
        <span aria-hidden="true">
          {direction === "asc"
            ? "↑"
            : direction === "desc"
              ? "↓"
              : "↕"}
        </span>
        <span className="sr-only">
          {active
            ? `, sorted ${direction === "asc" ? "ascending" : "descending"}`
            : ", not sorted"}
        </span>
      </button>
    );
  }

  return (
    <section aria-labelledby="records-heading" className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="records-heading" className="text-lg font-semibold">
          Orders
        </h2>
        <p className="text-sm text-gray-600" role="status" aria-live="polite">
          {total.toLocaleString("en-US")} matching records
          {isFetching ? " — Updating results…" : ""}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table
          aria-labelledby="records-heading"
          aria-busy={isFetching}
          className="w-full min-w-[760px] border-collapse text-left text-sm"
        >
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th scope="col" className="p-3">
                Order ID
              </th>
              <th scope="col" className="p-3">
                {sortButton("Customer", "customer")}
              </th>
              <th scope="col" className="p-3">
                {sortButton("Region", "region")}
              </th>
              <th scope="col" className="p-3">
                {sortButton("Category", "category")}
              </th>
              <th scope="col" className="p-3">
                {sortButton("Status", "status")}
              </th>
              <th scope="col" className="p-3 text-right">
                {sortButton("Revenue", "revenue")}
              </th>
              <th scope="col" className="p-3">
                {sortButton("Date", "createdAt")}
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <th scope="row" className="p-3 font-medium">
                  {order.id}
                </th>
                <td className="p-3">{order.customer}</td>
                <td className="p-3 capitalize">{order.region}</td>
                <td className="p-3 capitalize">{order.category}</td>
                <td className="p-3 capitalize">{order.status}</td>
                <td className="p-3 text-right tabular-nums">
                  {money.format(order.revenue)}
                </td>
                <td className="p-3">
                  {dateFormatter.format(new Date(order.createdAt))}
                </td>
              </tr>
            ))}

            {rows.length === 0 && !isFetching && (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  No records match your filters. Try changing or
                  clearing your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}