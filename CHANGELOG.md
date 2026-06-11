# Changelog

## [1.3.5] - 2026-06-11

### Performance

- **Company Get Many is dramatically faster on v7**: Owner enrichment previously fetched the **entire** company collection from the v2 API on every Get Many — ignoring the requested `limit`, at the page size of 30 rows/request. A "Get Many, limit 10" on a large instance scanned every page (e.g. ~85 pages for 2,540 companies; silently truncating owner data past row 3,000 due to a 100-page cap). Enrichment now:
  - resolves owners for **only the company IDs that v1 actually returned**, with early-stop once they're all found. Mautic's v2 collection defaults to `ORDER BY id ASC` (matching v1), so a limited Get Many resolves its owners in the first page(s) — e.g. limit 10 now completes in a **single** v2 request instead of scanning the whole instance;
  - terminates on actual items-seen vs the collection total, removing the previous silent 3,000-row truncation;
  - skips the v2 fetch entirely when the v1 result set is empty;
  - requests `itemsPerPage=100` and `order[id]=asc` as best-effort hints. Note: stock Mautic disables client page-size control (hard-caps at 30) and defines no order filter, so these are currently no-ops — the per-page count stays at 30. The speedup above comes from bounding to the returned IDs + early-stop, which is independent of page size; raising the per-page count further would require enabling client pagination on the Mautic server.
- **v2 collection parsing hardened**: list responses are now read from both `hydra:member`/`hydra:totalItems` (legacy Hydra) and `member`/`totalItems` (API Platform 4.x), plus bare JSON arrays.

## [1.3.4] - 2026-06-11

### Fixed

- **Company owner now resolves to a user ID under Basic auth**: The v7 owner-enrichment fetches now request `Accept: application/ld+json` instead of the default `application/json`. Mautic's API Platform only emits the owner's `@id` IRI (`/api/v2/users/{id}`) in the JSON-LD representation — the plain-JSON representation returns the embedded `owner` object with only FormEntity fields (`isPublished`/`dateAdded`/`dateModified`) and no identifier, because `User`'s own fields are not in the `company:read` serialization group. Requesting JSON-LD surfaces the IRI, from which the numeric user ID is extracted, so Company Get / Get Many now return `owner: { id: <n> }`.
  - `extractOwnerFromV7` hardened to accept the owner serialised either as an embedded object with `@id`, a bare IRI string, or an object exposing a plain `id`; falls back to the raw owner object only when none is present.
  - Verified against live Mautic 7.1.1 / API Platform 4.3.5: `application/ld+json` returns `owner["@id"] = "/api/v2/users/{id}"`; `application/hal+json` is not enabled (406); plain `application/json` never carries the id.

## [1.3.3] - 2026-06-11

### Fixed

