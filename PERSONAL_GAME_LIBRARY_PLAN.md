# APP-001 — Personal Video Game Library & Collection Organizer

> Greenfield implementation plan. Sources: the product request dated 2026-09-21 and the structure in `C:/Users/carlb/Downloads/_TEMPLATE.md`.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | APP-001 |
| **Section** | Core Product — Personal Collection Management |
| **Severity** | BLOCKER — the product has no useful first release without this capability |
| **Markets** | Consumer web; individual collectors and players |
| **Status (today)** | MISSING / greenfield |
| **Estimated effort** | XL (10–12 weeks for an MVP with two engineers plus part-time design/QA; longer if vendor procurement or review queues are material) |
| **Owner (proposed)** | Web Product Team |
| **Depends on** | No external feature; internal workstreams FOUND-001, AUTH-001, and DATA-001 are sequenced in §13 |
| **Unblocks** | CSV import, third-party catalog enrichment, collection statistics, lending reminders, sharing, and recommendations |
| **Target release** | Private beta, followed by a measured public MVP |

### Planning assumptions

1. The application is a new responsive web app, not a feature inside an existing codebase.
2. Each account owns a private, isolated library. Household libraries, public profiles, and collaboration are not part of the MVP.
3. Users enter game information manually. The MVP does not depend on a commercial game-catalog API.
4. The proposed implementation is a TypeScript web application backed by PostgreSQL and a standards-based managed identity provider. Equivalent technologies may be substituted without changing the product contract in this plan.
5. One library entry represents one game edition on one platform. A collector may deliberately keep multiple similar entries, so suspected duplicates produce a warning rather than a hard error.
6. Dates and money are stored without assuming a single country. Display formatting follows the user's locale.

---

## 1. Problem Statement

People who own games across several consoles, storefronts, physical formats, and subscription services often cannot answer basic questions such as “Do I already own this?”, “What should I play next?”, or “Which Switch games have I not finished?” A spreadsheet can hold the data, but it makes consistent entry, quick mobile lookup, compound filtering, and safe editing cumbersome. A private, searchable organizer will give each user a dependable inventory and backlog while creating a foundation for later import, statistics, and catalog-enrichment features.

## 2. Goals

- Let an authenticated user create, view, edit, trash, restore, and permanently remove only their own game entries.
- Let a user find a known item quickly through forgiving text search, useful filters, and predictable, stable sorting.
- Support the information collectors actually use—platform, edition, format, ownership state, play state, rating, progress, dates, price, tags, favorite status, and notes—without making initial entry burdensome.
- Deliver a responsive, keyboard-operable, screen-reader-friendly interface that works from 320 px mobile screens through large desktops.
- Establish secure, observable, maintainable foundations for future import, metadata enrichment, statistics, and sharing without requiring those features for MVP launch.

### Success measures for the beta

| Measure | Target | How measured |
|---|---:|---|
| First-session activation | At least 60% of new users create 5 entries within 7 days | Privacy-safe product event funnel |
| Core task success | At least 90% can add a game and later find it without assistance | Moderated usability test and beta survey |
| Findability | Median time to locate a known entry under 10 seconds in a 500-entry seeded library | Usability benchmark |
| Search quality | At least 95% recall for known-item searches across a curated, multilingual test collection | Repeatable search-quality evaluation set |
| Reliability | At least 99.9% monthly availability after GA | Synthetic checks and service metrics |
| Client errors | Fewer than 1% of library page views encounter an unhandled client error | Error telemetry |
| Accessibility | No critical or serious automated accessibility findings in core flows; all manual critical-path scripts pass | axe and assistive-technology QA |

These are launch-health indicators, not reasons to collect raw notes, game titles, or other unnecessary personal content in analytics.

## 3. Non-Goals

- Automatic game metadata, cover art, price, achievement, playtime, or ownership synchronization from console or storefront accounts.
- Social networking, follows, comments, likes, public profiles, public collection links, or collaborative/household libraries.
- Buying, selling, valuation, price alerts, marketplace listings, trades, or payment processing.
- Native iOS, Android, or desktop applications; the MVP is a responsive web application and may be installable as a basic PWA later.
- AI recommendations, generated summaries, semantic/vector search, or conversational collection management.
- Barcode scanning, optical character recognition, image uploads, or custom cover-art hosting.
- Automated lending reminders, push notifications, or email campaigns.
- Full offline-first behavior or multi-device conflict-free synchronization. Previously loaded UI may remain visible offline, but writes require a connection.
- Bulk CSV/JSON import, bulk editing, and bulk deletion in the MVP. A standards-friendly export is included for data portability; import is a follow-up.
- Advanced collection analytics, charts, value tracking, achievements, DLC inventories, hardware/accessory inventories, or per-session play logs.

## 4. Personas & User Stories

### Personas

| Persona | Needs | Pain today |
|---|---|---|
| **Alex, multi-platform collector** | A reliable inventory by platform, edition, and format; duplicate awareness | Purchases duplicates and cannot remember which edition is owned |
| **Sam, backlog planner** | Play state, progress, favorites, ratings, and filters that answer “what next?” | A long spreadsheet is difficult to use on a phone from the couch |
| **Jordan, casual player** | Very fast entry and a simple search box without mandatory collector detail | Existing catalog apps ask for too much information up front |
| **Riley, privacy- and accessibility-conscious user** | Private data, clear deletion/export controls, full keyboard and screen-reader use | Many collection tools are public by default or have inaccessible custom controls |
| **Morgan, support/operator** | Safe diagnostics and aggregate health signals without access to private notes | Data-isolation or search incidents are hard to investigate without structured telemetry |

### Account, onboarding, and ownership stories

- **US-001 (MUST):** As a new user, I want to create an account and sign in so that my library follows me across devices.
- **US-002 (MUST):** As a returning user, I want to remain signed in securely so that opening my library is quick.
- **US-003 (MUST):** As a user with no entries, I want a clear empty state and an “Add game” action so that I know how to begin.
- **US-004 (MUST):** As a privacy-conscious user, I want my library to be private by default so that strangers cannot view it.
- **US-005 (MUST):** As a user, I want to sign out from the current device so that a shared computer no longer exposes my library.
- **US-006 (MUST):** As a user, I want to export my data in a portable format so that I am not locked into the product.
- **US-007 (MUST):** As a user, I want to close my account and understand the deletion timeline so that I control my personal data.

### Entry lifecycle stories

- **US-008 (MUST):** As a casual player, I want to add a game with only a title and platform so that cataloging does not feel like work.
- **US-009 (MUST):** As a collector, I want to record edition, physical/digital format, ownership state, release year, and acquisition details so that similar copies remain distinguishable.
- **US-010 (MUST):** As a backlog planner, I want to record play state, rating, progress, hours played, and important dates so that I can decide what to play next.
- **US-011 (MUST):** As a collector, I want free-form notes and reusable tags so that I can capture information the standard fields do not cover.
- **US-012 (MUST):** As a user, I want useful defaults and inline validation so that I can save a valid entry quickly.
- **US-013 (MUST):** As a user, I want a warning about a likely duplicate without being blocked so that intentional duplicate editions remain possible.
- **US-014 (MUST):** As a user, I want to open an entry and see all its saved details so that I can verify what I own.
- **US-015 (MUST):** As a user, I want to edit an entry and know that my changes were saved so that the library stays accurate.
- **US-016 (MUST):** As a user editing stale data on two devices, I want a conflict warning instead of silent overwriting so that newer changes are not lost.
- **US-017 (MUST):** As a user, I want to mark or unmark a favorite directly from the library so that I can curate a short list quickly.
- **US-018 (MUST):** As a user, I want to move an entry to trash after a clear confirmation so that accidental deletion is recoverable.
- **US-019 (MUST):** As a user, I want to restore an entry from trash so that I can reverse a mistake.
- **US-020 (MUST):** As a user, I want to permanently delete a trashed entry immediately if I do not want to wait for automatic purging.

### Search, filter, and sorting stories

- **US-021 (MUST):** As a user, I want to search by title, edition, platform, and tag so that I can locate an item from the words I remember.
- **US-022 (MUST):** As a user, I want search to ignore capitalization and diacritics so that minor typing differences do not hide a match.
- **US-023 (MUST):** As a user, I want a useful no-results state that preserves my query and offers a reset or add action so that I can recover quickly.
- **US-024 (MUST):** As a collector, I want to filter by one or more platforms so that I can browse a console-specific shelf.
- **US-025 (MUST):** As a backlog planner, I want to filter by play state and completion range so that I can find unfinished games.
- **US-026 (MUST):** As a collector, I want to filter by ownership state and physical/digital format so that I can distinguish owned, borrowed, lent, sold, subscription, and wishlist items.
- **US-027 (MUST):** As a user, I want to filter by rating, favorite status, release-year range, date-added range, and tags so that I can narrow a large library precisely.
- **US-028 (MUST):** As a user, I want filters from different categories combined with AND and selections inside a category combined with OR so that results are predictable.
- **US-029 (MUST):** As a user, I want to see active filters as removable chips and clear all filters in one action so that I understand why items are hidden.
- **US-030 (MUST):** As a user, I want result and total counts so that I know how much of my collection I am viewing.
- **US-031 (MUST):** As a user, I want to sort by title, date added, last updated, rating, release year, and platform in relevant directions so that I can inspect the library from different perspectives.
- **US-032 (MUST):** As a user, I want sorting to remain stable and put missing values consistently at the end so that rows do not jump unpredictably.
- **US-033 (MUST):** As a user, I want search, filters, sort, page, and view reflected in the URL so that refresh, Back, Forward, and bookmarks preserve context.
- **US-034 (MUST):** As a returning user, I want my default grid/list view, page size, and preferred sort remembered so that the library opens the way I like it.

### Browsing, resilience, and accessibility stories

- **US-035 (MUST):** As a visual browser, I want a compact grid view with strong metadata cues even when no cover art exists so that scanning is pleasant.
- **US-036 (MUST):** As a detail-oriented collector, I want a sortable list view with clear columns so that I can compare entries efficiently.
- **US-037 (MUST):** As a mobile user, I want search, filters, sorting, viewing, and editing to work without horizontal scrolling so that I can check my library in a store.
- **US-038 (MUST):** As a keyboard user, I want to complete every core flow with a visible focus indicator and logical focus order so that a mouse is unnecessary.
- **US-039 (MUST):** As a screen-reader user, I want controls, validation errors, result updates, and status changes announced meaningfully so that the interface is understandable.
- **US-040 (MUST):** As a user with low vision, I want the interface to reflow at 200% zoom and honor contrast and reduced-motion preferences so that content remains usable.
- **US-041 (MUST):** As a user on an unreliable connection, I want failed saves to retain my entered form values and offer Retry so that I do not have to retype data.
- **US-042 (MUST):** As a user, I want loading indicators that do not shift the page dramatically so that the interface feels stable.
- **US-043 (MUST):** As a user, I want stale-but-visible library results during a brief refresh failure, with a clear warning, so that a temporary outage is less disruptive.
- **US-044 (MUST):** As an operator, I want request IDs, structured errors, and service health signals so that failures can be diagnosed without logging private entry content.

### Deferred stories

The following are intentionally recorded but excluded from the MVP: save and name arbitrary filter views; bulk-select and edit entries; import a CSV; scan a barcode; enrich entries from a third-party game catalog; attach cover art; share a read-only collection; manage household members; track lending reminders; and receive AI recommendations. They require separate plans and must not silently expand APP-001.

## 5. Functional Requirements

The terms **MUST**, **SHOULD**, and **MAY** are used as normative requirement levels.

### 5.1 Identity, authorization, and library isolation

- **FR-1.** The system MUST require an authenticated session for every application page and `/api/v1` endpoint except health checks and the identity-provider callback endpoints.
- **FR-2.** The system MUST derive the user identity from the verified server-side session; it MUST NOT accept a client-supplied `userId` as authority.
- **FR-3.** Every entry, tag, preference, export, restore, and deletion query MUST be scoped to the authenticated user before reading or mutating data.
- **FR-4.** Requests for another user's resource MUST return `404 Not Found`, rather than reveal that the resource exists with `403 Forbidden`.
- **FR-5.** A new user MUST receive an empty private library and default preferences without a separate library-creation step.
- **FR-6.** The system MUST support first-time account provisioning/sign-in, sign-out, provider-owned account recovery, and persistent database-backed sessions with a 24-hour idle timeout and a 30-day absolute maximum unless the approved identity threat model chooses stricter values.
- **FR-7.** The system SHOULD allow the user to review active sessions and revoke other sessions if the chosen identity provider supports it.
- **FR-8.** The web application MUST NOT expose a public collection route in the MVP.

### 5.2 Entry creation, viewing, and editing

- **FR-9.** A user MUST be able to create an entry with only `title` and `platformId`; `playStatus` MUST default to `unplayed`, `ownershipStatus` to `owned`, `mediaFormat` to `unknown`, and `favorite` to `false`.
- **FR-10.** The create and edit forms MUST support all user-editable fields defined for `game_entries` in §8 and MUST clearly distinguish required from optional fields; server-owned IDs, normalized/search fields, versions, lifecycle fields, and timestamps MUST NOT be editable.
- **FR-11.** Input MUST be normalized by trimming leading/trailing Unicode whitespace and converting blank optional strings to `null`; meaningful internal whitespace MUST be preserved.
- **FR-12.** Validation MUST run on both client and server, and the server MUST be authoritative.
- **FR-13.** Validation errors MUST identify the field, provide a human-readable resolution, and preserve all valid input. After a failed submission, focus MUST move to a concise error summary whose links move focus to each invalid field; the interface MUST NOT skip the summary by focusing a field first.
- **FR-14.** A saved entry MUST be visible in the current query when it matches that query; otherwise the success message MUST explain that active filters may hide it and offer “View entry” and “Clear filters.”
- **FR-15.** An entry-detail page MUST display every populated user-visible field, plus created and last-updated timestamps; internal IDs, normalized/search values, and lifecycle machinery stay hidden unless needed for support. Empty optional fields MUST be omitted or labeled consistently rather than displayed as misleading zero values.
- **FR-16.** A user MUST be able to edit any active entry they own and cancel without persisting changes.
- **FR-17.** Updates MUST use optimistic concurrency through a monotonically increasing `version`. A stale `If-Match` update MUST return `412 Precondition Failed` with the current ETag and enough owner-authorized state to begin conflict recovery; it MUST NOT silently overwrite the newer version.
- **FR-18.** The conflict UI MUST let the user review the current saved values, copy their unsaved values, reload the latest version, and intentionally reapply changes.
- **FR-19.** Toggling `favorite` from the library MUST provide immediate visual feedback and revert with an error message if the server write fails.
- **FR-20.** Create requests carrying the same valid `Idempotency-Key` for the same user and body within 24 hours MUST produce at most one entry.
- **FR-21.** The system MUST write `createdAt`, `updatedAt`, and `version` on the server; clients MUST NOT set authoritative audit fields.
- **FR-22.** The system MUST detect a likely duplicate among the user's active entries using normalized title, effective platform key, and normalized edition. The effective platform key is the stable platform ID for a named platform and the normalized custom platform label when `Other` is selected. The system MUST warn before save but MUST allow an explicit “Save anyway” action.
- **FR-23.** The duplicate warning MUST link to the suspected entries and MUST NOT include trashed entries unless the user chooses to inspect trash.
- **FR-24.** The supported platform list MUST include common current and legacy platforms plus `Other`. Choosing `Other` MUST require a custom platform label.
- **FR-25.** A disabled platform MUST remain attached to existing entries and visible in their details and filters, but it MUST NOT be offered for new entries unless re-enabled.
- **FR-26.** The system MUST enforce the following validation contract.

