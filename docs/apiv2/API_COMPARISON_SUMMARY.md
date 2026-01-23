# Mautic API v1 vs v2 Comparison Summary

**Document Version:** 1.1  
**Date:** 2026-01-23  
**Node Version:** 0.6.0  
**OpenAPI Spec Version:** 7.0.0 (28 resources, 190 operations)

## Overview

This document provides a comprehensive comparison between the Mautic API v1 endpoints currently used in this n8n node implementation and the Mautic API v2 endpoints documented in the OpenAPI specification (`docs/apiv2/v7.0.0/docs.yamlopenapi.yml`).

**Purpose:** This document serves as a reference when aligning the v2 API implementation to match the v1 API functionality currently used in this node.

> **Note:** All v2 endpoints listed in this document have been verified against the OpenAPI specification.

---

## Key Architectural Differences

### API Base Path

| Aspect | v1 API (Current Implementation) | v2 API (OpenAPI Spec) |
|--------|----------------------------------|----------------------|
| Base Path | `/api/` | `/api/v2/` |
| Versioning | Implicit (no version in path) | Explicit version in path |
| Endpoint Style | Action-based with suffixes | RESTful resource-based |

### HTTP Methods

| Operation | v1 API Pattern | v2 API Pattern |
|-----------|----------------|----------------|
| Create | `POST /api/{resource}/new` | `POST /api/v2/{resource}` |
| Read (Single) | `GET /api/{resource}/{id}` | `GET /api/v2/{resource}/{id}` |
| Read (Collection) | `GET /api/{resource}` | `GET /api/v2/{resource}` |
| Update | `PATCH /api/{resource}/{id}/edit` | `PATCH /api/v2/{resource}/{id}` or `PUT /api/v2/{resource}/{id}` |
| Delete | `DELETE /api/{resource}/{id}/delete` | `DELETE /api/v2/{resource}/{id}` |

---

## Resource-by-Resource Comparison

### Contacts

#### Standard CRUD Operations

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/contacts/new` | `POST /api/v2/contacts` | ✅ Needs mapping |
| Get Single | `GET /api/contacts/{id}` | `GET /api/v2/contacts/{id}` | ✅ Compatible |
| Get All | `GET /api/contacts` | `GET /api/v2/contacts` | ✅ Compatible |
| Update | `PATCH /api/contacts/{id}/edit` | `PATCH /api/v2/contacts/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/contacts/{id}/delete` | `DELETE /api/v2/contacts/{id}` | ✅ Needs mapping |

#### Extended Contact Operations (v1 Only - Not in v2 Spec)

These operations are **NOT** documented in the OpenAPI v2 spec but are implemented in the node:

| Operation | v1 Endpoint | v2 Equivalent | Migration Notes |
|-----------|-------------|---------------|-----------------|
| Add Points | `POST /api/contacts/{id}/points/plus/{points}` | ❌ Not in spec | May need custom endpoint or different approach |
| Remove Points | `POST /api/contacts/{id}/points/minus/{points}` | ❌ Not in spec | May need custom endpoint or different approach |
| Add to DNC | `POST /api/contacts/{id}/dnc/{channel}/add` | ❌ Not in spec | May need custom endpoint or different approach |
| Remove from DNC | `POST /api/contacts/{id}/dnc/{channel}/remove` | ❌ Not in spec | May need custom endpoint or different approach |
| Add UTM Tags | `POST /api/contacts/{id}/utm/add` | ❌ Not in spec | May need custom endpoint or different approach |
| Remove UTM Tags | `POST /api/contacts/{id}/utm/{utmId}/remove` | ❌ Not in spec | May need custom endpoint or different approach |
| Get Devices | `GET /api/contacts/{id}/devices` | ❌ Not in spec | May be under relationships or separate endpoint |
| Get Activity | `GET /api/contacts/{id}/activity` | ❌ Not in spec | May be under relationships or separate endpoint |
| Get Notes | `GET /api/contacts/{id}/notes` | ❌ Not in spec | May be under relationships or separate endpoint |
| Get Companies | `GET /api/contacts/{id}/companies` | ❌ Not in spec | May be under relationships |
| Get Campaigns | `GET /api/contacts/{id}/campaigns` | ❌ Not in spec | May be under relationships |
| Get Segments | `GET /api/contacts/{id}/segments` | ❌ Not in spec | May be under relationships |
| Add to Segments | `POST /api/contacts/{id}/segments/add` | ❌ Not in spec | May need relationship endpoint |
| Remove from Segments | `POST /api/contacts/{id}/segments/remove` | ❌ Not in spec | May need relationship endpoint |
| Add to Campaigns | `POST /api/contacts/{id}/campaigns/add` | ❌ Not in spec | May need relationship endpoint |
| Remove from Campaigns | `POST /api/contacts/{id}/campaigns/remove` | ❌ Not in spec | May need relationship endpoint |
| Get All Activity | `GET /api/contacts/activity` | ❌ Not in spec | May need separate endpoint |
| Get Owners List | `GET /api/contacts/list/owners` | ❌ Not in spec | May need separate endpoint |
| Get Fields List | `GET /api/contacts/list/fields` | ❌ Not in spec | May need separate endpoint |
| Send Email | `POST /api/emails/{emailId}/contact/{contactId}/send` | ❌ Not in spec | May need separate endpoint |

### Companies

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/companies/new` | `POST /api/v2/companies` | ✅ Needs mapping |
| Get Single | `GET /api/companies/{id}` | `GET /api/v2/companies/{id}` | ✅ Compatible |
| Get All | `GET /api/companies` | `GET /api/v2/companies` | ✅ Compatible |
| Update | `PATCH /api/companies/{id}/edit` | `PATCH /api/v2/companies/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/companies/{id}/delete` | `DELETE /api/v2/companies/{id}` | ✅ Needs mapping |

