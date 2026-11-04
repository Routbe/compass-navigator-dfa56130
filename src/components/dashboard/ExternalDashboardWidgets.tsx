import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CloudSun, Music2, RefreshCw, ExternalLink, LockKeyhole, Users } from "lucide-react";
import { getDashboardMusic, getDashboardWeather } from "@/lib/dashboard-widgets.functions";
import { getMyVisitStats } from "@/lib/visits.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardMusic({ userId }: { userId: string }) {
  const load = useServerFn(getDashboardMusic);
  const q = useQuery({ queryKey: ["dashboard-music", userId], queryFn: () => load(), staleTime: 20000, retry: false });
  const data = q.data;
  return <section className="acrylic-card flex min-w-0 flex-col gap-4 p-5"><h2 className="flex items-center gap-2 text-sm"><Music2 className="size-4" />Spotify</h2>
    <div className="min-w-0 flex-1"><p className="break-words font-display text-2xl">{data && "title" in data && data.title ? data.title : q.isPending ? "Laden…" : "Geen muziek actief"}</p>{data && "artist" in data && <p className="text-sm text-muted-foreground">{data.artist}</p>}</div>
    <div className="flex flex-wrap gap-2"><Button variant="outline" size="icon" title="Muziekstatus vernieuwen" aria-label="Muziekstatus vernieuwen" disabled={q.isFetching} onClick={() => void q.refetch()}><RefreshCw className="size-4" /></Button><Button asChild variant="outline" size="sm"><a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" />Open Spotify</a></Button><Button asChild variant="ghost" size="sm"><a href="/studio">Koppeling beheren</a></Button></div>
  </section>;
}

export function DashboardWeather() {
  const load = useServerFn(getDashboardWeather);
  const [city, setCity] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof getDashboardWeather>> | null>(null);
  const [busy, setBusy] = useState(false);
  return <section className="acrylic-card flex min-w-0 flex-col gap-4 p-5"><h2 className="flex items-center gap-2 text-sm"><CloudSun className="size-4" />Weer</h2>
    <form className="flex gap-2" onSubmit={async e => { e.preventDefault(); if (busy || city.trim().length < 2) return; setBusy(true); try { setResult(await load({ data: { city } })); } catch { setResult({ ok: false, error: "provider_unavailable" }); } finally { setBusy(false); } }}><Input aria-label="Stad voor weer" placeholder="Stad" value={city} maxLength={80} onChange={e => setCity(e.target.value)} /><Button type="submit" size="icon" aria-label="Weer ophalen" title="Weer ophalen" disabled={busy || city.trim().length < 2}><RefreshCw className="size-4" /></Button></form>
    <div aria-live="polite">{busy ? <p>Laden…</p> : result?.ok ? <><p className="font-display text-3xl">{Math.round(result.temperature_2m)} °C</p><p className="text-sm">{result.city} · {result.country}</p><p className="text-xs text-muted-foreground">Wind {result.wind_speed_10m} km/h · Open-Meteo</p></> : result ? <p className="text-sm text-muted-foreground">{result.error === "city_not_found" ? "Stad niet gevonden." : "Weer momenteel niet beschikbaar."}</p> : null}</div>
  </section>;
}

export function DashboardVisitors({ userId }: { userId: string }) {
  const load = useServerFn(getMyVisitStats);
  const q = useQuery({ queryKey: ["dashboard-visitors", userId], queryFn: () => load({ data: { days: 30, space: "all" } }), staleTime: 60000, retry: false });
  return <section className="acrylic-card flex min-w-0 flex-col gap-3 p-5"><h2 className="flex items-center gap-2 text-sm"><Users className="size-4" />Bezoekers</h2><p className="font-display text-3xl">{q.data ? q.data.total : "—"}</p><p className="text-xs text-muted-foreground">{q.isError ? "Statistieken niet beschikbaar." : "Laatste 30 dagen"}</p>{q.data && <p className="text-sm">{q.data.unique} unieke bezoekers</p>}<Button asChild variant="outline" size="sm"><a href="/dashboard/assets">Statistieken</a></Button></section>;
}

export function UpcomingDashboardWidget({ title }: { title: string }) {
  return <section className="acrylic-card flex min-w-0 flex-col gap-4 p-5"><h2 className="flex items-center gap-2 text-sm"><LockKeyhole className="size-4" />{title}</h2><p className="font-display text-2xl">Coming soon</p></section>;
}