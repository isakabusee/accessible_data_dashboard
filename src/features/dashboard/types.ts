export type OrderStatus =
  | "pending"
  | "completed"
  | "cancelled";

export type Region = "west" | "east" | "central";

export type OrderCategory =
  | "software"
  | "hardware"
  | "services";

export type SortField =
  | "customer"
  | "region"
  | "category"
  | "status"
  | "revenue"
  | "createdAt";

export type SortOrder = "asc" | "desc";

export interface DashboardFilters {
  from: string;
  to: string;
  q: string;
  regions: Region[];
  statuses: OrderStatus[];
  categories: OrderCategory[];
  minRevenue: string;
  maxRevenue: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface Order {
  id: string;
  customer: string;
  region: Region;
  category: OrderCategory;
  status: OrderStatus;
  revenue: number;
  createdAt: string;
}

export interface PaginatedOrders {
  data: Order[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  conversionRate: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}