- **Company owner enrichment no longer fails silently under OAuth2**: Version detection now distinguishes the v2 API probe outcomes. Previously any non-403 error (including the **401** that Mautic's v2 API Platform firewall returns for v1-style OAuth2 bearer tokens) was mapped to v6, so owner enrichment was skipped with no indication and Company Get / Get Many returned `owner: null` despite the instance being v7.
  - The probe now classifies v2 as `usable` (200), `unauthorized` (401/403 — route exists but the credential is rejected), or `absent` (404/other — genuine v6). Routing falls back to the v1 API whenever v2 is not `usable`, so all company operations keep working under OAuth2.
  - When owner enrichment is skipped because v2 returned 401/403, a clear warning is now logged explaining that owner is a v7-only field requiring an auth method the v2 API accepts (Basic auth confirmed working; OAuth2 depends on the server's v2 firewall config). Custom fields and all other company data are unaffected.
  - The enrichment `try/catch` blocks in Company Get / Get Many now log the underlying error via `logger.warn` instead of swallowing it to `owner: null`.

### Docs

- Documented the auth-method dependency for Company owner enrichment in the README (Basic auth works with the v2 API; OAuth2 depends on the Mautic server's v2 API firewall).

## [1.3.2] - 2026-06-11

### Fixed

- **Company Get / Get Many — owner enrichment**: When v7 is detected, Get and Get Many now perform a secondary v7 fetch (JSON-LD, no `Accept: application/json` header) to extract the owner user ID from the Hydra IRI (`/api/v2/users/{id}`). The v1 result (all custom fields) is merged with the v7 owner so both custom fields and `owner: { id: N }` appear in output. If the v7 enrichment fetch fails, the operation continues with v1 data and `owner: null`.

## [1.3.1] - 2026-06-11

### Fixed

- **Company Get / Get Many — custom fields restored**: Reverted Get and Get Many to use the v1 API (`/api/companies`). The v7 API Platform endpoint omits all custom company fields from responses, returning only standard entity fields (`name`, `website`, etc.). v1 returns the full `fields.all` payload including all custom fields. Create, Update, and Delete remain on v7 where owner handling is correct.

## [1.3.0] - 2026-06-11

### Added

- **Mautic version auto-detection**: The node now detects whether the connected Mautic instance is v6 or v7+ automatically by probing the v2 API on first use. Result is cached per instance for 5 minutes. The `Mautic Version` dropdown has been removed from both credential types — existing credentials that have it stored will simply ignore the unused field.

### Changed

- **Company operations — Mautic v7 API Platform**: All five company operations now use the API Platform v2 endpoints (`/api/v2/companies`) when a v7 instance is detected, and fall back to v1 (`/api/companies`) for v6.
  - **Create** (`POST /api/v2/companies`): body sent as `application/json`; owner set as IRI reference (`/api/v2/users/{id}`); fields use unprefixed v7 names (`name`, `email`, `zipcode`, etc.)
  - **Update** (`PATCH /api/v2/companies/{id}`): body sent as `application/merge-patch+json`; owner set as IRI reference
  - **Get** (`GET /api/v2/companies/{id}`): returns flat response with native JSON types (no string coercion)
  - **Get Many** (`GET /api/v2/companies`): page-based pagination; both *Return All* and fixed-limit modes page through results correctly
  - **Delete** (`DELETE /api/v2/companies/{id}`): handles HTTP 204 no-body response; returns `{ id: <number> }`
  - `addContactToCompany` / `removeContactFromCompany` remain on v1 — no v2 equivalent exists

### Fixed

- **Company `isPublished`**: Setting *Is Published* on Company Create or Update now correctly reaches the v7 API. Previously it fell into the excluded `rest` spread and was silently dropped.
- **JSON-LD response pollution**: All v7 company requests now send `Accept: application/json`, preventing API Platform from returning Hydra/JSON-LD responses with `@id`/`@type`/`@context` keys in workflow output.
- **Company `convertNumericStrings`**: v7 returns native JSON types; numeric string coercion is now skipped for v7 to prevent zip codes and phone numbers being cast to integers.
- **Company Delete return type**: `delete` now returns `{ id: <number> }` instead of a string id for v7.

## [1.2.1] - 2026-06-10

### Added

- **Company Owner**: Exposed `Owner Name or ID` field on Company Create and Company Update operations. Populates from the Mautic user list (same loader as Contact owner).

### Fixed

- **Contact Owner (broken field)**: `Owner ID` field on Contact Create and Update was silently dropped — the description field was named `ownerId` but the operation read `owner`. Renamed field to `owner` and upgraded to a user-list dropdown (`Owner Name or ID`) so it now maps correctly to `body.owner`.

### Changed

- **Company simple output**: `Simplify` mode now returns `id` and `owner` alongside custom fields instead of bare `fields.all`. Applies to Get, Get Many, Create, Update, and Delete.
- **Contact simple output**: `Simplify` mode now includes `id` and `owner` at the top level alongside `fields.all`.

## [1.2.0] - 2026-06-07

### Fixed

- **Contact Fields to Return**: Fixed Contact Get and Get Many field selection so selected fields are honoured in both raw and simplified output modes instead of returning the full contact object.
- **Contact Field Options**: Added raw contact output fields, including `tags`, `doNotContact`, and `ipAddresses`, to Contact Get/Get Many Fields to Return without adding those raw-only fields to custom-field or where-condition dropdowns.
- **OAuth Request Lock Scope**: Narrowed OAuth request serialization so ordinary API calls can run concurrently while invalid-grant recovery retries remain credential-scoped.

### Changed

- **API Read Performance**: Increased internal Mautic read pagination page size, prevented pagination helpers from mutating caller query objects, cached repeated dynamic option loads per credential, and fixed Contact DNC Return All pagination.

## [1.1.0] - 2026-06-07

### Fixed

- **OAuth2 Refresh Race**: Serialised Mautic OAuth2 API requests per credential instance to avoid concurrent refresh attempts consuming the same single-use refresh token.
- **Theme Operations**: Routed theme upload, download, list, and delete requests through the shared authenticated request helper.
- **AI Tools**: Removed broad request-context casts from AI tool API calls and queued OAuth2 tool requests through the shared request path.
- **Auth Errors**: Report `invalid_grant` refresh failures as OAuth credential refresh/authentication issues instead of Mautic validation errors.
- **Error Preservation**: Preserve n8n `NodeOperationError` instances through shared API wrappers so credential reconnect messages remain visible.

## [1.0.0] - 2026-03-13

### Added

- **MauticAdvancedAiTools node** — Exposes Mautic operations as AI tools for the n8n AI Agent node and MCP Trigger (including queue mode)
  - **Unified single-tool-per-resource architecture**: one `DynamicStructuredTool` per resource with an `operation` enum field, ensuring compatibility with queue-mode MCP Trigger where `toolName` is not injected into args
  - **14 resources**: Contact, Company, Campaign, Email, Segment, Tag, Note, Category, Field, User, Company Contact, Campaign Contact, Contact Segment, Segment Email
  - **70+ operations**: full CRUD, contact membership management (segments, campaigns), associations, email sending
  - **Dual-path dispatch**: works with both AI Agent (`execute()`) and MCP Trigger (`func()`)
  - **3-layer write safety**: `allowWriteOperations` toggle (default: read-only) enforced at UI filtering, `func()` re-check, and `execute()` re-check — write attempts when disabled return structured error, never silent fallback
  - **LLM-optimised Zod schemas**: every field has `.describe()` guidance; `search` precedes `name` in property order to prevent LLM exact-match mistakes
  - **Structured result envelope**: `wrapSuccess`/`wrapError` with `schemaVersion: "1"` for consistent AI consumption
  - **Runtime `instanceof` compatibility**: `createRequire()` anchor resolution from `@langchain/classic/agents` ensures Zod and DynamicStructuredTool pass n8n's runtime checks
  - **Mautic API v6/v7 version routing**: tag v1/v2 handling based on credential version setting
  - **Custom field support**: JSON parameter on contact create/update for arbitrary custom fields
  - **Null/empty guards**: `get` returns `ENTITY_NOT_FOUND`; filtered `getAll` returns `NO_RESULTS_FOUND` with filter context
  - **n8n metadata stripping**: 8 framework-injected fields (including `root` canvas UUID) stripped before API calls

### Fixed

- **Contact Segments/Campaigns**: Fixed batch add/remove operations using nonexistent API endpoints — now correctly calls per-item segment/campaign endpoints
- **Campaign Clone**: Fixed reversed endpoint path (`/campaigns/clone/{id}` instead of `/campaigns/{id}/clone`)
- **Segment Batch Add**: Fixed contact IDs sent as strings instead of integers
- **Contact Points**: Fixed response extraction returning empty instead of success confirmation
- **Company Contact**: Fixed invalid default operation value causing UI initialization issue
- **Field Properties**: Fixed nested fixedCollection path for select/multiselect field creation and update
- **Contact DNC Filter**: Fixed pagination overshoot returning more results than requested limit
- **Social Media Fields**: Fixed field alias prefix causing social fields to not be recognized by API
- **Contact Update JSON**: Fixed raw JSON body overwriting UI field values instead of merging
- **Contact Notes Query**: Fixed raw options object leaking UI-specific keys to API query parameters
- **Campaign Get All**: Fixed keyed object response not converted to array for non-paginated requests
- **Segment Update**: Made name field optional for update operations (PATCH supports partial updates)
- **Role/User Simplify**: Removed non-functional simplify toggle (roles/users don't have contact-style field structure)
- **API Requests**: Removed empty JSON body from GET/DELETE requests for HTTP compliance
- **Contact Fields Processing**: Fixed rawData logic defaulting to raw mode when option not present
- **Company Fields**: Fixed typo in `numberOfEmployees` parameter name
- **UI Validation**: Added missing `required` flags on ID fields for Company Contact, Role, and User operations
- **Tag Limit**: Aligned code fallback default (50) with UI default
- **Theme Options**: Removed unsupported search/sort options from Theme getAll
- **Note Options**: Removed meaningless `publishedOnly` option from Note getAll
- **AI Tools**: Added `continueOnFail` support to AI Tools node
- **Contact Update**: Added empty-string sanitization matching contact create behavior
- **AI Tools Endpoints**: Fixed batch segment/campaign endpoints in AI tool executor matching main node fix

### Changed

- **Major version bump** to 1.0.0 reflecting AI Tools capability, API maturity, and 16 resources with 70+ operations
- Added `zod` (`^3.22.0`) as a runtime dependency
- Registered `MauticAdvancedAiTools.node.js` in `package.json` `n8n.nodes` array

## [0.9.0] - 2026-02-06
### Changed
- **Icon**: Replaced the node icon with a distinct custom icon to differentiate from the official n8n Mautic node
- **Project Clarification**: This is an unofficial community node built on top of n8n's official Mautic node due to the official node lacking required API coverage (e.g. notes, users, roles, stats, themes, emails, fields, notifications, advanced filtering, and more)

## [0.8.0] - 2026-02-06
### Added
- **Notes resource**: CRUD for contact notes (create, get, get many, update, delete).

## [0.7.6] - 2026-01-29
### Fixed
- Fixed issue with svg icon

## [0.7.5] - 2026-01-29
### Added
- **Contact Get Many**: Added structured search filters for Segment(s), Tag(s), Owner(s), Stage(s), and Campaign(s) with picklist selection
- **Contact Get Many**: Added match type option (Any/All) for Segment and Tag filters
- **Loaders**: Added `getSegmentAliases` and `getOwners` loaders for filter picklists


## [0.7.2] - 2026-01-29
### Fixed
- **Publish Process**: Added `prepublishOnly` script to automatically build before publishing, preventing outdated compiled files from being published

## [0.7.1] - 2026-01-29
### Fixed
- **Icon**: Fixed the issue with icon not showing due to case sensitivity misalignment

## [0.7.0] - 2026-01-27
### Added
- **Mautic Version Selector**: Added a `Mautic Version` option to Mautic Advanced credentials (v6 or lower / v7 or higher, default v6) so API calls can be routed to the appropriate endpoints.

### Fixed
- **Tag Descriptions (v7+)**: Tag create/update operations now use Mautic v2 tag endpoints when credentials are set to v7 or higher, allowing tag descriptions to be created and updated correctly. For Mautic v6 or lower, tag descriptions remain unsupported by the API and are ignored.


## [0.6.0] - 2026-01-23
### Added
- **Users Resource**: Added full CRUD support for Mautic Users (administrators) including create, get, get many, update, and delete operations with role, password, and profile field handling.
- **Roles Resource**: Added full CRUD support for Mautic Roles including create, get, get many, update, and delete operations with permissions management via rawPermissions JSON.
- **Stats Resource**: Added support for Mautic Stats endpoint with operations to list available statistical tables and retrieve data from any table with filtering, ordering, and pagination support.

## [0.5.2] - 2025-11-27
### Fixed
- **Package installation**: Added package clean to as part of the build.

## [0.5.1] - 2025-11-27
### Fixed
- **Case Sensitivity**: Fixed icon file references to use lowercase `mauticadvanced.svg` for Linux compatibility (case-sensitive file systems)

## [0.5.0] - 2025-11-25
### Added
- **Theme Resource**: Added full CRUD operations for theme management (get, getAll, create, delete) with binary file support for zip uploads and downloads
- **Email Resource**: Added full CRUD operations for email management (create, get, getAll, update, delete)
- **Email Create Reply**: Added operation to create reply records for email send stats
- **Email UX Enhancements**: Added option loaders for categories, forms, assets, and themes to improve user experience
- **Email Theme Selection**: Replaced Template string input with Theme optionLoader picklist in email create and update operations

### Enhanced
- **Option Picklists**: Alphabetically sorted all option picklists (Additional Fields, Update Fields, Options) across all resources for improved usability

## [0.4.1] - 2025-11-25
### Fixed
- **Contact Send Email**: Fixed parameter name mismatch (`campaignEmailId` vs `emailId`) preventing email sending

### Added
- **Contact Send Email**: Added support for custom tokens via key-value pairs UI
- **Contact Send Email**: Added support for asset attachments

### Enhanced
- **Category Create/Update**: Converted bundle field to dropdown with all 13 Mautic bundle values and color field to color picker for improved UX
- **Notification Resource**: Added warning notice indicating OneSignal plugin must be enabled and configured

## [0.4.0] - 2025-10-26
### Enhanced
- **Segment Filter Types**: Enhanced segment filter field type selection from free-text input to dropdown with all 17 valid Mautic field types (boolean, date, datetime, email, country, locale, lookup, number, tel, region, select, multiselect, text, textarea, time, timezone, url)
- **Segment Filter Operators**: Expanded segment filter operators to include all Mautic API operators:
  - Added numeric comparison operators: `>`, `>=`, `<`, `<=`
  - Added set operations: `in`, `!in`
  - Added range operations: `between`, `!between`
  - Total operators now: 18 operators covering all Mautic filter capabilities
- **Segment Filter Display**: Added optional `display` field for segment filter display names as supported by the Mautic API

## [0.3.9] - 2025-10-24
### Fixed
- **Numeric Field Types**: Fixed numeric fields (id, owner_id, points, etc.) being returned as strings instead of numbers in all get/getAll operations across all resources (Contact, Company, Campaign, Segment, Field, Notification, Tag, Category)
- **Data Type Consistency**: All numeric fields now return proper number types instead of string representations, improving data consistency and downstream processing
- **API Alignment**: Fixed Contact DNC endpoints to use correct API paths (`/contacts/{id}/dnc/{channel}/add|remove` instead of `/contacts/{id}/dnc/{channel}/{action}`)
- **API Alignment**: Fixed Contact Points endpoints to include `/{points}` in URL paths (`/contacts/{id}/points/plus|minus/{points}`)
- **API Alignment**: Added missing DNC parameters (`reason`, `channelId`, `comments`) and Points parameters (`eventName`, `actionName`)
- **API Alignment**: Added Campaign `alias` parameter to create/update operations
- **API Alignment**: Added `createIfNotFound` option to Campaign and Category update operations (uses PUT instead of PATCH)
- **API Alignment**: Added Contact list operations (`getOwners` and `getFields`) for `/contacts/list/owners` and `/contacts/list/fields` endpoints

## [0.3.8] - 2025-10-23
### Enhanced
- **Error Handling**: Significantly improved error handling for Contact creation operations with detailed validation error messages
- **API Error Parsing**: Enhanced error parsing to extract specific field validation errors from Mautic API responses
- **Data Sanitization**: Added automatic data sanitization in contact creation to remove empty values and validate email formats
- **Error Propagation**: Improved error object preservation in `mauticApiRequest` function to maintain detailed error context


## [0.3.7] - 2025-10-23
### Added
- **Field Management**: Added comprehensive support for managing custom fields for both Contact and Company records with full CRUD operations, all Mautic field types, and proper pagination support.
- **Notification Management**: Added full CRUD support for notifications with scheduling and language locale options.
- **Contact Operations**: Added new Contact operations for segment and campaign management:
  - Get Segments - Retrieve contact's segment memberships
  - Add to Segments - Add contact to multiple segments
  - Remove from Segments - Remove contact from multiple segments
  - Get Campaigns - Retrieve contact's campaign memberships
  - Add to Campaigns - Add contact to multiple campaigns
  - Remove from Campaigns - Remove contact from multiple campaigns
  - Get All Activity - Retrieve activity events across all contacts with filtering options

### Fixed
- **Contact Points**: Fixed `editContactPoint` operation to use correct Mautic API endpoints (`/points/plus` and `/points/minus`) and proper parameter handling
- **Contact Operations**: Removed incomplete `deleteBatch` operation from UI to prevent user errors
- **Performance**: Fixed slow loading of "Primary Company Name or ID" field by changing from dropdown to string input, eliminating unnecessary API calls when loading all companies


## [0.3.6] - 2025-09-13
### Fixes
- Fixed "fields.tags.split is not a function" error in Contact operations by adding support for array and object tag inputs 

## [0.3.5] - 2025-09-12
### Fixes
- Fixed incorrect API endpoint URL structure in 'Edit Do Not Contact List' operation causing "Contact not found" errors.

## [0.3.4] - 2025-09-12
### Fixed
- Various bug fixes

## [0.3.3] - 2025-07-25
### Fixed
- Fixed issue with icon not showing up due to case sensitivity

## [0.3.2] - 2025-07-24
### Fixed
- Fixed "Could not get parameter 'options'" error when using expressions in Contact Create and Contact Update operations.

## [0.3.1] - 2025-07-22
### Fixed
- Automatically format date filter values for known date fields to 'YYYY-MM-DD HH:mm:ss' UTC for Mautic API compatibility.

## [0.3.0] - 2025-07-22
### Added
- Advanced filtering: Added 'Where' advanced filter for Contact > Get Many, supporting nested andX/orX, date, and custom/system fields.
- System fields: Added system fields (date_added, date_modified, id, owner_id, email_dnc, dnc, sms_dnc) to advanced filter dropdown.
- DNC filtering: Users can now filter contacts by Do Not Contact status for email and SMS (done post processing)
- Field selection: Users can now choose which fields to return for Contact > Get and Get Many operations, using a multi-select 'Fields to Return' option.

## [0.2.5] - 2025-07-17
### Added
- Support for segments

### Fixed
- Corrected extraction of segment data for all segment operations to use the correct property names (`list` and `lists`) as returned by the Mautic API.
- Fixed 'Get Many Segments' to output an array of segment items instead of a single object, matching n8n conventions.
- Removed debugging statements from segment operations.

## [0.2.2] - 2025-07-17
### Added
- New 'Delete Batch' operation for the Contact resource. This allows batch deletion of contacts in a single API call, processing all incoming items together instead of one at a time.
- 'Contact IDs' field accepts a comma-separated list or uses all input items' contactId fields if left empty.

## [0.2.1] - 2025-07-17
### Fixes
- Enforced default sorting by id (ascending) for all getAll operations, and refactored pagination logic to always use consistent, robust page handling with improved error handling and edge case management. These changes together address issues with duplicated and missing records being returned for get many operations.

## [0.2.0] - 2025-07-16
- Removed max 30 records limit for contacts and companies; these operations now auto-paginate to return all results.

## [0.1.2] - 2025-07-16
- Added deduplication logic to all paginated 'get many' operations in `mauticApiRequestAllItems` to ensure unique records are returned for all resources (contacts, companies, campaigns, tags, etc.).
- This fix prevents duplicate output records when the Mautic API returns overlapping data across pages.

## [0.1.1]
- Original release. 
