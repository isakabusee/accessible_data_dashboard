"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchRecords,
  fetchSummary,
  fetchTrends,
} from "../api";
import type { DashboardFilters } from "../types";

export function useDashboardData(
  filters: DashboardFilters,
) {
  const summary = useQuery({
    queryKey: ["dashboard", "summary", filters],
    queryFn: ({ signal }) =>
      fetchSummary(filters, signal),
    staleTime: 30_000,
  });

  const trends = useQuery({
    queryKey: ["dashboard", "trends", filters],
    queryFn: ({ signal }) =>
      fetchTrends(filters, signal),
    staleTime: 30_000,
  });

  const records = useQuery({
    queryKey: ["dashboard", "records", filters],
    queryFn: ({ signal }) =>
      fetchRecords(filters, signal),
    staleTime: 30_000,
  });

  return { summary, trends, records };
}