### Campaigns

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/campaigns/new` | `POST /api/v2/campaigns` | ✅ Needs mapping |
| Get Single | `GET /api/campaigns/{id}` | `GET /api/v2/campaigns/{id}` | ✅ Compatible |
| Get All | `GET /api/campaigns` | `GET /api/v2/campaigns` | ✅ Compatible |
| Update | `PATCH /api/campaigns/{id}/edit` | `PATCH /api/v2/campaigns/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/campaigns/{id}/delete` | `DELETE /api/v2/campaigns/{id}` | ✅ Needs mapping |
| Clone | `POST /api/campaigns/{id}/clone` | ❌ Not in spec | ⚠️ Missing in v2 |
| Get Contacts | `GET /api/campaigns/{id}/contacts` | ❌ Not in spec | May be under relationships |

### Segments

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/segments/new` | `POST /api/v2/segments` | ✅ Needs mapping |
| Get Single | `GET /api/segments/{id}` | `GET /api/v2/segments/{id}` | ✅ Compatible |
| Get All | `GET /api/segments` | `GET /api/v2/segments` | ✅ Compatible |
| Update | `PATCH /api/segments/{id}/edit` | `PATCH /api/v2/segments/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/segments/{id}/delete` | `DELETE /api/v2/segments/{id}` | ✅ Needs mapping |
| Add Contact | `POST /api/segments/{id}/contact/{contactId}/add` | ❌ Not in spec | ⚠️ Missing in v2 |
| Remove Contact | `POST /api/segments/{id}/contact/{contactId}/remove` | ❌ Not in spec | ⚠️ Missing in v2 |
| Add Contacts (Batch) | `POST /api/segments/{id}/contacts/add` | ❌ Not in spec | ⚠️ Missing in v2 |

### Tags

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/tags/new` | `POST /api/v2/tags` | ✅ Needs mapping |
| Get Single | `GET /api/tags/{id}` | `GET /api/v2/tags/{id}` | ✅ Compatible |
| Get All | `GET /api/tags` | `GET /api/v2/tags` | ✅ Compatible |
| Update | `PATCH /api/tags/{id}/edit` | `PATCH /api/v2/tags/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/tags/{id}/delete` | `DELETE /api/v2/tags/{id}` | ✅ Needs mapping |

### Categories

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/categories/new` | `POST /api/v2/categories` | ✅ Needs mapping |
| Get Single | `GET /api/categories/{id}` | `GET /api/v2/categories/{id}` | ✅ Compatible |
| Get All | `GET /api/categories` | `GET /api/v2/categories` | ✅ Compatible |
| Update | `PATCH /api/categories/{id}/edit` | `PATCH /api/v2/categories/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/categories/{id}/delete` | `DELETE /api/v2/categories/{id}` | ✅ Needs mapping |