| Field | Rule |
|---|---|
| `title` | Required; 1–200 Unicode grapheme clusters after trimming |
| `platformId` | Required; must reference an active known platform, or `Other` with `customPlatformName` |
| `customPlatformName` | Required only for `Other`; 1–80 Unicode grapheme clusters |
| `edition` | Optional; at most 120 Unicode grapheme clusters |
| `releaseYear` | Optional integer from 1950 through the current calendar year + 5 |
| `playStatus` | One of `unplayed`, `playing`, `paused`, `completed`, `abandoned` |
| `ownershipStatus` | One of `owned`, `wishlist`, `borrowed`, `lent`, `subscription`, `sold_traded` |
| `mediaFormat` | One of `physical`, `digital`, `streaming`, `unknown` |
| `rating` | Optional integer 1–5 |
| `completionPercent` | Optional integer 0–100 |
| `hoursPlayed` | Optional decimal 0–999999.9 with at most one fractional digit |
| `purchasePriceMinor` | Optional integer 0–999999999 in the smallest currency unit; currency is required when price is set |
| `purchaseCurrency` | Valid uppercase ISO 4217 code |
| `purchaseDate`, `startedOn`, `completedOn` | Optional ISO calendar dates; future dates require explicit acknowledgement through §9.5; if both play dates exist, `completedOn` cannot precede `startedOn` |
| `acquiredFrom` | Optional; at most 160 Unicode grapheme clusters |
| `notes` | Optional plain text; at most 10,000 Unicode grapheme clusters; rendered as text, never raw HTML |
| `tags` | At most 20 per entry; each is 1–40 Unicode grapheme clusters; case- and diacritic-insensitive uniqueness per user |

Play status, completion percentage, hours, and play dates are user-reported facts and MUST NOT silently update one another. Combinations such as `completed` with less than 100% or `playing` with a historical completion date are allowed because completion criteria and replay behavior vary; only the explicit date-order rule above is invalid.

### 5.3 Search

- **FR-27.** The library MUST provide one text-search control with a clear accessible label and a visible clear action when non-empty.
- **FR-28.** Search MUST match the authenticated user's active entries across title, edition, platform display/custom name, and tag names. Acquired-from text and private notes are deliberately excluded from MVP search so likely-private fragments are not encouraged as URL search terms.
- **FR-29.** Matching MUST be case-insensitive and diacritic-insensitive. The final word token MUST support prefix matching. Tokens containing meaningful punctuation (for example `C++`, `F-Zero`, or `NieR:Automata`) MUST also use a safely escaped normalized literal-substring path so punctuation is not discarded or interpreted as query syntax.
- **FR-30.** After normalization, all query tokens MUST occur somewhere in the searchable projection for an entry, though different tokens may match different fields. Relevance MUST rank exact normalized title, title prefix, title substring, then edition/platform/tag matches, with text-search rank and immutable entry ID as deterministic tie-breakers.
- **FR-31.** The client MUST debounce typing for 250–350 ms, cancel superseded requests, and prevent an older response from replacing a newer result set.
- **FR-32.** Search input MUST accept 1–100 characters after trimming. An empty query MUST behave as no search; an overlong query MUST produce a validation response rather than being silently truncated.
- **FR-33.** Search MUST compose with every filter, sort, page-size, and view option. Changing the query MUST reset only the page number to 1, while preserving the other compatible options.
- **FR-34.** A no-results state MUST show the retained query, summarize active filters, provide “Clear search,” “Clear all filters,” and “Add game,” and MUST NOT claim that the game does not exist outside the user's library.

### 5.4 Filtering and facets

- **FR-35.** The user MUST be able to filter active entries by one or more platforms, play statuses, ownership statuses, media formats, and tags.
- **FR-36.** The user MUST be able to filter by favorite (`all`, `favorites`, `not favorites`), rating range, completion range, release-year range, date-added range, and date-updated range.
- **FR-37.** Values selected within one filter category MUST be combined with OR; non-empty categories MUST be combined with AND; the search query MUST be combined with the resulting filter expression using AND.
- **FR-38.** Facet counts MUST reflect the current search and all other active filter categories while excluding the facet's own selection, so users can see useful alternative counts.
- **FR-39.** Filter options with zero matching results SHOULD remain visible but disabled when doing so explains the current query; currently selected values MUST never disappear.
- **FR-40.** Active filters MUST appear as individually removable chips outside the filter panel, and the interface MUST provide a single “Clear all” action.
- **FR-41.** Applying or removing filters MUST reset pagination to the first page but MUST preserve search, sort, page size, and view mode.
- **FR-42.** Invalid, unknown, or unauthorized filter values in the URL MUST be ignored safely, reported in a non-blocking message, and removed when the URL is canonicalized.
- **FR-43.** Range filters MUST validate that the lower bound is not greater than the upper bound and MUST expose inclusive-bound semantics in help text. Date-added and date-updated bounds are inclusive local calendar dates in the user's saved time zone and are converted to an inclusive start and exclusive next-day UTC interval without losing daylight-saving transitions.
- **FR-44.** Trash MUST be a separate view and MUST NOT be mixed into active-entry filter results.

### 5.5 Sorting, views, pagination, and URL state

- **FR-45.** The system MUST support `title` ascending/descending, `dateAdded` newest/oldest, `updatedAt` newest/oldest, `rating` high/low, `releaseYear` newest/oldest, `platform` A–Z/Z–A, and `relevance` when a search is active. Relevance has one descending best-match-first order; an ascending relevance request is invalid.
- **FR-46.** The default sort MUST be title A–Z when there is no query and relevance when there is a query, unless the user has explicitly stored another compatible preference.
- **FR-47.** All sorts MUST be deterministic. Equal primary values MUST use normalized title and then entry ID as ascending tie-breakers. Null rating, release year, and date values MUST sort last in either direction.
- **FR-48.** Title and platform sorting MUST use the launch locale's pinned, case-insensitive, numeric-aware database collation so that `Game 2` sorts before `Game 10`; adding a locale with materially different collation requires a compatible indexed sort strategy before that locale is declared supported.
- **FR-49.** The library MUST offer grid and list views. Both MUST expose title, platform, play status, ownership state, favorite state, and primary entry actions without relying on cover art.
- **FR-50.** At desktop widths, list view MUST be a semantic table whose supported sortable column headers expose `aria-sort`; at narrow widths it MUST render an equivalent semantic list controlled by the global Sort control. Grid view is always a semantic list. Switching structures MUST preserve query state and useful focus context.
- **FR-51.** The API and UI MUST support page sizes of 25, 50, and 100, with 25 as the default, numbered pagination, a result-range label, and a total matching count.
- **FR-52.** Search, filter values, sort, direction, page, page size, and view mode MUST be encoded in canonical URL query parameters. Refresh, copied URLs, browser Back, and browser Forward MUST restore the same state.
- **FR-53.** The server MUST render or validate the initial query state so that a deep link does not flash unfiltered private data before applying filters.
- **FR-54.** View mode, page size, and explicit default sort MUST be stored as per-user preferences and synchronized across devices. A URL value MUST override a stored preference for that visit.
- **FR-55.** A result count MUST distinguish “N matching” from “N total,” and count updates MUST be announced politely to assistive technology without announcing on every keystroke before results settle.

### 5.6 Trash, portability, and account lifecycle

- **FR-56.** Deleting an active entry MUST be a soft delete that sets `deletedAt`, removes it from active results immediately, and places it in Trash for 30 days.
- **FR-57.** The delete action MUST require an explicit confirmation naming the game and distinguishing platform/edition when available. After confirmation, the interface MAY additionally offer a short Undo action, but Undo does not replace confirmation.
- **FR-58.** Trash MUST show the scheduled purge date and allow the owner to restore an entry without changing its ID, fields, or creation timestamp.
- **FR-59.** Restoring a likely duplicate MUST warn but MUST be allowed. Restored entry-tag links MUST remain connected; a tag-cleanup operation MUST never delete a tag referenced by either an active or trashed entry.
- **FR-60.** A user MUST be able to permanently delete one trashed entry after a second confirmation. Permanent deletion MUST be irreversible from the product UI.
- **FR-61.** A scheduled job MUST permanently purge entries 30 days after `deletedAt`. Purging MUST be idempotent and MUST remove orphaned entry-tag links.
- **FR-62.** A user MUST be able to select and request a versioned UTF-8 CSV bundle or JSON export containing all active and trashed entries, tag names, preferences, and timestamps but excluding internal authentication secrets and telemetry identifiers. The CSV option is a ZIP containing `manifest.json`, fixed-column `entries.csv`, and `preferences.csv`; `tags_json` is a compact JSON array inside one RFC 4180 cell. After normal CSV escaping, a text cell beginning with `=`, `+`, `-`, `@`, tab, or carriage return is prefixed with an ASCII apostrophe and that transformation is documented in the manifest; JSON is the lossless original-text format.
- **FR-63.** Export generation MUST be authorized at request, status, and download time. The UI receives an authenticated application download path, not a reusable object-store URL; the application rechecks ownership and then streams the file or issues a bearer object URL valid for no more than 60 seconds. Generated files and object URLs MUST never enter logs/referrers and files MUST expire within 24 hours.
- **FR-64.** Account closure MUST require recent authentication and explicit confirmation, revoke application sessions and provider-issued app refresh grants promptly, mark the local account `deletion_pending`, and block normal sign-in during deletion. Application-owned content, idempotency rows, export jobs/files, and the local identity link MUST be deleted within 30 days; the app cannot delete an unrelated provider-wide identity and MUST say so. After completion, a later sign-in with the same provider subject creates a new empty local account. Content-free security audit records may remain for their documented 90-day basis only after the direct user FK/mapping is removed; encrypted backups age out under the backup-retention policy.
- **FR-65.** Every entry mutation MUST return the resulting entry version or a terminal deletion status and MUST use consistent structured errors. Preference updates return the resulting preference representation; best-effort product telemetry never changes mutation success.

## 6. Non-Functional Requirements

### Performance

| Area | Target |
|---|---|
| Library/search API | p50 ≤ 150 ms and p95 ≤ 400 ms server time for a user with 10,000 entries, 50-item page, and any supported indexed sort/filter combination |
| Entry read/write API | p95 ≤ 300 ms for reads and ≤ 500 ms for creates/updates/deletes, excluding identity-provider latency |
| Facet API | p95 ≤ 500 ms for 10,000 entries and all supported facet groups |
| Initial library load | p75 LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 on a representative mid-tier mobile device over a simulated 4G connection |
| Client bundle | Initial authenticated-library JavaScript SHOULD remain under 250 KiB gzip, excluding framework/runtime chunks shared across routes; regressions require review |
| Pagination payload | A 100-entry response MUST remain under 512 KiB for entries at maximum ordinary field sizes; notes SHOULD be summarized in list payloads |
| Export | 10,000 entries SHOULD complete within 60 seconds and MUST NOT hold an HTTP worker open for the full job |

Performance tests will use realistic title/tag distributions and worst-supported sort/filter combinations, not only empty or uniform data.

### Security

- Use a maintained OIDC/OAuth 2.1-compatible identity provider. Sessions MUST use `Secure`, `HttpOnly`, and appropriate `SameSite` cookies, rotate after authentication, and be invalidated at sign-out/account closure.
- Enforce authorization in the service/repository layer for every operation and require PostgreSQL row-level security as defense in depth. UI hiding alone is never authorization.
- Validate and bound every string, number, enum, query array, page size, and identifier on the server. Parameterize all database access.
- Render notes and user-entered labels as plain text. If rich text is introduced later, it requires a separate sanitization threat model.
- Protect state-changing browser requests from CSRF; set a restrictive Content Security Policy, `frame-ancestors`, MIME-sniffing protection, HSTS, and `Referrer-Policy: no-referrer` on every authenticated page and API response in production.
- Apply per-user and per-IP rate limits described in §9, audit repeated authorization failures, and redact session tokens, raw notes, prices, and search strings from logs.
- Store production secrets in a managed secret store, rotate them, and prevent secrets from entering client bundles, source control, traces, or error payloads.
- Complete an OWASP ASVS Level 2–aligned review and test the relevant OWASP Top 10 classes before GA.

### Privacy & compliance

- The library is private by default. The product MUST collect only account, library, preference, and operational data required for the stated functions.
- Provide clear privacy notice, data export, account closure, retention, and support-contact paths suitable for GDPR/UK GDPR and applicable US state privacy requirements. Legal counsel must confirm final wording and regional obligations before GA.
- Do not place raw titles, tags, acquired-from values, notes, prices, or free-text searches in product analytics. Edge, CDN, load-balancer, application, error-reporting, and trace configurations MUST strip query strings before logging; aggregate counts and coarse performance dimensions are sufficient. Browser history still contains an intentionally URL-persisted search query and the privacy help text MUST disclose that fact.
- Encrypt traffic with TLS 1.2 or better and use provider-managed encryption at rest for the database, backups, and temporary exports.
- Default retention: active data until user deletion; trash 30 days; generated exports 24 hours; security logs 30–90 days according to documented need; database backups no longer than 35 days.
- FERPA and COPPA are not product assumptions because the app is not an education service and is not directed to children. If the intended audience changes, age handling and consent require a new review.

### Accessibility

- All MVP UI MUST conform to WCAG 2.2 AA, including keyboard operation, visible focus, semantics, labels, error association, contrast, reflow, target size, reduced motion, and status announcements.
- Use native HTML controls wherever possible. Custom comboboxes, dialogs, menus, and multi-selects require keyboard and screen-reader tests against their applicable ARIA Authoring Practices patterns.
- Core flows MUST be manually verified with keyboard only, Windows screen reader plus Chromium, and macOS/iOS screen reader plus Safari before GA.
- No critical information may depend solely on color, hover, animation, spatial position, or an icon without an accessible name.

### Scalability

- Initial design target: 100,000 registered users, 10,000 active entries per user, 5 million total active entries, and 100 sustained API requests/second with 5× short bursts.
- Partitioning is not required initially. Queries MUST begin with `user_id` and use the indexes in §8. Table partitioning by hash of `user_id` may be introduced only after measured need.
- Stateless application instances MUST support horizontal scaling. Sessions, rate-limit counters, export jobs, and feature flags MUST not depend on process memory.
- Lists MUST always paginate; the normal API MUST never return an entire large collection in one response.

### Reliability

- GA target is 99.9% monthly availability for authenticated CRUD and browse operations, excluding announced maintenance and upstream identity-provider outages.
- PostgreSQL MUST have automated backups and point-in-time recovery with RPO ≤ 15 minutes and RTO ≤ 4 hours, plus a documented quarterly restore test.
- Create idempotency, optimistic concurrency, transactional tag updates, and idempotent deletion/export jobs MUST prevent common retry-related corruption.
- A failed analytics, email, or telemetry dependency MUST NOT block library reads or writes.
- The app MUST keep the last successfully loaded results during a transient refresh failure when such results exist, clearly label them stale, and offer Retry; it MUST NOT claim an unsaved mutation succeeded.

### Observability

- Emit structured logs with timestamp, environment, severity, service, route template, status, duration, request ID, trace ID, anonymized actor key, deployment version, and error code. Do not log private field values.
- Measure request volume/error/duration by route, database pool saturation, slow-query count, auth failures, rate-limit decisions, search zero-result rate, mutation conflicts, duplicate-warning overrides, export-job age, purge-job failures, and client error rate.
- Trace web request → service → database/job calls using OpenTelemetry-compatible context. Sample successful traffic and retain all error traces subject to privacy limits.
- Alert on SLO burn, elevated 5xx rate, p95 latency regression, database saturation, failed backups, stalled exports, overdue trash purges, and cross-user authorization-test canary failure.
- Dashboards and runbooks MUST link alerts to a specific owner and immediate diagnostic steps.

### Maintainability

