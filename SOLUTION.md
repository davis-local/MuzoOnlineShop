# Solution Notes

## Overview

Muzo Online Shop is implemented as a product catalog management system with an ASP.NET Core Web API backend and a React + TypeScript frontend. The backend focuses on the requested C# language and framework features, while the frontend provides the administrator workflow for listing, searching, creating, editing, deleting, and categorizing products.

The original assignment requested Angular. I used React because it is the frontend stack I am most familiar with, which allowed me to focus more time on completing the product management workflow and the C# backend requirements.

## Backend Design

The API is built around a generic repository abstraction:

- `IRepository<T>` defines common CRUD operations.
- `Repository<T>` provides the Entity Framework Core implementation.
- `ProductRepository` uses the generic EF-backed base class.
- `InMemoryCategoryRepository` uses a `Dictionary<Guid, Category>` to satisfy the pure in-memory repository requirement.

Products are stored in EF Core's in-memory database. Categories are held in a dictionary-backed repository. This keeps the project easy to run locally without a database server.

## Search

`ProductSearchEngine<T>` is a reusable generic in-memory search utility that uses only core C# features. It supports:

- Multiple searchable fields
- Weighted scoring per field
- Exact, prefix, and contains matching
- Fuzzy token matching using an edit-distance style algorithm
- Score-based result ordering

The product API registers `ProductSearchEngine<Product>` through dependency injection with weighted selectors for name, SKU, and description. Search results are cached with `ProductSearchCache`, a small dictionary-backed cache that is cleared when products are created, updated, or deleted.

## API Features

Implemented endpoints include:

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `GET /api/categories`
- `GET /api/categories/tree`
- `POST /api/categories`

Additional endpoints demonstrate specific assignment requirements:

- `POST /api/auth/login` issues a demo JWT for the administrator UI.
- `GET /api/products/manual-search` manually reads query values from `HttpContext.Request.Query`.
- `GET /api/products/{id}/summary-json` writes JSON manually with `Utf8JsonWriter`.

Other backend requirements are covered by:

- Record DTOs in `DataTransferObjects`
- Pattern matching validation in `ProductRequestValidator`
- Nullable reference types enabled in the project file
- Custom LINQ extensions in `ProductLinqExtensions`
- Custom request timing middleware in `CustomRequestTimingMiddleware`
- Hierarchical category tree construction in `CategoryTreeTool`
- `IComparable<Product>` for custom product sorting

## Frontend Design

The frontend is a React + Vite SPA. It uses TypeScript interfaces for API models and a small API client in `src/lib/api.ts`.

Key screens and components:

- Login page with prefilled demo credentials
- Dashboard shell with overview, products, and categories sections
- Product grid and table views
- Product add/edit dialog
- Delete confirmation dialog
- Search input and category filter
- Category tree and table views

The UI uses Material UI and `iconsax-reactjs` to keep the interface clean and consistent.

## Authentication

Authentication was not required by the assignment, but a lightweight JWT flow is included. The login credentials are hardcoded for demo use:

```text
Email: davis@test.com
Password: davis@test
```

The token is stored in browser local storage and used for authenticated API calls. The seed script requires a copied token through `MUZO_API_TOKEN`.

## Demo Data

The seed script creates a useful local data set through the public API:

- 30 categories
- 200 products

It reuses existing categories by name and skips products with existing demo SKUs, so it can be run more than once without duplicating demo products.

## Testing

The repository includes a lightweight unit test using Node's built-in test runner. The test covers the frontend currency formatting helper.

Run tests with:

```bash
npm test
```

## Trade-offs

- The frontend uses React instead of Angular because React is my strongest frontend stack.
- Data persistence is intentionally in-memory to keep local setup simple.
- Category management is intentionally limited to listing and creating categories, matching the required category endpoints.
- The search cache is simple and process-local. It is enough for the assignment but would need expiration, size limits, or distributed storage in production.
- The JWT authentication is demo-focused and should not be treated as production identity management.
