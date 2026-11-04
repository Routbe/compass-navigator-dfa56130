import { useEffect, useState } from "react";
import { renderStoryCard } from "@/lib/qa/story-card";
import { storyFile, supportsStoryShare } from "@/lib/qa/native-share";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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

type Platform = "snapchat" | "instagram" | "whatsapp" | "more";
const PLATFORMS: Platform[] = ["snapchat", "instagram", "whatsapp", "more"];
const GUIDE_KEY = "rout.shareGuideSeen.";

/** Pick one public page, then share it as a story image with a tappable link. */
export function ShareWidget({ handle }: { handle: string | null | undefined }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ShareTargetId>("hub");
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [guide, setGuide] = useState<Platform | null>(null);
  const [step, setStep] = useState(0);
  const url = handle && typeof window !== "undefined" ? shareTargetUrl(window.location.origin, handle, selected) : "";

  // Render the story image ahead of time so the OS share stays inside the user's tap.
  useEffect(() => {
    if (!handle || !url) return;
    let live = true;
    setFile(null);
    renderStoryCard({ kind: "prompt", prompt: t(`shareWidget.story.${selected}`), handle, displayName: null, avatarSrc: null, hint: t("shareWidget.storyHint"), sendMe: t(`shareWidget.${selected}`), link: url.replace(/^https?:\/\//, "") })
      .then((b) => { if (live) setFile(storyFile(b, `rout-${selected}.png`)); })
      .catch(() => undefined);
    return () => { live = false; };
  }, [handle, url, selected, t]);

  const copyLink = async (silent = false) => {
    try { await navigator.clipboard.writeText(url); } catch { return; }
    setCopied(true);
    if (!silent) toast.success(t("shareWidget.copied"));
    window.setTimeout(() => setCopied(false), 1600);
  };
  const download = () => {
    if (!file) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file); a.download = file.name; a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  const shareImage = async (withText: boolean) => {
    if (file && supportsStoryShare(file)) {
      try {
        await navigator.share(withText ? { files: [file], text: `${t(`shareWidget.story.${selected}`)} ${url}` } : { files: [file] });
        return;
      } catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    if (navigator.share) { try { await navigator.share({ url }); return; } catch (e) { if ((e as Error).name === "AbortError") return; } }
    download();
  };
  const run = async (p: Platform) => {
    if (p === "snapchat") {
      void copyLink(true);
      // Snapchat attaches the URL as a tappable link on the snap.
      window.open(`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (p === "instagram") { await copyLink(true); toast.success(t("shareWidget.linkReady")); await shareImage(false); return; }
    await shareImage(p === "whatsapp" || p === "more");
  };
  const pick = (p: Platform) => {
    if ((p === "snapchat" || p === "instagram") && !localStorage.getItem(GUIDE_KEY + p)) { setStep(0); setGuide(p); return; }
    void run(p);
  };
  const steps = guide ? (t(`shareWidget.guide.${guide}.steps`, { returnObjects: true }) as string[]) : [];
  const finishGuide = () => {
    if (!guide) return;
    localStorage.setItem(GUIDE_KEY + guide, "1");
    const p = guide; setGuide(null); void run(p);
  };

  return (
    <section className="acrylic-card flex min-w-0 flex-col gap-4 p-5" aria-labelledby="share-widget-title">
      <h2 id="share-widget-title" className="font-display text-2xl leading-tight">{t("shareWidget.title")}</h2>
      {handle ? (
        <>
          <div role="radiogroup" aria-label={t("shareWidget.title")} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SHARE_TARGETS.map(({ id, icon: Icon }) => {
              const active = id === selected;
              return (
                <button key={id} type="button" role="radio" aria-checked={active} onClick={() => setSelected(id)}
                  className={cn("flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                    active ? "border-foreground bg-foreground text-background" : "border-border bg-background/40 text-foreground hover:border-foreground/40")}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="min-w-0 truncate">{t(`shareWidget.${id}`)}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 py-1 pl-3 pr-1">
            <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground" title={url}>{url.replace(/^https?:\/\//, "")}</p>
            <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => void copyLink()} aria-label={t("shareWidget.copy")}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2" aria-label={t("shareWidget.shareTo")}>
            {PLATFORMS.map((p) => (
              <button key={p} type="button" onClick={() => pick(p)} disabled={p !== "snapchat" && !file}
                className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background/40 px-1 text-xs transition-colors hover:border-foreground/40 disabled:opacity-50">
                {p === "more" ? <Share2 className="h-5 w-5" aria-hidden /> : <span className="font-display text-base leading-none" aria-hidden>{p === "snapchat" ? "👻" : p === "instagram" ? "◎" : "✆"}</span>}
                <span className="max-w-full truncate">{t(`shareWidget.platform.${p}`)}</span>
              </button>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{t("shareWidget.tappableNote")}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{t("shareWidget.noHandle")}</p>
      )}
      <Dialog open={guide !== null} onOpenChange={(o) => { if (!o) setGuide(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="text-center font-display text-xl">{guide ? t(`shareWidget.guide.${guide}.title`) : ""}</DialogTitle>
          <DialogDescription className="sr-only">{t("shareWidget.tappableNote")}</DialogDescription>
          <div className="flex justify-center gap-2" aria-hidden>
            {steps.map((_, i) => (
              <span key={i} className={cn("grid h-8 w-8 place-items-center rounded-full text-sm font-semibold transition-colors", i === step ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>{i + 1}</span>
            ))}
          </div>
          <div key={step} className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-muted/60 animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="absolute h-16 w-16 animate-ping rounded-full bg-foreground/10" aria-hidden />
            <span className="relative font-display text-5xl" aria-hidden>{step + 1}</span>
          </div>
          <p className="min-h-12 text-center text-base font-medium" aria-live="polite">{steps[step]}</p>
          <Button type="button" className="min-h-12 w-full" onClick={() => (step < steps.length - 1 ? setStep(step + 1) : finishGuide())}>
            {step < steps.length - 1 ? t("shareWidget.guide.next") : t("shareWidget.guide.go")}
          </Button>
        </DialogContent>
      </Dialog>
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