- Use strict TypeScript, shared request/response schemas, a formatter, linter, unit test runner, and CI checks. Domain logic MUST not be duplicated between pages and route handlers.
- Keep identity, collection domain, search/query construction, persistence, and UI components in explicit modules. Repository methods MUST require an actor/user scope.
- Database migrations MUST be forward-only, reviewed, repeatable in a blank environment, and verified against a production-like snapshot before release.
- New requirements MUST map to tests and documentation. Public API changes MUST update the OpenAPI contract in the same change.

### Internationalization

- Externalize user-visible strings from the first release even if only English ships initially.
- Use BCP 47 locale tags, locale-aware display formatting, ISO 8601 date exchange, IANA time-zone identifiers, and ISO 4217 currency codes. Collection title/platform order uses the pinned English-launch collation in FR-48 until a separately indexed locale is declared supported.
- Store date-only facts such as purchase dates as SQL `date`, not midnight timestamps. Store event timestamps in UTC and format them in the user's selected or browser time zone.
- UI layouts MUST tolerate at least 30% text expansion, and form logic MUST not infer number/date formats without locale-aware parsing.

### Browser and device compatibility

- Support the latest two stable major versions of Chrome, Edge, Firefox, and Safari at release time, plus current iOS Safari and Android Chrome.
- Core functions MUST remain usable at 320 CSS px width, at 200% browser zoom, and with touch, mouse, and keyboard input.
- Unsupported browsers MUST receive a clear message rather than a blank page; server APIs remain standards-based.

### Backward compatibility

- Apply expand/migrate/contract database changes so the previously deployed application can run during rollout and rollback.
- Do not remove an API field or enum value within `/api/v1`; additive fields are allowed and clients MUST ignore unknown response fields.
- A future breaking API change requires `/api/v2`, a documented migration window, usage telemetry that contains no private content, and deprecation communication.

## 7. Acceptance Criteria

Each criterion is expected to map to at least one automated test. The parenthetical label names the minimum suite: **U** unit, **I** integration, **E2E** browser end-to-end, **SEC** security, **A11Y** accessibility, or **PERF** performance.

### Authentication and isolation

- **AC-1 (E2E/I; FR-1, FR-5).** *Given* a signed-out visitor, *when* they request a library page or API route, *then* they are sent through the sign-in flow and no private library payload is rendered or returned.
- **AC-2 (SEC/I; FR-2–FR-4).** *Given* Alice and Bob have different accounts and Bob owns an entry, *when* Alice submits Bob's entry ID to read, update, delete, restore, export, or tag endpoints, *then* the response is the same `404` shape as an unknown ID and Bob's data is unchanged.
- **AC-3 (E2E; FR-5).** *Given* a newly created account, *when* the user opens `/library`, *then* the page shows a private empty state, “Add your first game,” and no setup task is required.
- **AC-4 (E2E/I; FR-6).** *Given* a valid signed-in session, *when* the user signs out, *then* the session can no longer access a protected page or API response.

### Create and view

- **AC-5 (E2E/I; FR-9).** *Given* a blank create form, *when* the user enters `Hades` and selects `Nintendo Switch`, then saves, *then* exactly one entry is created with the documented defaults and appears after a full reload.
- **AC-6 (E2E/I; FR-10, FR-26).** *Given* valid values in every supported field, *when* the user saves, *then* each normalized value, tag, date, price, and status round-trips without data loss.
- **AC-7 (U/I/E2E; FR-11–FR-13, FR-26).** *Given* a whitespace-only title, an absent platform, or an out-of-range field, *when* the form is submitted, *then* no entry is created, valid values remain, focus moves to an error summary, and activating a summary link moves focus to its invalid field.
- **AC-8 (I/E2E; FR-24).** *Given* `Other` is the selected platform, *when* the custom platform label is empty, *then* save is rejected; *when* a valid custom label is supplied, *then* it is stored and displayed as the platform name.
- **AC-9 (E2E; FR-16).** *Given* a dirty create form, *when* the user cancels and confirms discard, *then* no entry is created and the collection is unchanged.
- **AC-10 (I/E2E; FR-22–FR-23).** *Given* an active entry whose normalized title, effective platform key, and edition match a proposed entry—including two `Other` platforms with equivalent custom labels—*when* the proposal is checked, *then* the existing item is linked in a warning; the user can cancel or explicitly save a second entry.
- **AC-11 (I; FR-22).** *Given* otherwise similar games on different platforms or with different editions, *when* either is saved, *then* the system permits the distinct entry without a false hard error.
- **AC-12 (E2E; FR-14–FR-15).** *Given* a saved entry containing some empty optional fields, *when* its detail page opens, *then* all populated fields and audit timestamps are accurate and empty fields are not presented as zero-valued facts.
- **AC-13 (I; FR-20).** *Given* two identical create requests from one user with the same valid `Idempotency-Key`, *when* retries reach the server within 24 hours, *then* both responses identify the same single entry; reusing that key for a different body returns `409`.

### Edit, favorites, and concurrency

- **AC-14 (E2E/I; FR-16, FR-21).** *Given* an existing entry, *when* the user changes only its play status and saves, *then* unrelated fields remain unchanged, `updatedAt` advances, and `version` increments once.
- **AC-15 (E2E; FR-16).** *Given* a dirty edit form, *when* the user cancels and confirms discard, *then* the saved entry retains its earlier values.
- **AC-16 (I/E2E; FR-17–FR-18).** *Given* the same version is open in two sessions, *when* session A saves and session B later saves its stale form, *then* session B receives a conflict view, A's values remain authoritative, and B can copy or reapply its preserved draft.
- **AC-17 (E2E/I; FR-19).** *Given* an active entry, *when* the user toggles Favorite and the request succeeds, *then* the new state persists; *when* the request fails, *then* the UI reverts and announces the failure.
- **AC-18 (E2E; FR-14).** *Given* an active filtered view that the edited entry no longer matches, *when* save succeeds, *then* the item leaves that result set and the success message explains why rather than appearing as an unexplained disappearance.

### Search

- **AC-19 (I/E2E; FR-28–FR-30).** *Given* entries titled `Pokémon Violet`, `Pokemon Pinball`, and `Violet`, *when* the user searches `pokemon violet`, *then* the first entry matches regardless of case/diacritics, the second and third do not satisfy all tokens, and exact-title relevance wins when available.
- **AC-20 (I; FR-28).** *Given* one query token appears in a title and another appears in its platform, tag, or edition, *when* both tokens are searched, *then* the entry matches because tokens may occur across searchable fields; text found only in Notes or Acquired from does not match in MVP.
- **AC-21 (SEC/I; FR-29, FR-32).** *Given* entries whose searchable fields contain `C++`, `F-Zero`, `NieR:Automata`, apostrophes, emoji, or right-to-left text, *when* their corresponding literal terms are searched, *then* the entries match safely; `%`, `_`, `*`, quotes, HTML, and script text are treated only as bounded content and never as executable query syntax.
- **AC-22 (E2E; FR-31).** *Given* slow query A followed by fast query AB, *when* A's response arrives last, *then* AB's results remain displayed and the settled count is announced only for AB.
- **AC-23 (E2E; FR-33).** *Given* a query, active filters, and a chosen sort, *when* the user clears only search, *then* filters and sort remain applied and page resets to 1.
- **AC-24 (E2E/A11Y; FR-34).** *Given* a non-empty library and a query with no matches, *when* results settle, *then* the search-specific no-results state safely displays the query and offers Clear search, Clear all filters, and Add game without describing the entire library as empty.

### Filters, facets, and sorting

- **AC-25 (I/E2E; FR-35, FR-37).** *Given* Switch, PC, and PlayStation entries in multiple play states, *when* Switch and PC plus Completed are selected, *then* results are `(Switch OR PC) AND Completed`.
- **AC-26 (I/E2E; FR-36, FR-43).** *Given* rated, unrated, complete, and partially complete entries on inclusive numeric/date boundaries—including a daylight-saving transition in the user's saved time zone—*when* ranges are applied, *then* boundary values match exactly once and missing values do not match unless an explicit missing-value option applies.
- **AC-27 (I/E2E; FR-38).** *Given* active filters in several categories, *when* facet counts load, *then* each category's alternatives reflect the search and all other categories but exclude that category's own selection.
- **AC-28 (E2E; FR-39–FR-40).** *Given* selected facet values that now have zero alternatives, *when* results update, *then* each selected value remains visible as a removable chip and Clear all removes filters without clearing search or sort.
- **AC-29 (I/E2E; FR-42).** *Given* a URL containing valid and invalid filter parameters, *when* the page opens, *then* valid values apply, invalid values disclose no data or error internals, and the canonical URL no longer contains them.
- **AC-30 (U/I/E2E; FR-45–FR-48).** *Given* titles `Game 2` and `Game 10`, tied values, accented text, and missing optional sort values, *when* each supported sort and direction is used, *then* the pinned launch collation applies natural order, ties remain deterministic, and missing values remain last in both directions.
- **AC-31 (E2E; FR-46).** *Given* an active search using relevance sort, *when* the query is cleared, *then* relevance becomes unavailable and the view uses the documented compatible default.

### View, pagination, and navigation state

- **AC-32 (E2E/A11Y; FR-49–FR-50).** *Given* a populated library, *when* the user switches between grid and list, *then* the same result set and query state remain, focus moves predictably, and both views expose the required metadata and actions.
- **AC-33 (I/E2E; FR-51).** *Given* 126 matching entries and a page size of 50, *when* pages are traversed without concurrent mutations, *then* ranges are 1–50, 51–100, and 101–126 with no duplicate or omitted IDs and an accurate total.
- **AC-34 (E2E; FR-41, FR-51).** *Given* the user is on a later page, *when* search, filter, sort, or page size changes, *then* the page resets to the first valid page and never leaves a blank orphan page.
- **AC-35 (E2E; FR-52–FR-54).** *Given* search, filters, sort, page, page size, and view state, *when* the user reloads, bookmarks, copies the URL, or uses Back/Forward after viewing an entry, *then* the same valid state is restored without a flash of unfiltered data.
- **AC-36 (E2E/I; FR-54).** *Given* saved list/page-size/sort preferences and an explicit URL override, *when* the library opens, *then* the URL wins for that visit without silently replacing unrelated saved defaults.

### Trash, export, and account lifecycle

- **AC-37 (E2E/I; FR-56–FR-57).** *Given* an active entry, *when* the user confirms moving the named item to Trash, *then* it immediately leaves active detail, list, search, facets, and counts while remaining visible only to its owner in Trash.
- **AC-38 (E2E/I; FR-58–FR-59).** *Given* a retained trashed entry, *when* the owner restores it, *then* the same ID, created timestamp, fields, and tags return; a likely active duplicate produces a warning but does not block intentional restore.
- **AC-39 (I/E2E; FR-60).** *Given* a trashed entry, *when* the user passes the second confirmation for permanent deletion, *then* its `game_entries`, `entry_search`, and `entry_tags` rows are physically absent, it is excluded from exports, and it cannot be read or restored through product endpoints.
- **AC-40 (I; FR-61).** *Given* an entry whose `deletedAt` is more than 30 days old, *when* the purge job runs twice, *then* the entry and join records are absent and the second run succeeds without error or unrelated deletion.
- **AC-41 (I/E2E; FR-62–FR-63).** *Given* an authorized CSV or JSON export request, *when* the job completes, *then* the documented versioned schema contains that user's active/trashed data only, tags and trash fields follow the defined encoding, download authorization is rechecked by the app, and neither another account nor an expired path/object can download it.
- **AC-42 (SEC/I; FR-64).** *Given* a user has not recently authenticated, *when* account closure is requested, *then* reauthentication is required; after confirmation, sessions/grants are revoked, normal sign-in is blocked while pending, all promised rows/files are removed by the 30-day deadline, retained audit rows no longer have a direct user mapping, and a post-completion sign-in creates an empty local account.

### Failure handling, responsiveness, and accessibility

- **AC-43 (I/E2E; FR-20, FR-65).** *Given* a network timeout after a create or edit submission, *when* the user retries, *then* entered values remain available, no false success is shown, create idempotency prevents a duplicate, and an edit retry still honors the current version precondition.
- **AC-44 (E2E/A11Y).** *Given* a keyboard-only user at 320 px width or 200% zoom, *when* they sign in, add, edit, search, filter, sort, paginate, trash, restore, and sign out, *then* every action is operable, focus is visible and logical, and no core content requires horizontal page scrolling.
- **AC-45 (A11Y).** *Given* a screen-reader user, *when* validation fails, results settle, a save succeeds/fails, a conflict occurs, or an entry is trashed/restored, *then* an accurate, non-repetitive announcement is provided and focus is moved only where the workflow requires.
- **AC-46 (E2E).** *Given* a transient refresh failure after results were loaded, *when* the request fails, *then* the previous results remain visible, are explicitly marked stale, and have a Retry action; a failed mutation is never represented as saved.
- **AC-47 (PERF).** *Given* a representative 10,000-entry account with long notes, varied tags, nulls, duplicate sort keys, and Unicode titles, *when* the performance suite exercises every supported query family, *then* §6 latency, payload, and interaction budgets pass.
- **AC-48 (E2E/PERF; US-042).** *Given* a throttled initial load and a search/filter refresh, *when* skeletons and results render, *then* reserved dimensions prevent disruptive layout movement and the measured layout-shift budget in §6 passes.
- **AC-49 (I/E2E; US-001–US-002, FR-6).** *Given* a user signs in and closes the browser, *when* they return within the valid idle/absolute session window, *then* the protected session resumes securely; after either timeout or explicit sign-out, reauthentication is required.
- **AC-50 (I/E2E; FR-26).** *Given* a valid but future purchase, start, or completion date, *when* the user first submits without acknowledgement, *then* the server returns `FUTURE_DATE_CONFIRMATION_REQUIRED`, affected field paths, and a short-lived acknowledgement token bound to the user and normalized request; resubmitting unchanged values with that token may save, while a changed/expired/cross-user token is rejected.
- **AC-51 (SEC/I; FR-62).** *Given* a title, tag, or note beginning with spreadsheet formula characters, *when* a CSV export is produced and opened as data, *then* the cell cannot execute as a formula, while the JSON export preserves the original text.
- **AC-52 (I/E2E; FR-25).** *Given* an existing entry references a now-disabled platform, *when* its detail, edit, or relevant filter view opens, *then* the platform remains accurately displayed and selectable as the current value but is unavailable for a different new entry.
- **AC-53 (I/E2E; §9.6).** *Given* a write is rate-limited, *when* the server returns `429` with `Retry-After`, *then* the full draft remains, the UI explains when Retry becomes available, repeated automatic submission stops, and one deliberate retry after the window can succeed without duplication.
- **AC-54 (I/E2E; §15.1).** *Given* enrollment is off, writes are disabled, exports are disabled, or background jobs are paused, *when* an affected user opens the app, *then* server and UI enforce the same mode, preserve every safe read/export alternative, clearly identify unavailable actions, and reconcile queued work before normal operation resumes.
- **AC-55 (U/I/E2E; FR-26).** *Given* play status, completion percent, and dates are independently meaningful, *when* unusual combinations are saved, *then* the system does not silently rewrite them; however, a `completedOn` earlier than `startedOn` is rejected with a field-linked validation error.

## 8. Data Model

### 8.1 Storage conventions

- PostgreSQL is the system of record. IDs are database- or server-generated UUIDs; event timestamps use `timestamptz`; date-only facts use `date`.
- Evolving status fields use `text` plus named `CHECK` constraints rather than database enum types, allowing expand/migrate/contract changes without destructive enum operations.
- User-entered text is stored in its original case. Separate normalized values support matching and uniqueness without changing display text.
- User-facing length limits count Unicode grapheme clusters in a shared client/server library; database `char_length` checks are higher safety ceilings, not a competing definition. Normalized fields use `text`, are never truncated, and are produced by one versioned NFKD → case-fold → combining-mark-removal → whitespace-normalization routine shared by writes and queries.
- Every user-owned table includes `user_id` directly, even when derivable through a parent, so composite foreign keys and row-level security can prevent cross-account relationships.
- All schema names below are proposed because no application repository or migration convention exists yet.

