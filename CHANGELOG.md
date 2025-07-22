# Changelog
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
