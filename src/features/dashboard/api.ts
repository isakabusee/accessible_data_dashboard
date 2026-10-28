import type {
  DashboardFilters,
  DashboardSummary,
  PaginatedOrders,
  RevenuePoint,
} from "./types";

function toQueryString(filters: DashboardFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

async function getJSON<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}). Please try again.`,
    );
  }

  return response.json() as Promise<T>;
}

export function fetchRecords(
  filters: DashboardFilters,
  signal?: AbortSignal,
) {
  return getJSON<PaginatedOrders>(
    `/api/dashboard/records?${toQueryString(filters)}`,
    signal,
  );
}

export function fetchSummary(
  filters: DashboardFilters,
  signal?: AbortSignal,
) {
  return getJSON<DashboardSummary>(
    `/api/dashboard/summary?${toQueryString(filters)}`,
    signal,
  );
}

export function fetchTrends(
  filters: DashboardFilters,
  signal?: AbortSignal,
) {
  return getJSON<RevenuePoint[]>(
    `/api/dashboard/trends?${toQueryString(filters)}`,
    signal,
  );
}