# Changelog


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
