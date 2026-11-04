import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/middleware";

/** Private owner read: never requires enabling public music visibility. */
export const getDashboardMusic = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(async ({ context }) => {
  const { nowPlaying, spotifyConfigured } = await import("./spotify-presence.server");
  if (!spotifyConfigured()) return { playing: false, reason: "not_configured" };
  try { return await nowPlaying(context.userId); }
  catch { return { playing: false, reason: "unavailable" }; }
});

/** Fixed provider endpoints only. No GPS, arbitrary URL, stored location or public visibility. */
export const getDashboardWeather = createServerFn({ method: "POST" }).middleware([requireAuth])
  .inputValidator((input: unknown) => z.object({ city: z.string().trim().min(2).max(80).regex(/^[\p{L}\p{N} .,'’-]+$/u) }).parse(input))
  .handler(async ({ data }) => {
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({ name: data.city, count: "1", language: "en", format: "json" })}`, { signal: AbortSignal.timeout(8000) });
      if (!geo.ok) return { ok: false as const, error: "provider_unavailable" };
      const locations = z.object({ results: z.array(z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), name: z.string(), country: z.string().optional() })).optional() }).parse(await geo.json());
      const location = locations.results?.[0];
      if (!location) return { ok: false as const, error: "city_not_found" };
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: "temperature_2m,weather_code,wind_speed_10m", timezone: "auto" })}`, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) return { ok: false as const, error: "provider_unavailable" };
      const weather = z.object({ current: z.object({ temperature_2m: z.number(), weather_code: z.number(), wind_speed_10m: z.number(), time: z.string() }) }).parse(await response.json());
      return { ok: true as const, city: location.name, country: location.country ?? "", ...weather.current };
    } catch { return { ok: false as const, error: "provider_unavailable" }; }
  });