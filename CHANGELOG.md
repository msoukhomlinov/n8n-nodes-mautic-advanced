# Changelog

## [0.2.1] - 17 July 2025
### Fixes
- Enforced default sorting by id (ascending) for all getAll operations, and refactored pagination logic to always use consistent, robust page handling with improved error handling and edge case management. These changes together address issues with duplicated and missing records being returned for get many operations.

## [0.2.0] - 16 July 2025
- Removed max 30 records limit for contacts and companies; these operations now auto-paginate to return all results.

## [0.1.2] - 16 July 2025
- Added deduplication logic to all paginated 'get many' operations in `mauticApiRequestAllItems` to ensure unique records are returned for all resources (contacts, companies, campaigns, tags, etc.).
- This fix prevents duplicate output records when the Mautic API returns overlapping data across pages.

## [0.1.1]
- Original release. 
