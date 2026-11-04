import { describe, expect, it } from "vitest";
import { DASHBOARD_WIDGETS, moveDashboardWidget, normalizeDashboardLayout } from "./dashboard-layout";
describe("Command Center layout", () => {
  it("offers music, weather, smart-home, fitness and visitor widgets", () => {
    for (const id of ["spotify", "weather", "smarthome", "fitness", "smart", "visitors"]) expect(DASHBOARD_WIDGETS).toContain(id);
  });
  it("keeps only known widgets and appends missing ones", () => {
    const layout = normalizeDashboardLayout({ order: ["qr", "qr", "admin"], hidden: ["qa", "admin"] });
    expect(layout.order[0]).toBe("qr"); expect(layout.order).toHaveLength(DASHBOARD_WIDGETS.length); expect(layout.hidden).toEqual(["qa"]);
  });
  it("bounds widget widths and accepts independent heights", () => {
    expect(normalizeDashboardLayout({ tiles: { qa: { width: 99, height: "tall" }, qr: { width: 2, height: "medium" } } }).tiles).toEqual({ qa: { width: 1, height: "tall" }, qr: { width: 2, height: "medium" } });
  });
  it("moves a widget without losing neighboring widgets", () => {
    const layout = normalizeDashboardLayout({ order: ["qr", "hub"] });
    expect(moveDashboardWidget(layout, "qr", 1).order.slice(0, 2)).toEqual(["hub", "qr"]);
    expect(moveDashboardWidget(layout, "qr", -1)).toBe(layout);
  });
});