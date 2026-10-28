"use client";

import type {
  DashboardFilters,
  OrderCategory,
  OrderStatus,
  Region,
} from "../types";

interface Props {
  filters: DashboardFilters;
  onChange: (patch: Partial<DashboardFilters>) => void;
  onClear: () => void;
}

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly { label: string; value: T }[];
  selected: T[];
  onChange: (values: T[]) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 text-sm font-medium">
        {label}
      </legend>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={(event) => {
                onChange(
                  event.target.checked
                    ? [...selected, option.value]
                    : selected.filter(
                        (v) => v !== option.value,
                      ),
                );
              }}
              className="size-4 accent-blue-700"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function DashboardFilters({
  filters,
  onChange,
  onClear,
}: Props) {
  return (
    <section
      aria-labelledby="filters-heading"
      className="space-y-4 rounded-xl border p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="filters-heading" className="text-lg font-semibold">
          Filters
        </h2>

        <button
          type="button"
          onClick={onClear}
          className="min-h-10 rounded-md border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Clear all filters
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="search" className="mb-1 block text-sm font-medium">
            Search records
          </label>
          <input
            id="search"
            type="search"
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Customer or order ID"
            className="min-h-11 w-full rounded-md border px-3"
          />
        </div>

        <div>
          <label htmlFor="from" className="mb-1 block text-sm font-medium">
            Start date
          </label>
          <input
            id="from"
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => onChange({ from: e.target.value })}
            className="min-h-11 w-full rounded-md border px-3"
          />
        </div>

        <div>
          <label htmlFor="to" className="mb-1 block text-sm font-medium">
            End date
          </label>
          <input
            id="to"
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => onChange({ to: e.target.value })}
            className="min-h-11 w-full rounded-md border px-3"
          />
        </div>

        <div>
          <MultiSelect<Region>
            label="Region"
            options={[
              { label: "West", value: "west" },
              { label: "East", value: "east" },
              { label: "Central", value: "central" },
            ]}
            selected={filters.regions}
            onChange={(regions) => onChange({ regions })}
          />
        </div>

        <div>
          <MultiSelect<OrderStatus>
            label="Order status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            selected={filters.statuses}
            onChange={(statuses) => onChange({ statuses })}
          />
        </div>

        <div>
          <MultiSelect<OrderCategory>
            label="Category"
            options={[
              { label: "Software", value: "software" },
              { label: "Hardware", value: "hardware" },
              { label: "Services", value: "services" },
            ]}
            selected={filters.categories}
            onChange={(categories) => onChange({ categories })}
          />
        </div>

        <div>
          <label htmlFor="minRevenue" className="mb-1 block text-sm font-medium">
            Minimum revenue ($)
          </label>
          <input
            id="minRevenue"
            type="number"
            min="0"
            step="0.01"
            value={filters.minRevenue}
            onChange={(e) => onChange({ minRevenue: e.target.value })}
            className="min-h-11 w-full rounded-md border px-3"
          />
        </div>

        <div>
          <label htmlFor="maxRevenue" className="mb-1 block text-sm font-medium">
            Maximum revenue ($)
          </label>
          <input
            id="maxRevenue"
            type="number"
            min="0"
            step="0.01"
            value={filters.maxRevenue}
            onChange={(e) => onChange({ maxRevenue: e.target.value })}
            className="min-h-11 w-full rounded-md border px-3"
          />
        </div>
      </div>

      <p className="text-sm text-gray-600" role="status">
        Filters update the dashboard automatically.
      </p>
    </section>
  );
}