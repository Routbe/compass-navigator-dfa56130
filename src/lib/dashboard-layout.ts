export const DASHBOARD_WIDGETS = ["share", "card", "presence", "relays", "hub", "qr", "inbox", "agenda", "social", "qa", "connections", "visitors", "spotify", "weather", "smarthome", "fitness", "smart"] as const;
export const OPTIONAL_DASHBOARD_WIDGETS = ["connections", "visitors", "spotify", "weather", "smarthome", "fitness", "smart"] as const;
export type DashboardWidgetId = typeof DASHBOARD_WIDGETS[number];
export type DashboardTile = { width: 1 | 2 | 3; height: "auto" | "medium" | "tall" };
export type DashboardLayout = { order: DashboardWidgetId[]; hidden: DashboardWidgetId[]; tiles: Partial<Record<DashboardWidgetId, DashboardTile>> };
export function normalizeDashboardLayout(raw: unknown): DashboardLayout {
  const r = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const ids = (v: unknown): DashboardWidgetId[] => Array.isArray(v) ? [...new Set(v.filter((id): id is DashboardWidgetId => DASHBOARD_WIDGETS.includes(id as DashboardWidgetId)))] : [];
  const order = ids(r["order"]);
  for (const id of DASHBOARD_WIDGETS) if (!order.includes(id)) order.push(id);
  const tiles: DashboardLayout["tiles"] = {};
  const input = r["tiles"] && typeof r["tiles"] === "object" ? r["tiles"] as Record<string, unknown> : {};
  for (const id of DASHBOARD_WIDGETS) {
    const tile = input[id];
    if (!tile || typeof tile !== "object") continue;
    const t = tile as Record<string, unknown>;
    tiles[id] = { width: t["width"] === 2 || t["width"] === 3 ? t["width"] : 1, height: t["height"] === "medium" || t["height"] === "tall" ? t["height"] : "auto" };
  }
  return { order, hidden: ids(r["hidden"]), tiles };
}
export function moveDashboardWidget(layout: DashboardLayout, id: DashboardWidgetId, direction: -1 | 1): DashboardLayout {
  const order = [...layout.order]; const index = order.indexOf(id); const target = index + direction;
  const other = order[target];
  if (index < 0 || !other) return layout;
  order[target] = id; order[index] = other;
  return { ...layout, order };
}