### Emails

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/emails/new` | `POST /api/v2/emails` | ✅ Needs mapping |
| Get Single | `GET /api/emails/{id}` | `GET /api/v2/emails/{id}` | ✅ Compatible |
| Get All | `GET /api/emails` | `GET /api/v2/emails` | ✅ Compatible |
| Update | `PATCH /api/emails/{id}/edit` | `PATCH /api/v2/emails/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/emails/{id}/delete` | `DELETE /api/v2/emails/{id}` | ✅ Needs mapping |
| Send to Segment | `POST /api/emails/{id}/send` | ❌ Not in spec | ⚠️ Missing in v2 |
| Reply Tracking | `POST /api/emails/reply/{trackingHash}` | ❌ Not in spec | ⚠️ Missing in v2 |

### Notifications

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/notifications/new` | `POST /api/v2/notifications` | ✅ Needs mapping |
| Get Single | `GET /api/notifications/{id}` | `GET /api/v2/notifications/{id}` | ✅ Compatible |
| Get All | `GET /api/notifications` | `GET /api/v2/notifications` | ✅ Compatible |
| Update | `PATCH /api/notifications/{id}/edit` | `PATCH /api/v2/notifications/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/notifications/{id}/delete` | `DELETE /api/v2/notifications/{id}` | ✅ Needs mapping |

### Users

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/users/new` | `POST /api/v2/users` | ✅ Needs mapping |
| Get Single | `GET /api/users/{id}` | `GET /api/v2/users/{id}` | ✅ Compatible |
| Get All | `GET /api/users` | `GET /api/v2/users` | ✅ Compatible |
| Update | `PATCH /api/users/{id}/edit` | `PATCH /api/v2/users/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/users/{id}/delete` | `DELETE /api/v2/users/{id}` | ✅ Needs mapping |

### Roles

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/roles/new` | `POST /api/v2/roles` | ✅ Needs mapping |
| Get Single | `GET /api/roles/{id}` | `GET /api/v2/roles/{id}` | ✅ Compatible |
| Get All | `GET /api/roles` | `GET /api/v2/roles` | ✅ Compatible |
| Update | `PATCH /api/roles/{id}/edit` | `PATCH /api/v2/roles/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/roles/{id}/delete` | `DELETE /api/v2/roles/{id}` | ✅ Needs mapping |

