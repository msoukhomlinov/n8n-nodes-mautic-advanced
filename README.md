# n8n Mautic Advanced Node

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg)](https://buymeacoffee.com/msoukhomlinov)

Enhanced n8n node for Mautic with comprehensive API coverage including tags, campaigns, categories, notifications, and advanced contact management.

## 📋 Table of Contents

- [What Makes This "Advanced"?](#what-makes-this-advanced)
- [Features](#features)
- [Supported Resources and Operations](#supported-resources-and-operations)
- [Installation](#installation)
- [Authentication](#authentication)
- [Advanced Features](#advanced-features)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [Support](#support)
- [License](#license)

## What Makes This "Advanced"?

This enhanced version extends the standard n8n Mautic node with:

- **🏷️ Complete Tag Management**: Full CRUD operations for tags (missing in the standard node)
- **📊 Campaign Operations**: Create, clone, update, and manage campaigns
- **📁 Category Management**: Handle categories with bundle and color support
- **🔔 Notification Management**: Full CRUD operations for notifications with scheduling and language support
- **🔗 Advanced Relationship Management**: Sophisticated contact-to-campaign and contact-to-company associations
- **📧 Enhanced Email Operations**: Segment-based email sending capabilities
- **👥 Extended Contact Operations**: UTM tag management, activity tracking, device information, and notes
- **🏢 Complete Company Management**: Full company lifecycle with custom fields and address support
- **🔍 Advanced Filtering**: Where filters, DNC filtering, and field selection
- **📅 Smart Date Handling**: Automatic date formatting for Mautic API compatibility

## Features

### 🚀 Core Features
- **Comprehensive API Coverage**: All major Mautic API endpoints supported
- **Advanced Filtering**: Where filters with nested conditions (andX/orX)
- **DNC Management**: Filter contacts by Do Not Contact status
- **Field Selection**: Choose which fields to return for Contact operations
- **Pagination Support**: Automatic handling of large datasets
- **Custom Fields**: Full support for custom field management
- **Error Handling**: Robust error handling and validation

### 🔐 Authentication
- **API Credentials**: Simple API key authentication
- **OAuth2**: Full OAuth2 flow support for secure authentication

### 📊 Data Management
- **RAW Data Options**: Control data output format
- **System Fields**: Built-in support for system fields
- **Date Formatting**: Automatic UTC date formatting
- **Deduplication**: Prevents duplicate records in paginated results

## Supported Resources and Operations

### 🏢 Companies
- **Create** a new company with full address and custom field support
- **Get** a company by ID
- **Get Many** companies with filtering and pagination
- **Update** company details
- **Delete** a company

### 👥 Contacts (Enhanced)
- **Create** a new contact with extensive field options
- **Get** a contact by ID with field selection
- **Get Many** contacts with advanced filtering and DNC options
- **Update** contact details
- **Delete** a contact
- **Delete Batch** multiple contacts in one operation
- **Send Email** to a contact
- **Edit Contact Points** (add/subtract points)
- **Edit Do Not Contact List** (add/remove from DNC)
- **Add/Remove UTM Tags** for tracking
- **Get Notes** associated with a contact
- **Get Activity** history for a contact
- **Get Companies** associated with a contact
- **Get Devices** used by a contact

### 🏷️ Tags
- **Create** a new tag with description
- **Get** a tag by ID
- **Get Many** tags with search capabilities
- **Update** tag name and description
- **Delete** a tag

### 📊 Campaigns
- **Create** a new campaign
- **Get** a campaign by ID
- **Get All** campaigns
- **Update** campaign details
- **Delete** a campaign
- **Clone** an existing campaign
- **Get Contacts** in a campaign

### 📁 Categories
- **Create** a new category with bundle and color settings
- **Get** a category by ID
- **Get Many** categories
- **Update** category details
- **Delete** a category

### 🔔 Notifications
- **Create** a new notification with scheduling and language support
- **Get** a notification by ID
- **Get Many** notifications with filtering
- **Update** notification details
- **Delete** a notification

### 📋 Segments
- **Create** a new segment
- **Get** a segment by ID
- **Get Many** segments with filtering
- **Update** segment details
- **Delete** a segment

### 🔗 Relationship Management
- **Campaign Contact**: Add/remove contacts to/from campaigns
- **Company Contact**: Add/remove contacts to/from companies
- **Contact Segment**: Add/remove contacts to/from segments

### 📧 Email Operations
- **Segment Email**: Send emails to segments

### 👤 Users
- **Create** a new Mautic user (administrator) with role, password, and profile fields
- **Get** a user by ID
- **Get Many** users with basic filtering and pagination
- **Update** user details including role, profile fields, and password
- **Delete** a user

### 🔐 Roles
- **Create** a new role with name, description, and permissions
- **Get** a role by ID
- **Get Many** roles with filtering and pagination
- **Update** role details including permissions
- **Delete** a role

### 📈 Stats
- **Get Available Tables** to list all statistical tables and their columns
- **Get Stats** from a specific table with filtering, ordering, and pagination

## Installation

### Method 1: npm (Recommended)
```bash
npm install n8n-nodes-mautic-advanced
```

### Method 2: Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/msoukhomlinov/n8n-nodes-mautic-advanced.git
   cd n8n-nodes-mautic-advanced
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the node:
   ```bash
   npm run build
   ```

4. Link to your n8n installation:
   ```bash
   npm link
   cd /path/to/your/n8n/installation
   npm link n8n-nodes-mautic-advanced
   ```

## Authentication

### API Credentials
1. Go to your Mautic instance
2. Navigate to **Settings** → **API Credentials**
3. Create a new API credential
4. Copy the **Public Key** and **Secret Key**
5. In n8n, add a new Mautic Advanced credential
6. Select **Credentials** authentication method
7. Enter your Mautic URL, Public Key, and Secret Key

### OAuth2
1. In n8n, add a new Mautic Advanced credential
2. Select **OAuth2** authentication method
3. Enter your Mautic URL
4. Follow the OAuth2 authorization flow

## Advanced Features

### Where Filters
Advanced filtering for Contact > Get Many operations:
- **Nested Conditions**: Support for andX/orX logical operators
- **Multiple Expressions**: eq, neq, lt, lte, gt, gte, between, in, isNull, isNotNull
- **Custom Fields**: Filter by any custom or system field
- **Date Filtering**: Automatic date formatting for Mautic API

### DNC Filtering
Filter contacts by Do Not Contact status:
- **Email DNC Only**: Contacts with email DNC enabled
- **SMS DNC Only**: Contacts with SMS DNC enabled
- **Any DNC Only**: Contacts with any DNC enabled

### Field Selection
Choose which fields to return for Contact operations:
- **System Fields**: date_added, date_modified, id, owner_id
- **Custom Fields**: Any custom field defined in Mautic
- **All Fields**: Return complete contact data

### Date Formatting
Automatic date formatting for known date fields:
- **Format**: YYYY-MM-DD HH:mm:ss UTC
- **Compatibility**: Ensures Mautic API compatibility
- **Fields**: date_added, date_modified, lastActive, etc.

## Usage Examples

### Create a Contact with Tags
```javascript
// Contact Create operation
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "additionalFields": {
    "tags": ["customer", "vip"],
    "company": "Example Corp",
    "phone": "+1234567890"
  }
}
```

### Filter Contacts with Where Conditions
```javascript
// Contact Get Many with Where filter
{
  "where": {
    "conditions": [
      {
        "col": "email",
        "expr": "neq",
        "val": ""
      },
      {
        "col": "date_added",
        "expr": "gte",
        "val": "2024-01-01"
      }
    ]
  }
}
```

### Send Email to Segment
```javascript
// Segment Email operation
{
  "segmentId": "123",
  "emailId": "456",
  "options": {
    "sendToNewOnly": true
  }
}
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- n8n development environment

### Commands
```bash
# Install dependencies
npm install

# Build the node
npm run build

# Watch for changes (development)
npm run dev

# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format
```

### Project Structure
```
├── credentials/          # Authentication credentials
├── nodes/               # Node implementations
│   └── MauticAdvanced/  # Main node files
├── dist/                # Compiled output
├── package.json         # Project configuration
└── README.md           # This file
```

## Troubleshooting

### Common Issues

#### "Could not get parameter 'options'" Error
**Cause**: Missing Options parameter in node definition
**Solution**: Update to latest version (0.3.2+) which includes all required Options parameters

#### Authentication Errors
**Cause**: Incorrect credentials or URL
**Solution**: 
- Verify Mautic URL format (https://your-mautic.com)
- Check API credentials are active
- Ensure proper permissions for API access

#### Date Filter Issues
**Cause**: Incorrect date format
**Solution**: Use YYYY-MM-DD format for date filters

#### Pagination Problems
**Cause**: Large datasets causing timeouts
**Solution**: Use "Return All" option or set appropriate limits

### Getting Help
1. Check the [Changelog](CHANGELOG.md) for recent fixes
2. Search existing [Issues](https://github.com/msoukhomlinov/n8n-nodes-mautic-advanced/issues)
3. Create a new issue with detailed information

## Support

If you find this node helpful and want to support its ongoing development, you can buy me a coffee:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg)](https://buymeacoffee.com/msoukhomlinov)

Your support helps maintain this project and develop new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Built with [n8n](https://n8n.io/) workflow automation platform
- Uses [change-case](https://github.com/blakeembrey/change-case) for string manipulation
- Icons and design inspired by n8n community standards
