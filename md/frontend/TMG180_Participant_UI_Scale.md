# TMG180 — participant portal UI scale

**Status: build to this.** Settled 18 August 2026 (Jiten). Every participant screen built or modified from now on uses this type scale and card treatment. Where a Figma frame specifies a different scale — several use a 48px page title, 32px section headings and 24px card headings — **the scale below wins**: the frames were drawn one at a time, and following each literally makes the portal read as several different products. Frame *structure*, *copy* and *colour intent* still come from Figma; only the type ramp and card chrome are normalised here.

The reference implementation is [`apps/web/src/pages/participant/DailyLogList.jsx`](../../apps/web/src/pages/participant/DailyLogList.jsx). When in doubt, open it.

## Type ramp

| Role | Classes | Notes |
| --- | --- | --- |
| Page title (h1) | `text-3xl font-bold text-slate-900` | One per screen. Never gradient-filled. |
| Page intro | `text-base text-slate-600 mt-2 max-w-2xl` | The sentence under the title. |
| Section heading (h2) | `text-xl font-semibold text-slate-900` | "Frequently Asked Questions", "Need more help?", empty-state headings. |
| Card heading | `text-lg font-semibold text-slate-900` | The title inside a card or list row. |
| Card body | `text-sm text-slate-600 leading-relaxed` | `text-base` only for a standalone prose block. |
| Secondary / meta | `text-sm text-slate-500` | Dates, times, counts under a heading. |
| Micro | `text-xs text-slate-500` | Row metadata, footnotes. |
| Field label | `text-sm text-slate-600 mb-2` | Above an input. |
| Overline label | `text-[10px] uppercase tracking-wide text-slate-400` | "GOALS LINKED", "APPROVED". |
| Chip / badge | `text-xs font-semibold px-3 py-1 rounded-full` | Status colours below. |

## Cards, buttons, colour

```
card          bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
card hover    hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow
primary btn   bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700
secondary btn bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 hover:bg-slate-50
icon tile     w-11 h-11 rounded-xl bg-brand-50 text-brand-600
page width    max-w-238 mx-auto flex flex-col gap-6   (gap-8 on a spacious screen)
```

- **Chrome is uniform; accent colour comes from the frame.** Card background, radius, padding and shadow are identical everywhere. Within that, take icon and tile colours from the Figma frame — several screens colour an icon per topic on a shared tile (Help Centre: `#0058be` profile, `#005f40` evidence, `#005f40` exports, `#2170e4` directory on `#dce9ff`), and a frame may tint one card that carries a notice (Help Centre's Privacy & Sharing: `#eff4ff → #e5eeff` with a white tile). That is the design distinguishing content, not decoration — keep it. Default to `brand-600` on `brand-50` only where the frame gives no colour.
- **The brand ramp is green** (28 Aug 2026, Jiten). It lives entirely in `apps/web/src/index.css` under `@theme` — `--color-brand-50` through `--color-brand-900`. Every step is the hue swap of the purple it replaced at the same lightness, so weight and contrast are unchanged (`brand-600` on white was 8.72:1, is now 8.78:1). The purple-family Tailwind palettes (`purple-*`, `violet-*`, `fuchsia-*`, one `pink-*`) were folded into this ramp in the same pass and must not come back: a colour that is not `brand-*`, a status colour, or a frame's own accent hex does not belong in a class name. Changing the theme again is that one block.
- **Green now means two things, and that is the live risk.** `emerald` is the status colour for submitted/approved and the brand is green too, so a decorative `brand-50`/`brand-700` tag chip and an `emerald-50`/`emerald-700` status chip read alike on the same card. Where a screen shows both, prefer a neutral (`slate`) for the decorative chips so the only meaningful green is the status one.
- **Status colours only where they mean something**: emerald = submitted/approved, amber = draft, indigo = locked, rose = error. Never decorative.
- **Radius** is `rounded-xl` for cards and `rounded-full` for pills, chips and buttons. The `rounded-3xl`/`rounded-4xl` treatment belongs to the Figma-faithful form screens (the daily log form, snapshot review) and should not spread.

## States every screen needs

Loading, error and empty are part of the screen, not extras — `DailyLogList.jsx` has all three:

```jsx
{isLoading && <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">…</div>}
{error && <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">…</div>}
{items?.length === 0 && <div className="bg-white/80 rounded-xl p-12 text-center …">…</div>}
```

## Controls with no backend

Render them where the frame puts them, visibly inactive, with one line saying so — never fake data, and never a live-looking control that does nothing. Current examples: the daily log's writing helper, the snapshot review's "Help me review this", share links and the access audit log on Snapshot Exports, and "Contact support" on the Help Centre.

## Applied so far

`DailyLogList.jsx` (reference) · `ParticipantHelpCentre.jsx`. The snapshot trio (`MonthlySnapshotList`, `MonthlySnapshotReview`, `MonthlySnapshotSummary`) and `SnapshotExports` were built Figma-faithful on 18 Aug and still carry frame-scale headings in places — normalise them the next time they are touched.

**The worker workspace builds to the same ramp** (brief §7 decision 6, taken in practice from 19 Aug — Jiten's call still owed on renaming this doc "TMG180 UI scale"): `WorkerDashboard` · `Calendar` · `ParticipantsISupport` · `WorkerDailyLogList` · `WorkerDailyLogDetail` · `ApprovedSnapshots` · `WorkerSnapshotDetail`. Two worker-specific notes from the snapshot screens: a person's **name wraps, never truncates** in a card header (Gaps §5 asks worker views to use names rather than numbering people, and a clipped name is halfway back to an id), and a filter row mixing `Select` with a static field needs `min-h-12.5` on the static one or its label floats above the others.