### 8.2 Tables

#### `users`

| Column | Type / constraints | Purpose |
|---|---|---|
| `id` | `uuid` PK | Internal stable user identifier |
| `identity_subject` | `text NOT NULL UNIQUE` | Stable issuer-qualified subject from the identity provider; never accepted from the browser |
| `email` | `citext NULL` | Contact/recovery address when provided and allowed by the identity provider |
| `display_name` | `varchar(100) NULL` | Optional account display name |
| `locale` | `varchar(35) NOT NULL DEFAULT 'en-US'` | BCP 47 display locale |
| `time_zone` | `varchar(64) NOT NULL DEFAULT 'UTC'` | IANA time-zone name |
| `account_status` | `text NOT NULL DEFAULT 'active' CHECK (...)` | `active`, `deletion_pending`, or `disabled` |
| `deletion_requested_at` | `timestamptz NULL` | Starts account-deletion retention clock |
| `audit_actor_token` | `uuid NOT NULL UNIQUE` | Random non-identity audit correlation token; mapping disappears with the user row |
| `created_at`, `updated_at` | `timestamptz NOT NULL` | Server audit timestamps |

Authentication accounts, sessions, and verification tokens follow the selected identity adapter's separate schema. Application code does not store passwords.

#### `platforms`

| Column | Type / constraints | Purpose |
|---|---|---|
| `id` | `uuid` PK | Stable platform key |
| `slug` | `varchar(80) NOT NULL UNIQUE` | Stable API value, including reserved `other` |
| `display_name` | `varchar(100) NOT NULL` | Localizable display label key/source label |
| `manufacturer` | `varchar(100) NULL` | Optional grouping metadata |
| `sort_order` | `smallint NOT NULL DEFAULT 0` | Curated display order |
| `is_active` | `boolean NOT NULL DEFAULT true` | Available for new entries |
| `created_at`, `updated_at` | `timestamptz NOT NULL` | Audit timestamps |

The table is seeded with common PC, console, handheld, mobile, and legacy platforms using reviewed deterministic UUIDs so environments and imports agree. Existing references survive deactivation. The `other` row is never deleted; its display label is only a UI prompt, while each entry stores its own custom label.

#### `game_entries`

| Column | Type / constraints | Purpose |
|---|---|---|
| `id` | `uuid` PK | Entry identity |
| `user_id` | `uuid NOT NULL FK users(id) ON DELETE CASCADE` | Tenant owner |
| `title` | `text NOT NULL CHECK (char_length(title) <= 800)` | Display title; service enforces 200 grapheme clusters |
| `normalized_title` | `text NOT NULL` | Versioned normalized title for duplicate detection/search/sorting |
| `platform_id` | `uuid NOT NULL FK platforms(id)` | Required platform |
| `custom_platform_name` | `text NULL CHECK (char_length(custom_platform_name) <= 320)` | Required by service/trigger only for `other`; service limit 80 graphemes |
| `normalized_custom_platform_name` | `text NULL` | Normalized custom label; null for named platforms |
| `effective_platform_key` | `text NOT NULL` | `platform:<uuid>` or `custom:<normalized label>` for duplicates/facets |
| `edition` | `text NULL CHECK (char_length(edition) <= 480)` | Edition/version/region text; service limit 120 graphemes |
| `normalized_edition` | `text NULL` | Duplicate-detection form; blank is stored as null |
| `release_year` | `smallint NULL CHECK (release_year BETWEEN 1950 AND 2200)` | App applies current-year + 5 bound |
| `play_status` | `text NOT NULL DEFAULT 'unplayed' CHECK (...)` | Allowed values from FR-26 |
| `ownership_status` | `text NOT NULL DEFAULT 'owned' CHECK (...)` | Allowed values from FR-26 |
| `media_format` | `text NOT NULL DEFAULT 'unknown' CHECK (...)` | Allowed values from FR-26 |
| `rating` | `smallint NULL CHECK (rating BETWEEN 1 AND 5)` | Personal rating |
| `completion_percent` | `smallint NULL CHECK (completion_percent BETWEEN 0 AND 100)` | Manual progress |
| `hours_played` | `numeric(8,1) NULL CHECK (hours_played BETWEEN 0 AND 999999.9)` | Manual playtime |
| `favorite` | `boolean NOT NULL DEFAULT false` | Quick curation flag |
| `purchase_date` | `date NULL` | Acquisition/purchase date |
| `purchase_price_minor` | `bigint NULL CHECK (purchase_price_minor BETWEEN 0 AND 999999999)` | Price in minor currency unit |
| `purchase_currency` | `char(3) NULL` | ISO 4217 code; paired with price |
| `acquired_from` | `text NULL CHECK (char_length(acquired_from) <= 640)` | Store/person/source label; service limit 160 graphemes |
| `started_on`, `completed_on` | `date NULL` | Optional play dates |
| `notes` | `text NULL CHECK (char_length(notes) <= 40000)` | Plain text; service limit 10,000 grapheme clusters |
| `version` | `integer NOT NULL DEFAULT 1 CHECK (version > 0)` | Optimistic-concurrency token |
| `created_at`, `updated_at` | `timestamptz NOT NULL` | Server timestamps |
| `deleted_at` | `timestamptz NULL` | Trash/purge lifecycle |

Named checks require `btrim(title) <> ''`, every status to be in its FR-26 allowlist, `completed_on >= started_on` when both exist, and price/currency to be both present or both absent. Currency must match `^[A-Z]{3}$` and the service validates it against a pinned ISO 4217 dataset. A constraint trigger plus service validation require custom name/normalization only for the reserved `other` platform and require both to be null otherwise. A before-update trigger controls `updated_at` and increments `version` exactly once per logical entry mutation. A unique `(id, user_id)` key supports tenant-safe composite references. There is deliberately no uniqueness constraint across title/platform/edition because legitimate duplicates are allowed; duplicate comparison uses `effective_platform_key` and `COALESCE(normalized_edition, '')`.

#### `tags`

| Column | Type / constraints | Purpose |
|---|---|---|
| `id` | `uuid` PK | Tag identity |
| `user_id` | `uuid NOT NULL FK users(id) ON DELETE CASCADE` | Tenant owner |
| `name` | `text NOT NULL CHECK (char_length(name) <= 160)` | Case-preserving display name; service limit 40 graphemes |
| `normalized_name` | `text NOT NULL` | Versioned normalized unique form; never truncated |
| `created_at`, `updated_at` | `timestamptz NOT NULL` | Audit timestamps |

Named checks require a nonblank trimmed tag. `UNIQUE (user_id, normalized_name)` prevents tags such as `RPG` and `rpg` from fragmenting one user's filters. `UNIQUE (id, user_id)` supports tenant-safe composite references.

#### `entry_tags`

| Column | Type / constraints | Purpose |
|---|---|---|
| `user_id` | `uuid NOT NULL FK users(id) ON DELETE CASCADE` | Tenant owner |
| `entry_id` | `uuid NOT NULL` | Composite FK `(entry_id, user_id)` to `game_entries`, `ON DELETE CASCADE` |
| `tag_id` | `uuid NOT NULL` | Composite FK `(tag_id, user_id)` to `tags`, `ON DELETE CASCADE` |
| `created_at` | `timestamptz NOT NULL` | Audit timestamp |

Primary key `(entry_id, tag_id)`. The composite foreign keys make attaching another user's tag impossible even if an application authorization check regresses and make entry/account purge ordering safe. A tag can be deleted as orphaned only when no active or trashed `entry_tags` row references it.

#### `entry_search`

| Column | Type / constraints | Purpose |
|---|---|---|
| `entry_id` | `uuid` PK | One projection per entry; composite tenant FK to `game_entries`, `ON DELETE CASCADE` |
| `user_id` | `uuid NOT NULL FK users(id) ON DELETE CASCADE` | RLS and tenant-first search key |
| `normalized_title` | `text NOT NULL` | Exact/prefix/title-sort value |
| `normalized_platform` | `text NOT NULL` | Named or custom platform display value for search/sort |
| `normalized_edition` | `text NOT NULL DEFAULT ''` | Edition search value |
| `normalized_tags` | `text[] NOT NULL DEFAULT '{}'` | Attached tag values used to rebuild/search |
| `search_text` | `text NOT NULL` | Delimiter-safe normalized title/edition/platform/tag projection for literal/trigram matching |
| `search_document` | `tsvector NOT NULL` | Weighted word/prefix search projection |
| `is_deleted` | `boolean NOT NULL` | Keeps active/trash indexes correct |
| `normalization_version` | `smallint NOT NULL` | Identifies the shared normalization algorithm used for this projection |
| `updated_at` | `timestamptz NOT NULL` | Projection freshness evidence |

The entry service calls one database projection function inside the same transaction after create, editable searchable-field changes, tag replacement, trash, or restore. The function reads the owned entry, platform, and ordered tag set, then upserts `entry_search`; a failure rolls back the mutation. Platform display labels are immutable in normal administration for MVP; a label-change migration must rebuild affected projections and advance referenced entry versions/ETags before exposing the new label. Search uses PostgreSQL's `simple` text-search configuration and splits a normalized query into bounded tokens: safe word tokens use prefix-capable text search, punctuation-bearing tokens use an escaped literal/trigram comparison against `search_text`, and every token must match. Ranking follows FR-30 and is tested against fixed fixtures.

Custom platforms appear as individual facet values using their normalized label, sort by their display label, and do not collapse into one `Other` bucket. The API facet key is `platform:<uuid>` for named platforms and `custom:<base64url-encoded normalized label>` for custom values; the decoded value is length-bounded and always scoped to the authenticated user's rows.

#### `user_preferences`

| Column | Type / constraints | Purpose |
|---|---|---|
| `user_id` | `uuid` PK/FK users(id) ON DELETE CASCADE | One row per user |
| `library_view` | `text NOT NULL DEFAULT 'grid' CHECK (grid/list)` | Preferred view |
| `page_size` | `smallint NOT NULL DEFAULT 25 CHECK (25/50/100)` | Preferred page size |
| `default_sort` | `text NOT NULL DEFAULT 'title' CHECK (...)` | Preferred no-query sort |
| `default_direction` | `text NOT NULL DEFAULT 'asc' CHECK (asc/desc)` | Preferred direction |
| `updated_at` | `timestamptz NOT NULL` | Audit timestamp |

#### `idempotency_requests`

Uses `user_id FK users(id) ON DELETE CASCADE`, forced RLS, and `UNIQUE (user_id, route_key, idempotency_key)`. It stores a request-body hash, response status, the minimal response needed to replay safely, `created_at`, and `expires_at`. It MUST NOT cache authorization failures, nonterminal warning challenges, or sensitive free-form request bodies and is purged after 24 hours.

#### `export_jobs`

Uses `user_id FK users(id) ON DELETE CASCADE` and forced RLS. It contains `id`, format/schema version, status (`queued`, `running`, `complete`, `failed`, `expired`), private object key, safe error code, row count, `attempt_count`, `next_attempt_at`, `lease_owner`, `lease_until`, heartbeat, created/started/completed/expiry timestamps, and a version/status-transition check. A partial unique index on `user_id WHERE status IN ('queued','running')` permits one active export. Workers claim due jobs with a lease plus `FOR UPDATE SKIP LOCKED`, heartbeat while running, retry bounded transient failures, and return an expired lease to the queue. Object key is required only for a completed job and the private file is deleted on expiry or account closure.

#### `audit_events`

Contains an append-only ID, nullable `user_id FK users(id) ON DELETE SET NULL`, the random `audit_actor_token` copied from the user, event type, target type/ID, request ID, a 30-day-key-rotated HMAC network indicator where justified, small allowlisted metadata, and timestamp. It records security-sensitive events, exports, account closure, and mutation identifiers—not titles, notes, tags, prices, raw IPs, emails, search strings, cookies, request bodies, or response bodies. Required security audit/outbox rows are inserted in the same transaction as the mutation. Default retention is 90 days under a documented security basis; after account deletion there is no retained table mapping the random actor token back to the identity.

### 8.3 Indexes

Initial indexes, validated with `EXPLAIN (ANALYZE, BUFFERS)` against representative data:

```text
game_entries (user_id, created_at DESC, id) WHERE deleted_at IS NULL
game_entries (user_id, updated_at DESC, id) WHERE deleted_at IS NULL
game_entries (user_id, normalized_title, effective_platform_key, COALESCE(normalized_edition, ''), id) WHERE deleted_at IS NULL
game_entries (user_id, play_status, normalized_title, id) WHERE deleted_at IS NULL
game_entries (user_id, ownership_status, normalized_title, id) WHERE deleted_at IS NULL
game_entries (user_id, deleted_at DESC, id) WHERE deleted_at IS NOT NULL
entry_search (user_id, normalized_title COLLATE app_en_natural, entry_id) WHERE is_deleted = false
entry_search (user_id, normalized_platform COLLATE app_en_natural, normalized_title COLLATE app_en_natural, entry_id) WHERE is_deleted = false
GIN entry_search (user_id, search_document) WHERE is_deleted = false
GIN entry_search (user_id, search_text gin_trgm_ops) WHERE is_deleted = false
entry_tags (user_id, tag_id, entry_id)
idempotency_requests (expires_at)
UNIQUE export_jobs (user_id) WHERE status IN ('queued', 'running')
export_jobs (status, next_attempt_at, lease_until)
audit_events (user_id, created_at DESC)
```

`app_en_natural` is created from the pinned ICU locale `en-u-kn-true-ks-level1` with numeric, case/diacritic-insensitive behavior; both SQL expressions and indexes use that exact collation. Deployments check the recorded collation version and deliberately rebuild affected indexes after an approved ICU upgrade. `btree_gin` supplies the UUID operator class needed by the tenant-first multicolumn GIN indexes, while `pg_trgm` supports normalized literal/punctuation matching. The declared unique tag constraint already supplies its lookup index and is not duplicated.

Do not add an index for every theoretical filter permutation. Rating, release-year, favorite, completion, format, and uncommon compound sorts may use a bounded scan/sort of one user's at-most-10,000-entry design-point set after selective predicates. Performance tests—not an assumption that every query is indexed—decide whether another covering/composite index is justified. At multi-user scale, query-plan tests MUST verify that the tenant-first GIN strategy does not scan other users' common-term matches.

### 8.4 Tenant isolation

- Enable and `FORCE ROW LEVEL SECURITY` on every user-owned table.
- At the start of each transaction, the application sets `SET LOCAL app.current_user_id = '<verified UUID>'`. Policies use the setting for both `USING` and `WITH CHECK` and fail closed when absent.
- The runtime database role MUST neither own the protected tables nor have `BYPASSRLS`. A separate narrowly scoped job role handles expiry/purge operations and is not available to request handlers.
- Repository methods still require `userId` and include it in predicates as defense in depth. CI runs cross-tenant tests against both service and database boundaries.

### 8.5 Migrations and backfill

Proposed convention: `packages/db/migrations/NNN_descriptive_name.sql`.

1. `001_enable_extensions_and_collation.sql` — enable `citext`, `pg_trgm`, `unaccent`, `btree_gin`, approved UUID support, and the pinned `app_en_natural` ICU collation.
2. `002_create_users_and_preferences.sql`.
3. `003_create_platforms_and_seed.sql` — deterministic reviewed IDs.
4. `004_create_game_entries.sql` — named checks plus timestamp/version/custom-platform constraint triggers.
5. `005_create_tags_and_entry_tags.sql` — composite tenant foreign keys.
6. `006_create_entry_search.sql` — synchronous projection function, collation, FTS/trigram support.
7. `007_create_idempotency_exports_audit.sql` — FKs, job leases/transitions, retention fields.
8. `008_add_library_indexes.sql` — concurrent index creation where the deployment runner supports it.
9. `009_enable_library_rls.sql` — policies and grants verified with a non-owner runtime role.

