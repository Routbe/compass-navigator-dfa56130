import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CalendarDays, Check, Copy, Globe, HandCoins, Heart, MessageCircleQuestion, Radio, Share2, Wallet, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { RoutCardDialog } from "@/components/wallet/RoutCardDialog";
import { cn } from "@/lib/utils";

export const SHARE_TARGETS = [
  { id: "hub", path: "", icon: Globe },
  { id: "ask", path: "/ask", icon: MessageCircleQuestion },
  { id: "donate", path: "/donate", icon: Heart },
  { id: "tip", path: "/tip", icon: HandCoins },
  { id: "booking", path: "/booking", icon: CalendarDays },
  { id: "live", path: "/live", icon: Radio },
] as const;
export type ShareTargetId = (typeof SHARE_TARGETS)[number]["id"];

export function shareTargetUrl(origin: string, handle: string, id: ShareTargetId): string {
  const target = SHARE_TARGETS.find((t) => t.id === id) ?? SHARE_TARGETS[0];
  return `${origin.replace(/\/$/, "")}/${encodeURIComponent(handle)}${target.path}`;
}

/** Pick one public page, then share it through the native sheet (or copy it). */
export function ShareWidget({ handle }: { handle: string | null | undefined }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ShareTargetId>("hub");
  const [copied, setCopied] = useState(false);
  const url = handle && typeof window !== "undefined" ? shareTargetUrl(window.location.origin, handle, selected) : "";

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(t("shareWidget.copied"));
    window.setTimeout(() => setCopied(false), 1600);
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: t(`shareWidget.${selected}`), url }); return; } catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    await copy();
  };

  return (
    <section className="acrylic-card flex min-w-0 flex-col gap-4 p-5" aria-labelledby="share-widget-title">
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <Share2 className="h-3.5 w-3.5" aria-hidden /> {t("shareWidget.eyebrow")}
      </span>
      <h2 id="share-widget-title" className="font-display text-2xl leading-tight">{t("shareWidget.title")}</h2>
      {handle ? (
        <>
          <div role="radiogroup" aria-label={t("shareWidget.title")} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SHARE_TARGETS.map(({ id, icon: Icon }) => {
              const active = id === selected;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelected(id)}
                  className={cn(
                    "flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    active ? "border-foreground bg-foreground text-background" : "border-border bg-background/40 text-foreground hover:border-foreground/40",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="min-w-0 truncate">{t(`shareWidget.${id}`)}</span>
                </button>
              );
            })}
          </div>
          <p className="truncate rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground" title={url}>{url.replace(/^https?:\/\//, "")}</p>
          <div className="flex gap-2">
            <Button type="button" className="min-h-11 flex-1 gap-2" onClick={() => void share()}>
              <Share2 className="h-4 w-4" aria-hidden /> {t("shareWidget.share")}
            </Button>
            <Button type="button" variant="outline" className="min-h-11 gap-2" onClick={() => void copy()} aria-label={t("shareWidget.copy")}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{t("shareWidget.noHandle")}</p>
      )}
    </section>
  );
}

/** Opens the ROUT card as a popup; the full manager lives on /wallet. */
export function CardWidget({ handle }: { handle: string | null | undefined }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <section className="acrylic-card flex min-w-0 flex-col p-5">
      <button type="button" disabled={!handle} onClick={() => setOpen(true)} className="group flex flex-1 flex-col text-left disabled:opacity-60">
        <span className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="flex items-center gap-2"><Wallet className="h-3.5 w-3.5" aria-hidden /> {t("cardWidget.eyebrow")}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
        <span className="mt-4 font-display text-2xl leading-tight">{t("cardWidget.title")}</span>
        <span className="mt-1.5 text-sm text-muted-foreground">{handle ? t("cardWidget.hint") : t("walletPage.noHandle")}</span>
      </button>
      <Link to="/wallet" className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{t("cardWidget.manage")}</Link>
      {handle ? <RoutCardDialog open={open} onOpenChange={setOpen} handle={handle} /> : null}
    </section>
  );
}
