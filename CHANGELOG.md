# Changelog

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
