# n8n Mautic Advanced Node

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg)](https://buymeacoffee.com/msoukhomlinov)

This project is an enhanced Mautic node for n8n, designed to provide more comprehensive support for the Mautic API. It builds upon the standard Mautic node by adding new resources and operations.

## What Makes This "Advanced"?

This enhanced version extends the standard n8n Mautic node with:

- **🏷️ Complete Tag Management**: Full CRUD operations for tags (missing in the standard node)
- **📊 Campaign Operations**: Create, clone, update, and manage campaigns
- **📁 Category Management**: Handle categories with bundle and color support
- **🔗 Advanced Relationship Management**: Sophisticated contact-to-campaign and contact-to-company associations
- **📧 Enhanced Email Operations**: Segment-based email sending capabilities
- **👥 Extended Contact Operations**: UTM tag management, activity tracking, device information, and notes
- **🏢 Complete Company Management**: Full company lifecycle with custom fields and address support

All resources support comprehensive filtering, pagination, and custom field management where applicable.

## Supported Resources and Operations

This enhanced Mautic node provides comprehensive support for the following Mautic API resources:

### 🏢 Companies
- **Create** a new company with full address and custom field support
- **Get** a company by ID
- **Get Many** companies with filtering and pagination
- **Update** company details
- **Delete** a company

### 👥 Contacts (Enhanced)
- **Create** a new contact with extensive field options
- **Get** a contact by ID
- **Get Many** contacts with advanced filtering
- **Update** contact details
- **Delete** a contact
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

### 🔗 Relationship Management
- **Campaign Contact**: Add/remove contacts to/from campaigns
- **Company Contact**: Add/remove contacts to/from companies
- **Contact Segment**: Add/remove contacts to/from segments

### 📧 Email Operations
- **Segment Email**: Send emails to segments

## Installation

To use this node, you will need to clone this repository and link it to your n8n instance.

1. Clone this repository.
2. Run `npm install` in the project root.
3. Run `npm run build` to compile the TypeScript code.
4. Link the node to your n8n installation by running `npm link` in the project root, and then `npm link n8n-nodes-mautic-advanced` in your n8n installation directory.

## Development

- `npm run dev`: To watch for changes and automatically recompile.
- `npm run lint`: To check for linting errors.
- `npm run format`: To format the code with Prettier.

## Support

If you find this node helpful and want to support its ongoing development, you can buy me a coffee:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg)](https://buymeacoffee.com/msoukhomlinov)

Your support helps maintain this project and develop new features.

## License

MIT License