### Fields

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/fields/{object}/new` | `POST /api/v2/fields` | ✅ Needs mapping |
| Get Single | `GET /api/fields/{object}/{id}` | `GET /api/v2/fields/{id}` | ✅ Needs mapping (object param) |
| Get All | `GET /api/fields/{object}` | `GET /api/v2/fields` | ✅ Needs mapping (object param) |
| Update | `PATCH /api/fields/{object}/{id}/edit` | `PATCH /api/v2/fields/{id}` | ✅ Needs mapping |
| Delete | `DELETE /api/fields/{object}/{id}/delete` | `DELETE /api/v2/fields/{id}` | ✅ Needs mapping |

### Themes

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Create | `POST /api/themes/new` | ❌ Not in spec | ⚠️ Missing in v2 |
| Get Single | `GET /api/themes/{name}` | ❌ Not in spec | ⚠️ Missing in v2 |
| Get All | `GET /api/themes` | ❌ Not in spec | ⚠️ Missing in v2 |
| Delete | `DELETE /api/themes/{name}/delete` | ❌ Not in spec | ⚠️ Missing in v2 |

### Stats

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Get Table Stats | `GET /api/stats/{table}` | ❌ Not in spec | ⚠️ Missing in v2 |

### Company-Contact Relationships

| Operation | v1 Endpoint | v2 Endpoint | Status |
|-----------|-------------|-------------|--------|
| Add Contact | `POST /api/companies/{id}/contact/{contactId}/add` | ❌ Not in spec | May need relationship endpoint |
| Remove Contact | `POST /api/companies/{id}/contact/{contactId}/remove` | ❌ Not in spec | May need relationship endpoint |

---

## Request/Response Format Differences

### Content Types

| Aspect | v1 API | v2 API |
|--------|--------|--------|
| Primary Format | `application/json` | `application/json` |
| Additional Formats | Simple JSON | `application/ld+json` (JSON-LD), `application/vnd.api+json` (JSON API), `text/html` |
| Response Structure | `{ resource: {...} }` | JSON API format with `data`, `attributes`, `relationships` |

### Response Examples

**v1 API Response:**
```json
{
  "contact": {
    "id": 123,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

**v2 API Response (JSON API format):**
```json
{
  "data": {
    "type": "contacts",
    "id": "123",
    "attributes": {
      "email": "user@example.com",
      "firstname": "John",
      "lastname": "Doe"
    },
    "relationships": {
      "owner": { "data": { "type": "users", "id": "1" } },
      "tags": { "data": [] }
    }
  }
}
```

---

## Query Parameters and Filtering

### Pagination

| Aspect | v1 API | v2 API |
|--------|--------|--------|
| Offset Parameter | `start` | `page` |
| Limit Parameter | `limit` | Implicit in pagination |
| Default Limit | 30 | Varies |

### Filtering

**v1 API:**
- Custom `where` parameter with nested conditions
- Supports `andX` and `orX` logical operators
- Field-specific filtering (e.g., `emailDncOnly`, `smsDncOnly`)
- Custom query building with `buildQueryFromOptions`

**v2 API:**
- Standard query parameters
- May support filtering through query string (needs verification)

### Field Selection

**v1 API:**
- Custom `fieldsToReturn` parameter
- Field selection via query options

**v2 API:**
- May support field selection via `fields` parameter (needs verification)

---

## Resources in v2 Spec Not Implemented in Node

The following resources are documented in the OpenAPI v2 spec but are **not** currently implemented in this node:

| Resource | v2 Endpoint | Notes |
|----------|-------------|-------|
| Actions | `/api/v2/actions` | Form/campaign actions |
| Assets | `/api/v2/assets` | File/document assets |
| Channels | `/api/v2/channels` | Communication channels |
| Contact Categories | `/api/v2/contactcategories` | Contact categorisation |
| Downloads | `/api/v2/downloads` | Asset download tracking |
| Events | `/api/v2/events` | Activity/audit events |
| Forms | `/api/v2/forms` | Form management |
| Messages | `/api/v2/messages` | Marketing messages |
| Pages | `/api/v2/pages` | Landing pages |
| Permissions | `/api/v2/permissions` | Permission management |
| Points | `/api/v2/points` | Points configuration (node uses contact-specific endpoints) |
| Projects | `/api/v2/projects` | Project management |
| Reports | `/api/v2/reports` | Reporting/analytics |
| SMS | `/api/v2/sms` | SMS messaging |
| Stages | `/api/v2/stages` | Pipeline stages (referenced in node but not directly implemented) |
| Triggers | `/api/v2/triggers` | Campaign/form triggers |
| Webhooks | `/api/v2/webhooks` | Webhook management |

---

## Migration Considerations

### High Priority (Core Functionality)

1. **Endpoint Path Mapping**
   - Update base path from `/api/` to `/api/v2/`
   - Remove action suffixes (`/new`, `/edit`, `/delete`)
   - Map HTTP methods correctly (PUT vs PATCH)

2. **Response Format Handling**
   - Parse JSON API format responses
   - Extract data from `data.attributes` structure
   - Handle relationships structure

3. **Request Format**
   - Convert request bodies to JSON API format if required
   - Handle content-type headers appropriately

### Medium Priority (Extended Features)

1. **Missing Endpoints**
   - Identify alternative v2 endpoints for v1-only operations
   - Implement workarounds for missing functionality
   - Document limitations

2. **Query Parameters**
   - Map `start`/`limit` to `page`-based pagination
   - Convert `where` filters to v2 query format
   - Handle field selection parameters

### Low Priority (Nice to Have)

1. **Additional Resources**
   - Consider implementing missing v2 resources (Actions, Assets, etc.)
   - Evaluate usefulness for node users

2. **Enhanced Features**
   - Leverage v2 API improvements
   - Support multiple content types if beneficial

---

## Testing Strategy

When migrating to v2 API, test the following:

1. **Basic CRUD Operations**
   - Create, Read, Update, Delete for all resources
   - Verify data integrity

2. **Extended Operations**
   - Points management
   - DNC management
   - UTM tag management
   - Relationship operations

3. **Pagination**
   - Large dataset retrieval
   - Pagination boundaries

4. **Filtering**
   - Where clauses
   - Nested conditions (andX/orX)
   - DNC filters

5. **Error Handling**
   - Invalid requests
   - Missing resources
   - Permission errors

---

## Notes

- The v1 API endpoints are more action-oriented and provide convenience methods not available in the standard REST v2 API
- Some v1 operations may need to be implemented using v2 relationship endpoints or custom endpoints
- The v2 API follows JSON API specification, which requires different response parsing
- Backward compatibility should be maintained where possible during migration

---

## References

- OpenAPI Specification: `docs/apiv2/v7.0.0/docs.yamlopenapi.yml`
- Node Implementation: `nodes/MauticAdvanced/operations/`
- Generic Functions: `nodes/MauticAdvanced/GenericFunctions.ts`

---

**Last Updated:** 2026-01-23  
**Maintained By:** Node Development Team
