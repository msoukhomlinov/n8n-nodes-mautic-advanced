# Changelog

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
