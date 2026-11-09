# Homepage: single-flow refresh

> Follow-up: Selected work now uses Dice UI Masonry. See [masonry verification](masonry-verification.md). The checks below describe the preceding single-column version.

## Direction and scope

The approved follow-up replaces the split desktop panels with one document flow:
**introduction → all seven projects → experience → contact**. About, Gallery,
shared navigation, theme preferences, and existing repository work are preserved.

The initial design direction was **The quiet instrument**, seed **1112998872**.
The user's subsequent single-flow editorial composition overrides that sheet's
narrow column and earlier two-panel brief. No new random direction or decorative
motion was introduced.

Idea: Gustam's actual engineering interfaces become a scrollable work collection,
not a tabbed preview. The live interaction is opening project and experience details;
it uses native disclosures and also works without JavaScript.

Subject inventory: F1 scheduling, weather forecasts, East Side Canary, SwiftUI
landmarks, the News API, Spotify listening history, VB.NET inventory management,
Erajaya, and the Ministry of Finance. Only the existing content and screenshots
were used. No stock/generated imagery, sample achievements, or attribution needed.

Page argument:
- Introduction identifies Gustam and his interests; existing biography is the proof.
- Work shows what he builds; ten original screenshots across seven projects are the proof.
- Experience lists employers, roles, and dates; full original contributions remain expandable.
- Contact provides existing destinations, without a misleading Spotify home link.

## Implementation

- Removed homepage panels, tabs, viewport locking, and independent scroll containers.
- Enlarged the introduction; the first project's screenshots begin in the first viewport.
- Rendered every project on the server, with a summary and expandable full description.
- Preserved screenshot proportions, paired app screens, and an honest inventory fallback.
- Experience is a full-width list below its heading, with keyboard-operable details.
- Added the approved contact close. Rounded treatment remains on media, not content cards.
- Reused Manrope, neutral/blue theme tokens, contact links, and image error handling.
- No new dependency or browser-test framework was introduced.

## Verification performed

- `pnpm build`, `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check` passed.
- Production browser checked in Chrome at **1440, 768, 390, and 320px**, both themes.
- **60 focused browser assertions passed**: document scrolling, seven visible projects,
  correct section order, no nested scroll areas, no horizontal overflow, loaded and
  undistorted screenshots, first-project visibility, all project/experience disclosures
  via keyboard, focus retention, asset-error fallback, reduced motion, skip link,
  server-rendered content and native disclosures without JavaScript, and no runtime
  or hydration errors. About/Gallery received overflow and heading regression checks.
- Before screenshots: `.taste-skill/single-flow-before/`.
- Production screenshots and reports: `.taste-skill/single-flow/`; additional screenshots,
  regression views, and assertion results: `.taste-skill/single-flow/checks/`.
  These local artifacts are ignored by git. Screenshots were visually reviewed.
- Design source inspection: **0 FAIL**, four pre-existing wording warnings retained
  because existing descriptions remain the content source.
- Production visual inspector: **0 FAIL** in both themes, with explicit `still-page`
  and `no-footage` allowances: the approved minimalist portfolio does not need
  decorative motion or unrelated footage. Light has one `grey-body` warning for
  intentionally secondary study/date text; primary copy uses full ink and the
  secondary contrast measured above WCAG AA. Dark has no remaining warnings.
- A source-inspector exception marks the 1px visually hidden theme label: it is an
  accessibility technique, not a decorative divider.

## Final visual critique

ROUND 2

Seen in one second: Gustam's name and software-engineering role, followed by real app screens.

Idea: Actual engineering interfaces become an openly browsable work collection.

Live thing: Native project and experience disclosures.

Layout words by section: intro=statement / work=media sequence / experience=ledger / contact=close.

Scores (self-critique): design 7.5 · usability 8 · creativity 7 · content 7.5 → overall 7.6.

Caps applied: decorative-motion requirements are intentionally waived by the brief.

Top three observations:
1. The first pass left the experience list isolated on the right; it now spans the page
   below its heading (desktop ending and mobile sheet).
2. The previous East Side Canary summary was grammatically incomplete; corrected to
   “A real estate website” while retaining its underlying description.
3. Phone screenshots are smaller on 320px screens, deliberately paired and contained,
   never stretched or cropped. All seven projects make the page long; this is the
   approved trade-off for not hiding projects behind tabs.

Microinteraction diagnostic: 9/10. Triggers, current states, keyboard access, immediate
feedback, proportional feedback, and visible modes pass. Adaptive long-term behavior
is deliberately absent: these disclosures do not need onboarding or changing rules.

## Remaining limits

Not tested in Safari/Firefox, on physical devices, or with a screen reader. Existing
biographical/date inconsistencies were not reinterpreted. Inventory screenshots are
still missing, and the previously dead Spotify deployment remains unlinked. External
site availability was not rechecked for this layout-only follow-up.
