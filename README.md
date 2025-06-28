# n8n Mautic Advanced Node

This project is an enhanced Mautic node for n8n, designed to provide more comprehensive support for the Mautic API. It builds upon the standard Mautic node by adding new resources and operations.


## Supported Resources and Operations

This node provides full CRUD (Create, Read, Update, Delete) support for the following Mautic resources:

### Companies
- Create a new company
- Get a company by ID
- Get many companies with filtering and pagination
- Update a company's details
- Delete a company

### Contacts
- Create a new contact
- Get a contact by ID
- Get many contacts with advanced filtering
- Update a contact's details
- Delete a contact
- Special operations like sending emails, adjusting points, and managing DNC lists.

### Tags (New!)
- Create a new tag
- Get a tag by ID
- Get all tags with searching
- Update a tag's name and description
- Delete a tag

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

## License

MIT License