This is greenfield, so no production-content backfill is needed. CI MUST migrate both an empty database and a snapshot of the prior release. Production uses forward-only migrations: schema is deployed before compatible code, destructive down migrations are not run during rollback, and future normalized/search fields are populated in bounded resumable batches before becoming required.

## 9. API Surface

### 9.1 Conventions

- Base path: `/api/v1`. All routes below require an authenticated first-party session and owner scope unless explicitly stated.
- Auth scopes are logical service permissions—`library:read`, `library:write`, `preferences:write`, `privacy:export`, and `privacy:delete`—mapped from the session. They are not accepted from client input.
- Requests and responses use JSON UTF-8. Timestamps are ISO 8601 UTC instants; calendar dates are `YYYY-MM-DD`; money uses integer minor units plus currency.
- Unknown request-body properties are rejected. Query names, filter values, sort keys, and directions are allowlisted and bounded.
- Successful single-resource responses include a strong `ETag` derived from entry ID/version. `PATCH` requires `If-Match`; missing preconditions return `428 Precondition Required` and stale versions return `412 Precondition Failed` consistently.
- Entry delete/restore/purge also require the current `If-Match`. A repeat of a successfully completed soft-delete by the same owner returns `204` idempotently; an intervening content mutation or stale restore/purge precondition returns `412`.
- Responses include `X-Request-ID`. Private API responses use `Cache-Control: private, no-store` unless a shorter, explicitly user-keyed cache is proven safe.

### 9.2 Routes

| Method and path | Scope | Purpose / response |
|---|---|---|
| `GET /api/v1/platforms` | `library:read` | Active platforms plus any inactive platform referenced by the user's entries |
| `GET /api/v1/entries` | `library:read` | Search/filter/sort active entries; paginated summary response |
| `POST /api/v1/entries` | `library:write` | Create entry; requires `Idempotency-Key`; `201`, `Location`, entry, and ETag |
| `GET /api/v1/entries/{id}` | `library:read` | Full owned active entry and ETag |
| `PATCH /api/v1/entries/{id}` | `library:write` | Partial non-empty update plus tags; requires `If-Match`; returns updated entry/ETag |
| `DELETE /api/v1/entries/{id}` | `library:write` | Idempotently move owned active entry to Trash; requires `If-Match`; `204` |
| `POST /api/v1/entries/{id}/restore` | `library:write` | Restore retained owned entry with `If-Match` and any server-issued duplicate-warning token |
| `GET /api/v1/trash` | `library:read` | Paginated trashed entries with purge dates |
| `POST /api/v1/trash/{id}/purge` | `library:write` | Permanently purge one owned trashed entry; requires current `If-Match` after a second UI confirmation |
| `GET /api/v1/entries/facets` | `library:read` | Facet values/counts using the same search/filter parameters as the list |
| `GET /api/v1/tags` | `library:read` | User's tags for autocomplete/filtering, with active and trashed usage counts; standalone rename/delete is deferred |
| `GET /api/v1/preferences` | `library:read` | Current library preferences |
| `PATCH /api/v1/preferences` | `preferences:write` | Update allowlisted preference fields |
| `POST /api/v1/me/exports` | `privacy:export` | Queue CSV/JSON export; `202` with job resource |
| `GET /api/v1/me/exports/{id}` | `privacy:export` | Export status and authenticated application download path when complete |
| `GET /api/v1/me/exports/{id}/download` | `privacy:export` | Reauthorize owner, then stream or redirect to an object URL valid ≤60 seconds |
| `DELETE /api/v1/me` | `privacy:delete` | Begin confirmed account closure after recent authentication; `202` |
| `GET /health/live` | Public/minimal | Process liveness only; no version or dependency details |
| `GET /health/ready` | Infrastructure-restricted | Critical dependency readiness; not a public diagnostic dump |

No WebSocket or Server-Sent Events are required for MVP. Mutations invalidate or update the current user's local query cache; exports may be polled with capped exponential backoff.

### 9.3 List query contract

`GET /api/v1/entries` accepts:

```text
q=<1..100 chars>
platform=<facet-key>            repeated, max 20; values come from the facets response
playStatus=<enum>               repeated
ownershipStatus=<enum>          repeated
mediaFormat=<enum>              repeated
tag=<uuid>                      repeated, max 20
favorite=true|false
ratingMin=1..5&ratingMax=1..5
completionMin=0..100&completionMax=0..100
releaseYearFrom=1950&releaseYearTo=<current+5>
addedFrom=YYYY-MM-DD&addedTo=YYYY-MM-DD
updatedFrom=YYYY-MM-DD&updatedTo=YYYY-MM-DD
sort=relevance|title|dateAdded|updatedAt|rating|releaseYear|platform
direction=asc|desc
page=<integer 1..1000>&pageSize=25|50|100
view=grid|list                   UI URL state; ignored by the DB query
```

`relevance` is valid only with a non-empty query and accepts omitted/`desc` direction only. Date bounds are interpreted through FR-43 in the user's saved time zone. Platform facets return `platform:<uuid>` or `custom:<base64url-normalized-label>` keys and display labels; every custom key is decoded, bounded, and user-scoped before use. Filter arrays are deduplicated. Invalid ranges/directions return `422`; unknown values return a field-level problem response or are canonicalized by the page layer as specified in FR-42. SQL sort expressions are selected from server constants and never interpolated from raw input.

The server calculates `totalPages` before applying an offset. A page above the last page returns a canonical empty-page response pointing to the last valid page without executing the large offset query. The API rejects offsets above 25,000 and asks the client to narrow the query or use export; this bound is monitored before any collection-size policy changes.

