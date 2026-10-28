"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";
import type {
  DashboardFilters,
  OrderCategory,
  OrderStatus,
  Region,
  SortField,
  SortOrder,
} from "../types";

const DEFAULTS: DashboardFilters = {
  from: "",
  to: "",
  q: "",
  regions: [],
  statuses: [],
  categories: [],
  minRevenue: "",
  maxRevenue: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  pageSize: 25,
};

function listParam<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T[] {
  return params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .filter(
      (value): value is T =>
        allowed.includes(value as T),
    );
}

const regions = [
  "west",
  "east",
  "central",
] as const;

const statuses = [
  "pending",
  "completed",
  "cancelled",
] as const;

const categories = [
  "software",
  "hardware",
  "services",
] as const;

const sortFields = [
  "customer",
  "region",
  "category",
  "status",
  "revenue",
  "createdAt",
] as const;

function boundedInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  const number = Number(value);

  return Number.isInteger(number)
    ? Math.min(max, Math.max(min, number))
    : fallback;
}

export function useDashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const filters = useMemo<DashboardFilters>(() => {
    const params = new URLSearchParams(searchKey);
    const sortBy = params.get("sortBy");

    return {
      from: params.get("from") ?? "",
      to: params.get("to") ?? "",
      q: (params.get("q") ?? "").slice(0, 200),
      regions: listParam(params, "regions", regions),
      statuses: listParam(params, "statuses", statuses),
      categories: listParam(params, "categories", categories),
      minRevenue: params.get("minRevenue") ?? "",
      maxRevenue: params.get("maxRevenue") ?? "",
      sortBy: sortFields.includes(sortBy as SortField)
        ? (sortBy as SortField)
        : DEFAULTS.sortBy,
      sortOrder:
        params.get("sortOrder") === "asc" ? "asc" : "desc",
      page: boundedInteger(params.get("page"), 1, 1, 1_000_000),
      pageSize: boundedInteger(
        params.get("pageSize"),
        25,
        10,
        100,
      ),
    };
  }, [searchKey]);

  const updateFilters = useCallback(
    (patch: Partial<DashboardFilters>) => {
      const next = { ...filters, ...patch };
      const params = new URLSearchParams(searchKey);

      const keys = [
        "from",
        "to",
        "q",
        "regions",
        "statuses",
        "categories",
        "minRevenue",
        "maxRevenue",
        "sortBy",
        "sortOrder",
        "page",
        "pageSize",
      ];

      keys.forEach((key) => params.delete(key));

      function set(key: string, value: string) {
        if (value) params.set(key, value);
      }

      set("from", next.from);
      set("to", next.to);
      set("q", next.q);
      set("minRevenue", next.minRevenue);
      set("maxRevenue", next.maxRevenue);
      set("sortBy", next.sortBy);
      set("sortOrder", next.sortOrder);

      next.regions.forEach((v) =>
        params.append("regions", v),
      );
      next.statuses.forEach((v) =>
        params.append("statuses", v),
      );
      next.categories.forEach((v) =>
        params.append("categories", v),
      );

      params.set("page", String(next.page));
      params.set("pageSize", String(next.pageSize));

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [filters, pathname, router, searchKey],
  );

  const changeFilters = useCallback(
    (patch: Partial<DashboardFilters>) => {
      updateFilters({ ...patch, page: 1 });
    },
    [updateFilters],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    changeFilters,
    updateFilters,
    clearFilters,
  };
}