# ROUT repository import

## Homepage and About refinement
- [x] Review OriginKit, Kokonut UI, Bklit UI, Awwwards MCP and fluid/shader references; use Anime.js rather than installing overlapping kits or copying shaders.
- [x] Refine black-only homepage with Anime.js reveals and original fluid-inspired GLSL ribbons in the existing interactive globe scene.
- [x] Improve shared About reading hierarchy, navigation contrast and identity artwork; preserve standard light/dark theme and distinct developer pages.
- [x] Verify 320/390/791/1280 px layouts, actual WebGL readiness, link-to-QR navigation, reduced motion and About dark mode; 11 docs tests passed with no browser runtime errors.

## Studio usability
- [x] Connect Widgets folder and remove nested widget controls from Links and components; add NL/EN/FR/DE labels.
- [x] Keep fallback Inbox, Pinboard and Badges below the profile block grid.
- [x] Preserve intrinsic label widths in scrolling tracks, including labels wider than a phone screen.
- [x] Animate committed selections without hover interception; remove duplicate link-input cavity and reduce QR preview framing while retaining scan-safe contrast.
- [x] Float shared documentation search within page gutters; checked at 320, 390 and 1280 px.
- [x] Make profile-menu workspace switching tap-accessible with an inline list and swipe support; restyle Layers and account settings surfaces.
- [x] Run 21 focused tests; browser-check public documentation and real QR rendering plus isolated tabs/Layers controls at mobile/desktop sizes without runtime errors.
- [ ] Verify logged-in Widgets, saved profile ordering, account settings and workspace switching end-to-end: blocked by unavailable authenticated ROUT session (Studio remains at secure session check).

## Google Wallet upgrade
- [x] Save the four requested Google Wallet settings securely.
- [x] Upgrade Google card background, safe-area logo, artwork and front-face fields; preserve owner-only issuance.
- [x] Test payload, artwork, signing and access boundaries (28 tests passed).
- [ ] Verify real-user Wallet issuance: blocked by missing authenticated session and unverified Google issuer access; published artwork origin must serve the new routes.
- [ ] Immutable object-storage caching and updates of already-saved Google passes require verified storage/provider access; versioned render URLs are available now.

- [x] Compare all repository files: none missing; two necessary Studio compatibility corrections retained, so source is not byte-identical.
- [x] Connect Neon and validate the existing rout_app role without changing database permissions or records.

- [x] Import application source and visual assets without repository metadata or secrets.
- [x] Install source dependencies and preserve managed project setup.
- [x] Check public scrolling and platform menus on desktop and phone; account destinations remain unverified.
- [x] Run relevant imported tests (23 passed) and inspect preview errors (build OK).
- [x] Record import results and external-service limitations.
## Full audit (Nov 2026 request)
- [x] Workspace switch buttons: hard navigation after cookie set, error toast when unavailable, double-tap guard.
- [ ] Full UI check phone/tablet/desktop (logged-in screens blocked without ROUT session).
- [ ] Translation audit: all buttons, popups, hidden labels in NL/EN/FR/DE (button style panel done; ~90 screens still contain fixed Dutch text).
- [x] Wallet card "move your phone": only switches from touch/mouse to motion once the sensor really reports; otherwise a translated notice.
- [ ] Developer console audit end-to-end.
- [ ] Cloud console + Login with ROUT consent prompt polish; email matching with editable email setting.
- [x] Tours: removed premature anonymous-question/guestbook explanations (NL/EN/FR/DE).
- [ ] Tours: add new tours where useful.
- [ ] Re-read everything after the above and continue on remaining weak spots.
- [x] Favicon/app icons: bunny logo, transparent outside, all sizes.
