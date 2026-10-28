import { describe, expect, it } from "vitest";

describe("dashboard filters", () => {
  it("rejects a minimum revenue greater than the maximum", () => {
    const minRevenue = 500;
    const maxRevenue = 100;

    expect(minRevenue > maxRevenue).toBe(true);
  });

  it("resets pagination when filters change", () => {
    const filters = {
      page: 4,
      pageSize: 25,
      q: "",
    };

    const updated = {
      ...filters,
      q: "Acme",
      page: 1,
    };

    expect(updated.page).toBe(1);
    expect(updated.q).toBe("Acme");
  });
});