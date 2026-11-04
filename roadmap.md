# ROUT repository import

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