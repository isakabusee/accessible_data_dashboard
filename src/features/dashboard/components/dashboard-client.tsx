"use client";

import { useDashboardFilters } from "../hooks/use-dashboard-filters";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { DashboardFilters } from "./dashboard-filters";
import { KpiCards } from "./kpi-cards";
import { RevenueChart } from "./revenue-chart";
import { RecordsTable } from "./records-table";
import { Pagination } from "./pagination";
import type { SortField } from "../types";

export function DashboardClient() {
  const {
    filters,
    changeFilters,
    updateFilters,
    clearFilters,
  } = useDashboardFilters();

  const { summary, trends, records } =
    useDashboardData(filters);

  const hasInitialError =
    summary.isError || trends.isError || records.isError;

  return (
    <main className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium text-blue-700">
          ANALYTICS
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Analytics Explorer
        </h1>
        <p className="mt-2 text-gray-600">
          Explore orders, revenue and customer activity.
        </p>
      </header>

      <DashboardFilters
        filters={filters}
        onChange={changeFilters}
        onClear={clearFilters}
      />

      {hasInitialError && (
        <div
          role="alert"
          className="rounded-lg border border-red-700 p-4"
        >
          Some dashboard data could not be loaded.
          Check your connection and try again.
          <button
            type="button"
            className="ml-3 underline"
            onClick={() => {
              void summary.refetch();
              void trends.refetch();
              void records.refetch();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {summary.isPending ? (
        <p role="status">Loading dashboard metrics…</p>
      ) : summary.data ? (
        <KpiCards summary={summary.data} />
      ) : null}

      {trends.isPending ? (
        <p role="status">Loading revenue chart…</p>
      ) : trends.data ? (
        <RevenueChart data={trends.data} />
      ) : null}

      {records.isPending ? (
        <p role="status">Loading order records…</p>
      ) : records.data ? (
        <>
          <RecordsTable
            rows={records.data.data}
            filters={filters}
            total={records.data.meta.total}
            isFetching={records.isFetching}
            onSort={(field: SortField) => {
              const sortOrder =
                filters.sortBy === field &&
                filters.sortOrder === "asc"
                  ? "desc"
                  : "asc";

              updateFilters({
                sortBy: field,
                sortOrder,
                page: 1,
              });
            }}
          />

          <Pagination
            page={filters.page}
            pageSize={filters.pageSize}
            total={records.data.meta.total}
            onPageChange={(page) => updateFilters({ page })}
            onPageSizeChange={(pageSize) =>
              updateFilters({ pageSize, page: 1 })
            }
          />
        </>
      ) : null}
    </main>
  );
}