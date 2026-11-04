# ROUT repository import

## Studio usability
- [ ] Connect Widgets folder and remove widgets from Links and components; add NL/EN/FR/DE labels.
- [ ] Keep fallback Inbox, Pinboard and Badges below the profile block grid.
- [ ] Prevent mobile studio label overlap in every supported language.
- [ ] Remove indicator interaction lag and simplify link input and QR preview framing.
- [ ] Float the shared documentation search bar within page gutters.
- [ ] Make workspace switching tap-accessible with an inline list; restyle Layers studio.
- [ ] Run focused tests and browser verification; report any authenticated-access blocker.

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