Example response:

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Hades",
      "platform": {"kind": "catalog", "id": "uuid", "facetKey": "platform:uuid", "name": "Nintendo Switch"},
      "edition": null,
      "playStatus": "completed",
      "ownershipStatus": "owned",
      "mediaFormat": "digital",
      "rating": 5,
      "completionPercent": 100,
      "favorite": true,
      "tags": [{"id": "uuid", "name": "Roguelike"}],
      "version": 4,
      "createdAt": "2026-09-21T18:30:00Z",
      "updatedAt": "2026-09-22T03:10:00Z"
    }
  ],
  "page": {"number": 1, "size": 25, "totalItems": 126, "totalPages": 6},
  "meta": {"requestId": "uuid", "appliedSort": "title", "direction": "asc"}
}
```

List summaries omit full notes and other large detail-only fields.

The facets response returns arrays of `{ key, label, count, selected }`. Platform keys follow the catalog/custom convention above; tag keys are UUIDs. Tag counts default to active-entry usage, while the Trash response reports trashed usage separately so deleting/restoring an item never makes an attached tag silently unmanageable.

### 9.4 Create/update contract

```ts
type EntryWrite = {
  title: string;
  platformId: string;
  customPlatformName?: string | null;
  edition?: string | null;
  releaseYear?: number | null;
  playStatus?: 'unplayed' | 'playing' | 'paused' | 'completed' | 'abandoned';
  ownershipStatus?: 'owned' | 'wishlist' | 'borrowed' | 'lent' | 'subscription' | 'sold_traded';
  mediaFormat?: 'physical' | 'digital' | 'streaming' | 'unknown';
  rating?: 1 | 2 | 3 | 4 | 5 | null;
  completionPercent?: number | null;
  hoursPlayed?: number | null;
  favorite?: boolean;
  purchaseDate?: string | null;
  purchasePriceMinor?: number | null;
  purchaseCurrency?: string | null;
  acquiredFrom?: string | null;
  startedOn?: string | null;
  completedOn?: string | null;
  notes?: string | null;
  tagNames?: string[];
  warningTokens?: string[];
};
```

The service normalizes and upserts tag names inside the same transaction as the entry. On `PATCH`, omission of `tagNames` leaves tags unchanged; supplying `tagNames` replaces the complete tag set after normalization/deduplication. Other omitted fields are unchanged and explicit `null` clears nullable fields. Server-owned properties (`id`, `userId`, normalized/search fields, `version`, timestamps, and `deletedAt`) are rejected if submitted.

Export request body is `{ "format": "csv" | "json", "schemaVersion": 1 }`. JSON contains a versioned top-level manifest, preferences object, and entries array. The CSV bundle's `entries.csv` columns are fixed in schema v1: entry ID, title, platform display/custom fields, edition, release year, states/format, rating/progress/hours/favorite, acquisition fields, play dates, notes, `tags_json`, version, created/updated/deleted timestamps, and scheduled purge timestamp. The manifest documents normalization/neutralization and row counts. Filenames are fixed safe names and download responses use a safe `Content-Disposition`.

### 9.5 Server-authoritative warning protocol

A valid request that needs deliberate acknowledgement does not write data. It returns a Problem Details response with one of these codes:

- `POSSIBLE_DUPLICATE` (`409`) — includes at most five owner-authorized candidate summaries/versions and an acknowledgement token.
- `FUTURE_DATE_CONFIRMATION_REQUIRED` (`422`) — includes affected field paths and an acknowledgement token.

Each opaque HMAC-signed token expires after 10 minutes and is bound to authenticated user, route/action, normalized content hash, warning type, and relevant candidate IDs/versions or future-date fields. Any meaningful body change, candidate version change, expiry, action change, or user change invalidates it. Create, update, and restore accept the matching token in `warningTokens`; the server reevaluates all rules before writing. Warning responses are nonterminal and are not stored as idempotent successes, so the same create `Idempotency-Key` may be resubmitted with valid warning tokens; acknowledgement-token fields are excluded from the content hash only after signature validation.

### 9.6 Errors and rate limits

Errors use `application/problem+json` following RFC 9457:

```json
{
  "type": "https://example.invalid/problems/validation",
  "title": "Validation failed",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "One or more fields need attention.",
  "instance": "/api/v1/entries",
  "requestId": "uuid",
  "errors": [{"path": "rating", "message": "Choose a whole number from 1 to 5."}]
}
```

Problem responses MUST NOT include stack traces, SQL, secrets, raw private values, or cross-account existence details.

Initial token-bucket quotas, tuned after beta telemetry:

| Operation | Per-user limit | Additional protection |
|---|---:|---|
| Authenticated reads/list/facets | 120/minute, burst 30/10 seconds | 100 page-size cap, DB statement timeout |
| Search refinements | 60/minute sustained | Client debounce/cancellation; query length/filter-count caps |
| Create/update/favorite writes | 30/minute, burst 10 | Idempotency or concurrency precondition |
| Delete/restore/permanent delete | 10/minute | Current precondition plus explicit second UI confirmation for permanent delete |
| Export | 2/hour; one active job | Row/file/time bounds |
| Sign-in/recovery | Identity-provider limit plus hashed email/IP protections | Enumeration-neutral response |

Return `429` with `Retry-After` and standardized `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` fields. Keys use an HMAC of the verified user/normalized email/trusted-proxy IP rather than raw identifiers. If the distributed limiter is unavailable, ordinary authenticated reads may use a conservative instance-local fallback; every mutation, authentication attempt, export, and destructive operation fails closed with a draft-preserving retry state rather than bypassing its quota.

### 9.7 API documentation

- Publish an OpenAPI 3.1 document at `/api/openapi.json` and a human-readable authenticated API reference for maintainers.
- Generate shared TypeScript types from the same schemas or contract-test the handwritten spec against every route in CI.
- Include success, validation, conflict, rate-limit, and authorization-neutral not-found examples.
- Any route or schema change MUST update its OpenAPI contract, tests, and release notes in the same pull request.

## 10. UI / UX

### 10.1 Information architecture

The library is the default destination after sign-in; a separate dashboard is not required for MVP.

| Route | Purpose | Primary actions |
|---|---|---|
| `/library` | Active collection with search, filters, sort, grid/list, and pagination | Add, view, favorite, edit, move to Trash |
| `/library/new` | Create one entry | Save, save and add another, cancel |
| `/library/{entryId}` | Full entry detail | Edit, favorite, move to Trash, back to preserved library context |
| `/library/{entryId}/edit` | Edit one active entry | Save, resolve conflict, cancel |
| `/trash` | Retained deleted entries and purge dates | Restore, permanently delete |
| `/settings/library` | Default view/page size/sort and export controls | Save preferences, request export |
| `/settings/account` | Session/account lifecycle controls | Sign out, close account |

Entry detail/edit links SHOULD carry a safe `returnTo` value limited to same-origin library routes, or state SHOULD be recoverable from browser history. Arbitrary redirect URLs are never accepted.

### 10.2 Collection page

Desktop order:

1. Skip link and application header.
2. `h1` “Your library,” total active count, and prominent “Add game.”
3. Search, Filter button/sidebar, Sort control, grid/list toggle, and page-size control.
4. Result summary such as “42 matching games out of 318.”
5. Active filter chips and Clear all.
6. A semantic grid-list of cards or, at desktop widths, a semantic comparison table; narrow list view uses the global Sort control.
7. Numbered pagination with Previous/Next and current range.

Wide screens MAY keep a filter sidebar visible. Narrow screens use an accessible full-height filter drawer with immediate-apply controls, an updated “Show N games” action, Reset, and Close. There is no hidden “draft filter” state in MVP.

Each grid card or list row MUST expose:

- Title and platform as the primary identity.
- Edition when present.
- Play and ownership states.
- Format, rating, completion, favorite, and release year when present and useful in the chosen density.
- View/detail navigation plus separately operable Favorite and overflow actions.
- A deterministic decorative fallback tile based on the title—not a broken image—because cover art is out of MVP scope.

Do not make an entire card a button containing other buttons. Use a normal detail link plus sibling actions with distinct accessible names such as “Favorite Hades” and “Actions for Hades.”

### 10.3 Core components

| Component | Responsibility / accessibility contract |
|---|---|
| `AppShell` | Header, account menu, main landmark, skip link, offline/degraded banner |
| `LibraryToolbar` | Labels and groups search, filters, sort, view, and page size without changing state implicitly |
| `SearchField` | Visible label, clear button, debounce/cancellation, `/` shortcut when safe |
| `FilterPanel` | Native checkbox/radio/range controls grouped by `fieldset`/`legend`; focus-contained drawer on mobile |
| `ActiveFilterChips` | Human-readable removable filters; Clear all; keyboard order follows visual order |
| `SortControl` | Complete labels such as “Title: A–Z”; never direction-only icons |
| `ViewToggle` | Two-state labeled control with selected state exposed programmatically |
| `ResultSummary` | Visible count and debounced polite live announcement |
| `EntryCard` / `EntryRow` | Semantic list item in grid/mobile; desktop list uses table rows/cells; links/actions are distinct and never nested |
| `Pagination` | Landmark label, current page, disabled state, and result range |
| `EntryForm` | Visible labels, sections, field help, error summary, draft protection |
| `TagInput` | Accessible combobox/token pattern, maximum count, and removable tokens |
| `DuplicateWarning` | Non-blocking matching-entry links plus Cancel/Save anyway choices |
| `ConfirmDialog` | Named destructive action, cancel-first focus, Escape close, focus restoration |
| `ConflictView` | Latest saved values, preserved draft, copy/reload/reapply actions |
| `StatusAnnouncer` | Central polite/assertive live regions that avoid duplicate announcements |

Prefer native HTML controls. If a custom primitive is necessary, its keyboard contract must match the relevant ARIA Authoring Practices pattern and be covered by manual assistive-technology testing.

### 10.4 Add and edit form

Use progressive disclosure and these visible sections:

1. **Game** — title, platform, custom platform when needed, edition, release year.
2. **Collection** — ownership state, format, purchase date/price/currency, acquired from.
3. **Progress** — play state, completion percentage, hours, rating, started/completed dates.
4. **Organization** — favorite, tags, notes.

Title and platform appear first and are the only required fields. Less-common fields may be collapsed under clearly labeled sections, but a collapsed section containing an error MUST open automatically.

Form behavior:

- Focus the title on a new form and the page heading on initial edit load. After invalid submission, focus the error summary first; its links move focus to individual fields.
- Show limits/help before the user violates them where practical.
- Keep Save visible without obscuring focused controls on mobile.
- Disable repeat submission while pending, but do not discard edits or imply success until the server confirms.
- Offer “Save and add another” after the basic create flow is stable; it preserves only explicitly safe repeated values such as platform if product testing supports it.
- Warn before discarding a dirty form through in-app navigation. Browser unload protection is a last resort, not the only safeguard.
- A failed save retains the complete draft in memory and offers Retry. Local persistence, if added for auth-expiry recovery, MUST be bounded, encrypted where feasible, time-limited, and exclude price/notes unless explicitly approved.

### 10.5 Key user flows

#### Flow 1 — First entry

1. New user lands on the true empty state.
2. User selects “Add your first game”; focus moves to Title.
3. User supplies title and platform, optionally expands more fields, and saves.
4. The server validates, checks likely duplicates, and creates once.
5. The new detail or library view appears with a non-modal success announcement.

#### Flow 2 — Add a likely duplicate

1. User submits an entry that matches normalized title/platform/edition.
2. The form remains intact and shows linked suspected matches.
3. User reviews a match, returns without losing the draft, then chooses Cancel or Save anyway.
4. Explicit override is recorded as a content-free audit/product event.

#### Flow 3 — Find a known game

1. User focuses “Search your library” and types one or more terms.
2. After 250–350 ms, the result region becomes busy while existing results may remain visible.
3. The newest response replaces results and announces the settled count.
4. Clear search restores the same filters and sort on page 1.

#### Flow 4 — Explore a subset

1. User chooses several platforms and a play state; controls apply immediately.
2. Chips and facet/result counts update.
3. User chooses a deterministic sort and opens a result.
4. Browser Back restores the query, chips, sort, view, page, and meaningful scroll/focus context.

#### Flow 5 — Edit in context

1. User opens Edit from detail or a result.
2. Current values prefill without inventing defaults for empty optional values.
3. Save updates the entry/version and current query cache.
4. If the entry no longer matches the current view, the success notice links to it and explains the active-filter effect.

#### Flow 6 — Resolve a conflict

1. A stale `If-Match` update is rejected.
2. The conflict view explains that another version was saved and keeps the user's draft.
3. User can copy the draft, reload the latest version, or review/reapply changes intentionally.
4. No “force overwrite” occurs without fetching the latest version and a second deliberate save.

#### Flow 7 — Remove and recover

1. User selects “Move to Trash” and a dialog names title/platform/edition plus 30-day recovery.
2. Cancel has initial focus. Confirm removes the item from active results and updates counts.
3. A confirmation links to Trash.
4. Trash shows purge date and offers Restore or permanently delete with a second confirmation.

#### Flow 8 — Export or close account

1. User opens settings, reads the scope/retention explanation, and requests export or account closure.
2. Sensitive action requires recent authentication.
3. Export shows job status and a short-lived download when ready.
4. Account closure clearly describes session revocation and the deletion/backups timeline before final confirmation.

### 10.6 Search, filter, and sort interaction details

- Search label: “Search your library.” Placeholder such as “Title, platform, edition, or tag” is supplemental and is never the only label.
- Pressing Enter submits immediately; typing uses the debounce. A clear button resets only `q`.
- `/` MAY focus search when focus is not in an editable control; `Ctrl/Cmd+K` is reserved unless documented globally.
- Filters apply immediately. Categorical controls are checkboxes for multi-select and radios only for mutually exclusive choices such as favorite state.
- Each normalized custom platform label entered through `Other` appears as its own platform facet and sort label; custom values never collapse into one generic Other facet.
- Active-filter count appears on the Filter button. Long tag/platform lists support a local “Find a filter value” input without changing the collection search query.
- Missing ratings/years are excluded from numeric ranges. If beta research shows a need, add explicit “Unrated”/“Unknown year” choices without changing existing range semantics.
- Sort options always include key and direction. Relevance is visible only for a non-empty query.
- Changing search, filters, sort, or page size returns to page 1; changing only grid/list does not.

### 10.7 Empty, loading, error, and degraded states

| State | Required treatment |
|---|---|
| Brand-new library | Value statement, Add your first game, no empty filter chrome pretending results exist |
| Search has no matches | Safely escaped query, active-filter summary, Clear search, Clear all filters, Add game |
| Filters have no matches | Active chips, individual removal, Clear all filters; preserve search/sort |
| Initial loading | Layout-matched skeletons with reserved size; result region `aria-busy`; no fake content announced |
| Search/filter refresh | Keep prior results briefly, subtle progress, stale-response protection |
| Page change | Indicator adjacent to pagination; prevent repeated activation; move focus to result heading after completion when appropriate |
| Load failure | Plain-language explanation, Retry, support/request ID, no stack trace |
| Save failure | Complete draft retained, error summary, idempotent Retry, no success toast |
| Authentication expiry | Explain sign-in requirement and preserve only an approved bounded draft; restore workflow after successful sign-in |
| Concurrent edit | Current saved version plus preserved draft and explicit recovery choices |
| Offline with loaded content | Persistent “You're offline; showing previously loaded information” banner; browsing is read-only and writes are disabled |
| Offline without loaded content | Dedicated unavailable state with automatic/manual retry |
| Reconnected | Brief polite announcement; refresh data without clearing an open draft |
| Partial degradation | Keep unaffected reads/actions working; disable only affected controls and explain why |
| Rate limited | Preserve query/form state, show the server retry time/countdown, stop automatic retries, and provide deliberate Retry when eligible |
| Enrollment off | Existing entitled users retain approved read/export behavior; unenrolled users see no partial private shell or dead navigation |
| Writes disabled | Persistent read-only banner; mutation controls are disabled with a reason; an open draft is never discarded |
| Exports disabled / jobs paused | Core library remains usable; export status explains the pause and never falsely promises a completed file |

The MVP MUST NOT claim full offline support and MUST NOT queue writes. Queued offline mutations require a separate conflict/idempotency design.

### 10.8 Responsive behavior

- Support 320 CSS px without page-level horizontal scrolling.
- At approximately 1024 px and wider, use a persistent filter sidebar when it improves scanning and a responsive multi-column grid.
- From roughly 768–1023 px, use an adaptive grid/list and an overlay filter drawer.
- Below roughly 768 px, stack toolbar controls, use compact cards, and present add/edit/filter flows at full width.
- Breakpoints are implementation guides, not assumptions about device identity; CSS content constraints decide final reflow.
- A desktop table/list becomes stacked labeled metadata on narrow screens instead of forcing the primary workflow into horizontal scrolling.
- Pointer targets are at least 44×44 CSS px where practical. Respect safe-area insets, browser text scaling, orientation changes, and on-screen keyboards.
- Sticky controls MUST NOT cover focus indicators, anchors, toasts, dialog content, or validation errors.
- Test at 200% zoom and WCAG reflow conditions up to 400% where applicable.

### 10.9 Accessibility annotations

- Use semantic landmarks and one descriptive `h1`; render grid/mobile results as lists, desktop comparison results as a table, and pagination inside a named `nav`.
- Provide a skip link to results and a programmatic heading target after result refresh.
- Search, filter, sort, rating, tag, favorite, pagination, and view controls require visible labels or visible text plus accurate programmatic names.
- Group related controls with `fieldset` and `legend`. Associate inline errors using `aria-describedby`; provide a focusable error summary with links to invalid fields.
- Modal dialogs/drawers have an accessible name, contain focus while open, close with Escape, and restore focus to the trigger. Destructive confirmations put initial focus on Cancel.
- Desktop table headers use `aria-sort` for the active supported column. Grid and narrow-screen list rely on the labeled global Sort control. Selected/expanded/busy states use native or ARIA state in addition to visible styling.
- A centralized polite live region announces settled result counts, saves, restores, filter effects, and connection changes; an assertive region is reserved for blocking errors.
- Text meets 4.5:1 contrast, UI boundaries/focus meet applicable non-text contrast, and state never relies on color alone.
- Honor `prefers-reduced-motion` and forced-colors modes. Motion is never required to understand a change.
- Verify keyboard-only use, current NVDA with Chromium on Windows, and current VoiceOver with Safari on macOS/iOS before GA.

### 10.10 Copy and internationalization keys

At minimum externalize:

```text
library.title
library.add
library.addFirst
library.search.label
library.search.placeholder
library.search.clear
library.results.matchingCount
library.filters.open
library.filters.activeCount
library.filters.clearAll
library.sort.label
library.view.grid
library.view.list
library.empty.title
library.empty.body
library.noResults.search
library.noResults.filters
library.error.load
library.error.save
library.action.retry
library.delete.open
library.delete.confirmTitle
library.delete.recoveryNotice
library.delete.permanentTitle
library.restore.success
library.conflict.title
library.unsavedChanges.title
library.offline.cached
library.offline.unavailable
library.export.requested
account.delete.confirmTitle
```

Use ICU pluralization for “1 game”/“N games.” Do not concatenate sentence fragments that translators cannot reorder. Dates, numbers, decimals, and currency use locale-aware formatters; library ordering follows the explicitly supported database collation policy rather than a client-only sort.

### 10.11 Privacy-safe product telemetry

Allowlisted events MAY include `library_viewed`, create/edit success or failure category, entry trashed/restored, search completed, filter count changed, sort changed, conflict shown, export completed, and offline state shown. Events MUST NOT contain titles, notes, tag names/IDs, entry IDs, platform custom text, prices, acquired-from text, raw queries, URLs with query values, or form payloads. Search telemetry is limited to query-length bucket, result-count bucket, latency, and whether filters were active.

## 11. AI / ML Considerations

Not applicable to APP-001. Search is deterministic PostgreSQL text/trigram matching governed by FR-27–FR-34; it does not use embeddings, generative models, personalized ranking, or external inference. AI recommendations, semantic search, auto-tagging, and generated descriptions require a separate opt-in feature plan covering evaluation, explainability, private-data handling, fallback behavior, and cost.

## 12. Integration Points

### 12.1 External services and infrastructure

| Integration | MVP use | Failure behavior / boundary |
|---|---|---|
| Standards-based managed identity provider | Sign-in, recovery, session subject, session/app-grant revocation, and deletion of the app's identity link when supported | Provider outage blocks new sign-in/closure finalization but MUST NOT corrupt library data; the app never claims to delete an unrelated provider-wide account |
| Managed PostgreSQL | Authoritative user/library/tag/preference/job storage | Readiness fails closed; no in-memory fallback is treated as authoritative |
| Managed Redis-compatible store | Distributed request quotas and short-lived coordination | Ordinary reads may use conservative local fallback; destructive/auth/export actions fail closed |
| Private S3-compatible object storage | Temporary CSV/JSON export files only | Export job fails/retries; core library CRUD remains available; lifecycle deletes files ≤24 hours |
| Scheduler/worker | Trash purge, expired idempotency cleanup, exports, account deletion | Jobs are idempotent, observable, and independently retryable; web request threads do not wait for long jobs |
| Metrics/logs/traces/error backend | SLOs, diagnostics, sanitized errors | Telemetry loss does not block product operations; buffers remain bounded and private content is redacted before emission |
| Transactional email, if not handled by identity provider | Sign-in/recovery or export-ready notification only if approved | Email failure does not lose export; status remains available in settings |

Select supported, maintained versions during implementation, pin dependencies and infrastructure APIs, and record choices in architecture decision records. No third-party game metadata, cover-art, achievement, store, or pricing API is touched in MVP.

### 12.2 Proposed internal modules

These paths are proposed and do not imply that files already exist:

```text
apps/web/app/(authenticated)/library/page.tsx
apps/web/app/(authenticated)/library/new/page.tsx
apps/web/app/(authenticated)/library/[entryId]/page.tsx
apps/web/app/(authenticated)/library/[entryId]/edit/page.tsx
apps/web/app/(authenticated)/trash/page.tsx
apps/web/app/api/v1/**/route.ts
apps/web/src/features/library/components/
apps/web/src/features/library/query-state.ts
apps/web/src/features/library/forms/
packages/contracts/src/library.ts
packages/library-domain/src/
packages/db/src/schema/
packages/db/src/repositories/
packages/db/migrations/
packages/observability/src/
openapi/library-v1.yaml
```

Use a modular monolith: HTTP handlers parse/authenticate, domain services enforce rules, repositories execute tenant-scoped queries, and shared schemas define contracts. Do not introduce microservices, a search cluster, a message broker, or WebSockets for the MVP.

### 12.3 Internal events and jobs

Security-relevant mutations MUST insert an allowlisted audit row and, when a durable job/event is required, an outbox record in the same database transaction as the domain change. A failure to write either mandatory record rolls the mutation back. After commit, an in-process dispatcher claims outbox rows idempotently and publishes these content-free event types:

```text
library.entry.created
library.entry.updated
library.entry.trashed
library.entry.restored
library.entry.purged
library.export.requested
library.export.completed
account.deletion.requested
account.deletion.completed
```

Events carry request ID, random audit actor token, target UUID where operationally needed, event time, and schema version—but no user-authored content. Export/account-deletion work and required audit records use the durable outbox/job mechanism. Product analytics and performance metrics are emitted post-commit as best effort and can never roll a successful mutation back. All consumers remain adapters inside the modular monolith; no external broker is required for MVP.

## 13. Dependencies & Sequencing

### 13.1 Work packages

| ID | Estimate | Deliverable | Depends on | Exit evidence |
|---|---:|---|---|---|
| **FOUND-001** | 3–4 days | Repository/app shell, environments, CI, secrets, request IDs, baseline observability | None | Dev/stage deploy and health checks pass |
| **UX-001** | 3–5 days, overlaps FOUND | Approved vocabulary, state map, responsive wireframes, accessibility interaction specs | Product assumptions | Design review and usability prototype results |
| **AUTH-001** | 3–5 days | Identity integration, protected routes, sessions, user provisioning, sign-out | FOUND-001 | Auth/session/CSRF/security tests pass |
| **DATA-001** | 4–5 days | Migrations, seeds, RLS, repository skeleton, representative fixtures | FOUND-001, vocabulary from UX-001 | Empty/prior migration and cross-tenant DB tests pass |
| **CRUD-001** | 7–9 days | Create/detail/edit/favorite/trash/restore vertical slice; validation, idempotency, version conflicts | AUTH-001, DATA-001 | CRUD ACs and desktop/mobile E2E pass |
| **DISC-001** | 7–9 days | Paginated grid/list, search, filter/facets, sort, URL state, preferences | CRUD-001; indexes from DATA-001 | Query conformance and 10k performance tests pass |
| **PRIV-001** | 3–5 days | Export, account closure, purge/cleanup jobs, retention controls | AUTH-001, DATA-001, worker/storage | Deletion/export drills pass |
| **HARD-001** | 5–7 days | Responsive/a11y states, rate limits, headers, telemetry redaction, alerts/runbooks | CRUD-001, DISC-001, PRIV-001 | Security/a11y/operations gates pass |
| **BETA-001** | 5–7 days | Dogfood fixes, cross-browser/manual QA, docs, staged flag rollout | All above | Beta and GA gates in §15 pass |

With two engineers working in parallel plus part-time design/QA, the critical path is approximately 10–12 weeks. Estimates include implementation, hardening, and test automation but exclude procurement/security lead time for external vendors.

### 13.2 Recommended delivery order

1. Approve the entry identity, field vocabulary, privacy/retention policy, supported account model, and this API behavior.
2. Record architecture decisions for modular monolith, managed identity, PostgreSQL search, RLS, pagination, and jobs.
3. Establish environments, CI, observability skeleton, database, cache, private export storage, and identity integration.
4. Apply schema/RLS migrations and generate 0/1/100/1,000/10,000-entry test fixtures.
5. Prove one accessible vertical slice: sign in → empty state → create minimum entry → detail → edit → move to Trash → restore.
6. Add deterministic pagination and grid/list browsing before layering search.
7. Add search, then filters/facets, then sorts and URL state; run conformance/performance tests after each layer.
8. Add exports, scheduled purges, account deletion, rate limits, security headers, alerts, and runbooks.
9. Complete responsive, keyboard, assistive-technology, cross-browser, load, threat-model, and recovery passes.
10. Dogfood, invite a small pilot, meet launch gates, then ramp the flag.

### 13.3 Must ship before / after

- APP-001 MUST ship after foundational identity, database, privacy-policy, and observability decisions are approved and their corresponding work packages are functional.
- Search/filter UI MUST ship after tenant-scoped list queries and stable pagination are proven.
- Export/account deletion MUST ship before public GA, even if an invited prototype temporarily omits them.
- APP-001 MUST ship before CSV import, catalog enrichment, collection statistics, saved views, lending, sharing, social, or recommendation features because those features depend on its ownership and entry model.

### 13.4 Shared infrastructure needed

- Web hosting/runtime and CDN/TLS termination.
- Managed PostgreSQL with automated backup and PITR support.
- Redis-compatible quota store.
- Private object storage with lifecycle rules for exports.
- Scheduled job/worker execution with a least-privileged identity.
- Identity provider and, if required, transactional email.
- Central metrics, logs, traces, error capture, alert routing, and feature flags.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Entry identity is ambiguous across title, platform, edition, and copies. | H | H | Make one row a platform-specific edition/copy; require platform; allow duplicates; warn on normalized title/platform/edition; validate with collectors before schema freeze. |
| Platform/status vocabulary does not cover real collections. | M | M | Seed broad platforms plus Other; use evolvable text checks; keep statuses small; analyze support requests before adding custom states. |
| Authorization regression exposes another user's private library. | L/M | H | Server-derived identity, scoped repositories, composite tenant FKs, forced RLS, neutral 404s, route-by-route auth matrix, release-blocking cross-tenant tests. |
| Users lose edits through conflict, timeout, navigation, or auth expiry. | M | H | Dirty-form warning, draft preservation, transactional writes, optimistic concurrency, idempotency keys, explicit conflict recovery, failure E2E tests. |
| Trash or account deletion removes data too early or never purges it. | M | H | Named confirmations, visible purge date, idempotent scheduled jobs, backlog alerts, deletion drills, documented backup aging and support boundaries. |
| Search/filter semantics drift between UI, API, and documentation. | M | H | One normative contract in this plan/OpenAPI, shared parsers/schemas, reusable conformance fixtures across unit/integration/E2E suites. |
| Search or facet queries become slow for large, heavily tagged libraries. | M | H | 10k representative fixtures, bounded pages/filter arrays, targeted indexes, query-plan CI checks, slow-query telemetry, measure before adding indexes/search service. |
| Numbered pagination shifts when concurrent writes occur. | M | M | Guarantee completeness only for an unchanged result set, reset/reload after local mutations, show fresh counts, document behavior; adopt keyset pagination later if measured need justifies it. |
| Raw titles, notes, tags, prices, or searches leak into telemetry or URL collection. | M | H | Notes/acquisition excluded from search; event allowlist; query stripping at CDN/proxy/app/error sinks; `no-referrer`; no session replay on private pages; automated configuration/redaction tests and user-facing history disclosure. |
| Custom UI controls introduce keyboard or screen-reader barriers. | M | H | Prefer native controls, accessible primitives, component contracts, axe in CI, keyboard/NVDA/VoiceOver launch gates, avoid automatic infinite scroll. |
| Mobile filter/form surfaces hide state or obscure focused controls. | M | M | Immediate-apply model, chips/count outside drawer, safe sticky layout, 320 px/on-screen-keyboard/reflow E2E and exploratory tests. |
| Retry/optimistic UI creates duplicates or shows failed data as saved. | M | H | Server idempotency, pending disabled state, rollback on failure, server acknowledgment before final success, uncertain-network tests. |
| External identity, cache, object storage, or telemetry provider fails. | M | M/H | Isolate adapters, narrow timeouts, graceful read behavior where safe, fail closed for sensitive actions, runbooks, core CRUD independent of export/telemetry. |
| Export creates a long-lived or shareable private-data URL. | L/M | H | Private bucket, authorization at status/download, short-lived signed URLs, 24-hour lifecycle, no URL logging, audit events and cross-user tests. |
| Scope expands into covers, import, catalog sync, social, marketplace, or AI. | H | M | Enforce §3; track deferred stories separately; require a new plan, privacy review, estimate, and flag for each material expansion. |
| Locale/Unicode normalization causes duplicate or sort surprises. | M | M | Preserve original text, version normalization rules, multilingual fixtures, pin/test the launch collation, and warn rather than prohibit duplicate entries. |
| Rollback strands data created by beta users. | L | H | Independent read/write flags, preserve read/export paths, additive schema, no destructive down migration, forward-fix data, rehearse rollback. |

## 15. Rollout Plan

### 15.1 Feature controls

- Primary entitlement flag: `video_game_library_v1`, default off outside development/test.
- Operational kill switches: `video_game_library_writes_enabled`, `video_game_library_exports_enabled`, and `video_game_library_jobs_enabled`.
- Flags MUST be enforced server-side. Hiding a navigation item is not access control.
- Cohort assignment SHOULD use a stable account hash and be inspectable by support/operations without exposing private library content.
- Users who already created data MUST retain at least read and export access if new enrollment is paused, unless a security incident requires full isolation.

### 15.2 Deployment sequence

1. Provision managed dependencies, least-privileged runtime/job identities, dashboards, alerts, and backup policies.
2. Apply additive schema/extensions/tables/checks/RLS policies and seed platforms while the feature remains off.
3. Build indexes using low-lock/concurrent methods supported by the selected migration runner.
4. Verify migrations, RLS, backup/restore, purge, and export behavior in staging with production-shaped data.
5. Deploy backward-compatible API and worker code with endpoints gated off.
6. Deploy UI with routes/navigation gated off; run synthetic and security checks against explicitly entitled test accounts.
7. Enable internal dogfood accounts, then an invited private-beta cohort.
8. Ramp by stable account cohort: 5% → 25% → 50% → 100%. Hold internal dogfood for at least 3 business days, invited beta for at least 7 consecutive days, and each percentage stage for at least 48 hours plus one representative usage cycle before a recorded review.
9. Keep kill switches, additive schema, and beta runbooks for at least two stable releases after GA.

There is no existing-content backfill. Future schema changes use schema → bounded backfill → dual-read/write if needed → code switch → constraint/cleanup, never a one-step destructive migration.

### 15.3 Dogfood and pilot plan

Dogfood should include:

- Empty, small (under 25), medium (500), and large (10,000) seeded libraries.
- At least five real collectors with multi-platform/edition duplicates.
- Keyboard-only and screen-reader participants.
- Mobile use in a realistic “check while shopping” scenario.
- Different locales/time zones and Unicode/non-Latin titles.
- Two-tab conflict and flaky-network exercises.

The invited beta begins with 25–50 users who consent to feedback, then expands only after the first week of CRUD/search health is reviewed. Feedback mechanisms MUST not invite users to paste sensitive notes or exports into unprotected channels.

Every stage automatically pauses and rolls back or disables affected capabilities when any of these occurs: one suspected cross-tenant disclosure or integrity mismatch; one unrecoverable data-loss event; mutation success below 99.0% for 15 minutes excluding valid 4xx responses; 5xx above 2.0% for 5 minutes; list/search p95 above 750 ms for 15 minutes; a purge/export job violates ownership; database saturation alert persists 10 minutes; or the on-call owner judges an unexplained privacy/security signal credible. Resumption requires an incident owner, understood cause, remediation, clean reconciliation checks, and a recorded go decision.

### 15.4 Entry and GA gates

Dogfood entry requires:

- All P0 unit, integration, migration, and core E2E suites green.
- Cross-account isolation tests passing at application and RLS layers.
- No known critical/serious automated accessibility finding on core states.
- Sanitized logs, metrics, traces, dashboards, and alerts receiving data.
- Backup restore, write-disable, feature-disable, application rollback with forward-compatible schema, and forward-fix migration procedures rehearsed.

GA requires all of the following:

- No open Sev-1/Sev-2 authorization, privacy, corruption, or data-loss defect.
- At least 99.5% successful creates/updates/trash/restores during pilot, excluding valid client errors and user cancellations.
- API 5xx rate below 0.5% during the pilot, plus synthetic/load evidence that the 99.9% availability design can meet its SLO; actual 99.9% compliance is measured over the first and subsequent full calendar months rather than inferred from a small short pilot.
- §6 p95 performance budgets pass for a representative 10,000-entry account; no normal query uses an unintended unbounded scan.
- No duplicate or omitted IDs in unchanged-dataset pagination conformance tests.
- Restore, permanent purge, account deletion, export expiry, and database recovery drills pass with recorded evidence.
- Automated accessibility has no critical/serious issues and manual keyboard, NVDA, and VoiceOver critical paths are signed off.
- Threat model, authz matrix, dependency/secret scans, and security abuse cases pass.
- Privacy notice, terms/audience decision, end-user help, support scripts, API reference, and operational runbooks are approved and owned.
- Product, design, engineering, QA, security/privacy, support, and operations owners record a go/no-go decision.

### 15.5 Monitoring during ramp

Review by cohort and deployment version:

- Read/write rate, success, 4xx category, 5xx rate, p50/p95/p99 latency, and database time.
- Sign-in failures, authorization-neutral 404 rate anomalies, CSRF/rate-limit decisions, and RLS policy errors.
- Search/facet latency and zero-result bucket rate without raw query text.
- Duplicate-warning and override rates without title/platform content.
- Conflict, idempotent replay, retry, trash, restore, permanent-delete, and purge-job rates.
- Export queue age, failure, authorization denial, expiry cleanup, and object-storage deletion.
- Client errors, stale-response suppressions, offline/degraded-state impressions, and Core Web Vitals.
- Accessibility regression results for each build.
- Database connections, lock time, slow queries, table/index growth, backup age, and restore-test freshness.

### 15.6 Communication

- Dogfood: internal release note with scope, known limits, feedback path, and data-handling warning.
- Beta: concise welcome/quick-start, privacy/retention explanation, known non-goals, and change log.
- GA: product release note, updated help center, status-page component, and support escalation matrix.
- Incident: in-app/status communication must state affected actions and time window without speculating about private user content.

### 15.7 Rollback

1. If data integrity is uncertain, disable writes/jobs first while preserving safe read/export access.
2. If read isolation is uncertain, disable the feature entirely and revoke affected sessions as the incident plan dictates.
3. Roll application/worker code back to the last compatible version; retain additive schema and indexes.
4. Do not execute destructive down migrations during incident response.
5. Pause exports/purges independently if those jobs are causal; preserve job records for reconciliation.
6. Reconcile idempotency records, job state, and audit identifiers; run data-consistency checks before re-enabling writes.
7. Forward-fix data/schema issues and document any user impact, recovery action, and follow-up prevention work.

## 16. Test Plan

### 16.1 Test strategy and environments

- **Pull request tier:** lint, formatting, strict type-check, schema generation/contract diff, unit tests, component accessibility tests, migration-from-empty, and focused integration tests.
- **Main/staging tier:** full PostgreSQL/Redis/object-store integration, migration-from-prior-snapshot, Playwright-style cross-browser E2E, security checks, accessibility scans, and representative query-plan tests.
- **Release tier:** load/soak, backup restore, deletion/export drills, manual exploratory, keyboard/screen-reader, responsive/device, and rollback rehearsal.
- Tests use synthetic data only. Production exports, titles, notes, or identifiers MUST NOT be copied to lower environments.
- Time, locale, identity, storage, email, and job integrations need deterministic test doubles plus a smaller set of real sandbox-contract tests.

### 16.2 Unit and component tests

Cover at minimum:

- All required/length/range/enum/cross-field validation and blank-to-null normalization.
- Unicode normalization, case/diacritic folding, punctuation, natural ordering, tag uniqueness, and duplicate-warning keys.
- Search token parsing, punctuation-literal fallback, projection/ranking, and all-token matching; allowlisted filters/sorts; AND-across/OR-within semantics; time-zone-aware inclusive ranges; null-last stable comparators.
- URL query serialization, canonicalization, invalid-state fallback, preference precedence, and page-reset rules.
- Idempotency request hashing/replay decisions, signed warning-token binding/expiry, and concurrency/version preconditions.
- Entry service rules for defaults, custom platform, tag upsert, favorite, trash/restore, purge eligibility, and date warnings.
- Reducers/hooks for pending mutation, rollback, stale-response suppression, dirty form, filter chips, pagination, and conflict preservation.
- Components in populated, empty, no-match, loading, failure, offline, dialog, drawer, validation, and conflict states using semantic queries and automated accessibility checks.
- Telemetry allowlist/redaction: every user-authored field and raw URL/query must be rejected from event payloads.
- CSV bundle columns, `tags_json`, formula neutralization, JSON losslessness, safe filenames, and schema-version manifests.

### 16.3 Database and API integration tests

- Migrate from empty and from the previous release; re-run safe migrations where the runner promises idempotence.
- Exercise CRUD, default values, validation/warning challenges, tags/search projection in the same transaction, likely duplicate override, optimistic concurrency, soft delete, restore, permanent purge, and cleanup jobs.
- Prove RLS fails closed without `app.current_user_id`; prove Alice cannot select/insert/update/delete Bob's entry/tag/export through direct SQL under the runtime role.
- Run the full route authorization matrix for unauthenticated, correct-owner, wrong-owner, disabled/deletion-pending, expired-session, and rate-limited actors.
- Test list/search/filter/facet/sort/page combinations against an independent expected-result fixture implementation.
- Verify idempotent creates after response loss, key reuse with different bodies, expiry cleanup, and parallel same-key submissions.
- Verify transaction rollback if tag creation, audit enqueue, or entry write fails midway.
- Verify tag replacement, custom-platform changes, trash/restore, and platform-label migration produce the expected `entry_search` row synchronously; projection failure rolls the mutation back.
- Verify export contents/escaping/Unicode/formula neutralization, ownership checks, partial one-active-job uniqueness, worker lease expiry/reclaim, bounded retries/status transitions, authenticated download, object expiry/account-close deletion, and failure recovery.
- Verify account closure revokes sessions and deletes only the target account's application data according to the staged clock.
- Inspect logs/traces/error capture during failures for forbidden content.
- Run a feature-control matrix for enrollment off, read-only/writes off, exports off, jobs paused, complete feature off, and each re-enable/reconciliation path.

### 16.4 Search/filter/sort conformance matrix

| ID | Scenario | Expected result |
|---|---|---|
| S-01 | Empty/whitespace query | Equivalent to no query; no search no-results state |
| S-02 | `pokemon` against `Pokémon` | Case/diacritic-insensitive match |
| S-03 | Multi-token query split across title and tag/platform | Match only when every token occurs somewhere searchable |
| S-04 | `C++`, `F-Zero`, `NieR:Automata`, quotes, `%`, `_`, `*`, HTML/script, emoji, RTL text | Stored literals match when present; every input remains bounded and non-executable |
| S-05 | Query A responds after later query AB | AB stays visible; A is discarded |
| S-06 | Exact title, title prefix, edition/platform/tag, and notes-only candidates | Exact title ranks first, then prefix/substring, then other searchable fields; notes-only does not match |
| S-07 | Clear query while filters active | Query clears; filters/sort remain; page becomes 1 |
| F-01 | Switch and PC selected | Platform group uses OR |
| F-02 | Switch/PC plus Completed plus tag | Categories use AND; all selected category conditions hold |
| F-03 | Rating/completion/year endpoints | Inclusive bounds; null excluded |
| F-04 | Remove one chip | Only its one constraint is removed |
| F-05 | Clear all filters with query active | Filters clear; query/sort remain |
| F-06 | Invalid/tampered facet IDs | Safe rejection/canonicalization; no existence disclosure or crash |
| F-07 | Facet counts with own selections | Each facet excludes its own selection but honors all other constraints |
| F-08 | Two differently named custom `Other` platforms | Separate normalized facets, sorts, and duplicate keys |
| T-01 | `Game 2` and `Game 10` title sort | Numeric natural order |
| T-02 | Equal primary values | Normalized title then immutable ID creates repeatable order |
| T-03 | Missing rating/year in either direction | Missing values always last |
| T-04 | Relevance selected, query cleared | Compatible documented default replaces relevance |
| P-01 | 126 unchanged results at page size 50 | 50/50/26 unique items; accurate ranges/count |
| P-02 | Sort/filter changes on page 3 | Page resets to 1 |
| P-03 | Huge/out-of-range page value | Bounded parse; no expensive OFFSET; canonical last-page guidance or validation response |
| C-01 | Edit changes a filtered field | Item moves in/out with explanatory success status |
| C-02 | Delete last item on final page | Navigates to nearest valid page; no orphan empty page |
| C-03 | Detail then browser Back | Query/filter/sort/view/page and useful focus/scroll context restore |

These fixtures SHOULD run against query utilities, repository/API integration, and selected E2E cases to prevent semantic drift.

### 16.5 End-to-end tests

Automate the critical paths:

- New user signs in, sees the true empty state, adds a minimum entry, reloads, views, edits, favorites, trashes, and restores it.
- Fully populated entry round-trips Unicode, dates, money, tags, long notes, and optional null values.
- Duplicate warning supports review/cancel/save-anyway; cross-platform and edition variants remain legal.
- Future-date warning tokens accept only the unchanged owner/action/body and reject expired, changed, or cross-user replay.
- Rapid search, clear search, no-result recovery, filters/chips/Clear all, every sort/direction, grid/list, and all page sizes.
- Deep link, reload, bookmark-equivalent fresh navigation, Back/Forward, and explicit URL override of preferences.
- Two sessions produce a recoverable edit conflict rather than overwrite.
- Save response loss and retry produce one entry; failed favorite rolls back; failed form retains values.
- Session expiry during a form returns the user safely to the interrupted workflow according to the approved draft policy.
- Offline transition makes loaded content read-only, disables writes, preserves draft, then reconnects/refetches without erasing it.
- Trash expiry copy, permanent-delete confirmation, export request/download expiry, and account-closure reauthentication.
- Cross-account guessed IDs reveal and change nothing.
- Mobile filter drawer, full-width forms, on-screen keyboard, rotation, and no horizontal page scroll at 320/375 px.
- Rate-limited writes preserve drafts/count down `Retry-After`; feature-control modes match server enforcement and safely reconcile after re-enable.

### 16.6 Security tests

- IDOR/tenant-boundary attempts for list, detail, patch, favorite, trash, restore, permanent purge, tags, preferences, facets, exports, and account deletion.
- SQL/text-search injection through every text, range, repeated filter, sort, page, ID, header, and cursor-like value.
- Stored/reflected XSS through title, edition, custom platform, tag, acquired-from, notes, validation echoes, and export filenames/content.
- CSRF and Origin/Host enforcement for cookie-authenticated mutations; session fixation/rotation/revocation; open-redirect attempts through return state.
- Mass assignment of `userId`, normalized/search fields, version, timestamps, deletion state, export object key, and audit metadata.
- Enumeration neutrality for account recovery, IDs, disabled platforms, tags, export jobs, and deleted resources.
- Rate-limit bypass, expensive-query/filter abuse, oversized arrays/bodies, decompression/content-type tricks, repeated exports, and concurrent destructive requests.
- Security header/CSP checks, dependency and secret scans, CSV formula injection, object-URL leakage, and prohibited private values in metrics.
- Verify CDN, proxy, hosting, application, trace, error-reporting, and support tooling strip query strings; authenticated responses use `no-referrer`; document unavoidable local browser-history exposure.
- Restore a backup into an isolated environment and verify encryption/access controls, tenant integrity, and documented RPO/RTO.

### 16.7 Accessibility tests

- Automated axe-style checks for every significant populated/empty/loading/no-result/error/offline/conflict/dialog/drawer/form-error state.
- Full keyboard script using Tab/Shift+Tab, arrows where expected, Enter/Space, Escape, browser Back, and skip links.
- Current NVDA with Chrome or Edge on Windows; current VoiceOver with Safari on macOS and a core mobile flow on iOS.
- 200% zoom, applicable 400% reflow, 320 px width, OS text scaling, forced-colors/high-contrast, reduced motion, light/dark theme if offered, and long translated strings.
- Focus visibility/order/restoration; sticky-content overlap; error-summary links; live-region usefulness and non-repetition; `aria-sort`, busy, expanded, selected, and dialog semantics.
- Touch target sizing and one-handed mobile use without hover-only information.

### 16.8 Browser/device matrix

| Platform | Required release coverage |
|---|---|
| Windows | Current supported Chrome, Edge, Firefox; keyboard and NVDA on Chromium |
| macOS | Current supported Safari and Chrome; VoiceOver/Safari |
| iOS/iPadOS | Current and previous supported Safari on small-phone and tablet viewports |
| Android | Current Chrome on a representative mid-tier phone |
| Responsive CI | Chromium at 320, 375, 768, 1024, and 1440 CSS px; targeted Firefox/WebKit E2E |

The exact version matrix is set at release time from the browser-support policy in §6 and recorded in the release checklist.

### 16.9 Performance and load tests

- Generate accounts with 0, 1, 100, 1,000, and 10,000 entries; a separate capacity dataset covers overall multi-user load.
- Include duplicate normalized titles, 20-tag entries, nulls, all enum values, Unicode/non-Latin text, maximum ordinary notes, equal sort keys, and sparse/large facet distributions.
- Exercise cold/warm first and deep pages, broad/narrow searches, all sorts, worst common filter combinations, facets, concurrent reads/writes, exports, and purge jobs.
- Use an HTTP load tool for server SLOs and browser performance automation for LCP/INP/CLS and interaction responsiveness.
- Fail the release if §6 budgets are exceeded, normal queries use unintended unbounded scans at representative volume, database pool saturation breaches thresholds, or a memory/request buildup appears during a search-refinement soak.
- Record baselines per deployment version so a statistically meaningful regression blocks rollout even if it narrowly remains below an absolute ceiling.

### 16.10 Manual exploratory charters

- Real collector with many platforms, editions, regional/custom platform labels, deliberate duplicates, and sold/wishlist/borrowed items.
- Minimalist user who enters only required fields and never opens advanced form sections.
- Very long text, emoji, combining marks, apostrophes, right-to-left and non-Latin titles/tags, unusual currencies, and time-zone/date boundaries.
- Rapid create/edit/favorite/trash/restore in two tabs with slow, flaky, offline, and reconnected networks.
- Browser Back/Forward, refresh, copied deep links, expired session mid-form, stale filter IDs, and disabled platform references.
- Screen-reader traversal of 50 results and repeated filter/search updates without announcement overload.
- One-handed phone use with virtual keyboard, landscape/portrait change, 200% zoom, and sticky controls.
- Identity, Redis, database, object storage, worker, and telemetry partial outages using failure injection in non-production.

## 17. Documentation & Training

### End-user documentation

- Quick start: create an account, add the first game, and understand required fields.
- Entry field glossary, status definitions, platform/edition/copy model, and why likely duplicates are warnings.
- Search field scope/token behavior, filter AND/OR/range rules, sort/null behavior, grid/list, pagination, and URL/bookmark behavior.
- Edit/conflict recovery, favorites, moving to Trash, restoring, permanent deletion, and the 30-day retention rule.
- Export contents, download expiry, account closure, backup-aging limits, and what support can/cannot recover.
- Privacy: private-by-default behavior, content excluded from telemetry, and third-party services used.
- Connection/offline limits, save retry, sign-in expiry, and troubleshooting when a result is hidden by filters.
- Keyboard shortcuts and accessibility/help contact path.

### API and engineering documentation

- OpenAPI 3.1 reference with auth, examples, problem types, ETags/preconditions, idempotency, quotas, and change policy.
- Architecture decision records for modular monolith, identity, entry identity, PostgreSQL search, RLS, numbered pagination, trash retention, export storage, and telemetry policy.
- Data dictionary, normalization version/rules, ownership model, status vocabulary, schema diagram, indexes, RLS policies, and migration playbook.
- Normative search/filter/sort/page semantics and reusable conformance fixture format.
- Component accessibility contracts for forms, dialogs, drawer, tag input, result card/row, pagination, and announcements.
- Threat model, data-flow diagram, privacy inventory, subprocessor record, telemetry allowlist, and retention schedule.

### Operations and support documentation

- Runbooks for identity outage, database saturation/failover/restore, Redis failure, stuck export, overdue purge, bad migration, elevated conflicts, rate-limit incident, and suspected tenant-isolation failure.
- Dashboard/alert catalog with owners, thresholds, diagnostic queries, escalation path, and review dates.
- Feature-flag ramp, write-disable, read-disable, rollback, reconciliation, deletion drill, and backup-restore procedures.
- Support decision tree distinguishing filtered/no-result confusion, save conflict, transient failure, Trash recovery, permanent purge, and account deletion.
- Approved response templates that never request users to send raw exports, notes, session tokens, or unnecessary account data.

### Training and release materials

- Five-minute support walkthrough covering add, search, filters, sort, edit, conflict, Trash/restore, export, and escalation IDs.
- QA scripts for keyboard, screen readers, mobile, privacy, and rollout smoke tests.
- Release notes with screenshots or short clips, clear non-goals, and any migration/account impact.
- Named owners and quarterly review dates for privacy, security, accessibility, support, and operations documents.

## 18. Open Questions

The plan uses the “Default in this plan” column unless the named owner changes the decision before the milestone. Questions marked **blocker** must close before the dependent work package begins.

| # | Decision | Default in this plan | Owner / latest decision point | Impact if changed |
|---:|---|---|---|---|
| 1 | **Blocker:** Which identity provider and sign-in methods? | Managed standards-based identity; no application passwords; recovery owned by provider | Security + Engineering, before AUTH-001 | Session schema, email, procurement, privacy notice |
| 2 | **Blocker:** What exactly is one entry? | One platform-specific game edition/copy; deliberate duplicates allowed | Product, before DATA-001 | Keys, duplicate behavior, UI wording, future import |
| 3 | **Blocker:** Is platform required? | Yes, with broad seeded list and required custom label for Other | Product + UX, before form/schema freeze | Quick-add speed, duplicate quality, migration |
| 4 | Which status vocabularies are final? | Values in FR-26; no custom statuses in MVP | Product, before DATA-001 | Constraints, filter copy, analytics dimensions |
| 5 | What personal-rating scale? | Whole numbers 1–5; no halves | Product/Research, before DATA-001 | Validation, migration, UI control, sorts |
| 6 | Which fields are searchable, and may query state appear in browser history? | Search only title, edition, platform, and tags; query remains in the URL for restoration; authenticated pages use `no-referrer` and every logging layer strips query strings | Privacy + Product, before DISC-001 | Search scope, privacy copy, URL behavior |
| 7 | Which launch locales are fully supported? | English UI at GA; Unicode data, externalized strings, locale-aware formatting from day one | Product, before BETA-001 | Translation QA, collation, support coverage |
| 8 | Is a future-dated purchase/start/completion value invalid? | Allow only after an explicit warning; preserve date as entered | Product, before CRUD-001 | Validation and data cleanup |
| 9 | Should permanent deletion be available immediately from Trash? | Yes, behind a second confirmation; the purge API requires the current entry ETag | Privacy + Product, before PRIV-001 | Recovery risk, API/UI, support policy |
| 10 | What is the account-deletion grace period? | Sessions revoked promptly; primary application data queued for deletion within 30 days; no self-service cancellation promised | Legal/Privacy, before PRIV-001 | Copy, scheduler, support recovery, backups |
| 11 | Should exports send an email when ready? | No for MVP; settings page polls status. Add email only if jobs routinely exceed one minute | Product + Ops, during PRIV-001 | Email provider, privacy/subprocessor scope |
| 12 | Can support restore permanently purged/expired entries? | No; support can explain status but cannot bypass retention or mine backups for individual records | Privacy + Support, before beta | User promises, runbook, backup access risk |
| 13 | Is 10,000 entries per account the supported limit or only the performance design point? | Supported/tested design point, with no hard cap until abuse/cost evidence justifies one | Product + Engineering, before GA | Quotas, pricing/cost, load suite |
| 14 | Are saved views, import, bulk actions, covers, catalog sync, sharing, or AI part of MVP? | No; each is separately planned after core telemetry/research | Product, at scope reviews | Schedule, privacy, storage/providers, complexity |
| 15 | Who belongs in the invited pilot and who owns go/no-go? | 25–50 opt-in collectors; cross-functional launch owner named before BETA-001 | Product lead, before dogfood exit | Feedback quality, rollout accountability |
| 16 | Will a first-party/public API be promised to outside clients? | No; `/api/v1` is versioned for internal discipline only | Product + Platform, before GA docs | CORS/OAuth scopes, deprecation commitments, abuse controls |

## 19. References

### Source and related planning material

- Source template: `C:/Users/carlb/Downloads/_TEMPLATE.md`.
- Product brief: user request dated 2026-09-21 for a personal video-game library and collection organizer with create, edit, search, filter, and sort capabilities.
- Related plans: none yet. Future capabilities should receive separate plans, suggested IDs `IMPORT-001`, `CATALOG-001`, `STATS-001`, `SHARE-001`, and `RECOMMEND-001`.

### Proposed repository areas

- `apps/web/app/(authenticated)/library/**`
- `apps/web/app/api/v1/**`
- `apps/web/src/features/library/**`
- `packages/contracts/src/library.ts`
- `packages/library-domain/src/**`
- `packages/db/src/schema/**`
- `packages/db/migrations/**`
- `packages/observability/src/**`
- `openapi/library-v1.yaml`

These are target paths, not claims about existing files.

### Standards and guidance

- RFC 2119 and RFC 8174 / BCP 14 — requirement-keyword interpretation.
- RFC 9457 — Problem Details for HTTP APIs.
- RFC 9110 — HTTP semantics, including conditional requests and validators.
- OpenAPI Specification 3.1 — API contract.
- OAuth 2.0 Authorization Code with PKCE and OpenID Connect Core — managed identity integration.
- BCP 47 — language tags; IANA Time Zone Database; ISO 8601 — date/time exchange; ISO 4217 — currencies.
- Unicode Normalization Forms — normalization and round-trip expectations.
- WCAG 2.2 Level AA and WAI-ARIA Authoring Practices — accessibility target and interaction patterns.
- OWASP ASVS Level 2 and OWASP Top 10 — application-security verification baseline.
- OpenTelemetry semantic conventions — trace, metric, and log correlation.

### Plan completion checklist

- [ ] All blocker open questions have named decisions.
- [ ] Each MUST requirement maps to implementation work and at least one test.
- [ ] OpenAPI, UI copy, schema, and status vocabulary agree.
- [ ] Threat model, privacy inventory, accessibility spec, and retention policy are approved.
- [ ] Migration, rollback, restore, purge, export, and account-deletion procedures are rehearsed.
- [ ] Dogfood, beta, and GA gates have named approvers and stored evidence.
