# Beckn Discover API Design

## Overview

The `/beckn/discover` API is designed to provide a flexible, extensible search and discovery mechanism for heterogeneous item types while maintaining full JSON-LD compatibility. The API supports both structured queries and natural language queries, with the ability to filter across extended item schemas (ElectronicItem, GroceryItem, etc.) while returning a unified response structure.

## Key Design Principles

1. **Schema Extensibility**: Support for any item type that extends the base `Item.jsonld` schema
2. **JSON-LD Compatibility**: Full support for JSON-LD context and type information
3. **Heterogeneous Results**: Ability to return mixed item types in a single response
4. **Flexible Filtering**: Support for filtering on any field from extended item schemas
5. **Context Awareness**: Dynamic context generation based on returned item types

## API Endpoint

```
POST /beckn/discover
```

## Request Structure

### Base Request Format

```json
{
  "id": "api.beckn.discover",
  "ver": "v2",
  "ts": "2024-04-10T16:10:50+05:30",
  "params": {
    "msgid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "traceid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d"
  },
  "request": {
    "context": {
      "schema_contexts": [
        "https://becknprotocol.io/schema/context.jsonld",
        "https://becknprotocol.io/schema/items/ElectronicItem.jsonld",
        "https://becknprotocol.io/schema/items/GroceryItem.jsonld"
      ]
    },
    "search": {
      "structured_query": {
        "query": "gaming laptop premium tech",
        "search_fields": [
          "descriptor.name",
          "descriptor.short_desc",
          "electronic:brand.name",
          "electronic:sku"
        ],
        "filters": {
          "operator": "and",
          "conditions": [
            "rating.value >= 4.0",
            "electronic:brand.name = 'Premium Tech'",
            "electronic:price.schema:price <= 2000",
            "locations.gps within_radius(40.7128, -74.0060, 10km)"
          ]
        },
        "sort": [
          "rating.value desc",
          "electronic:price.schema:price asc"
        ],
        "fields": [
          "descriptor.name",
          "rating.value",
          "electronic:brand",
          "electronic:price"
        ],
        "pagination": {
          "page": 1,
          "limit": 20
        }
      },
      "natural_query": "I want to buy a red tesla model 3 under 50k near san francisco",
      "user_context": {
        "language": "en",
        "preferences": {
          "item_types": ["ElectronicItem", "GroceryItem"],
          "price_range": {"min": 0, "max": 50000}
        }
      }
    }
  }
}
```

### Request Schema Components

#### 1. Context Section

The `context` section allows clients to specify:
- **schema_contexts**: Array of JSON-LD context URIs for extended schemas

#### 2. Search Section

##### Structured Query

- **query**: Basic text search string
- **search_fields**: Array of field paths to search in
- **filters**: Complex filtering with support for extended schema fields
- **geo_search**: Geographic search capabilities
- **sort**: Multi-field sorting with extended schema support
- **fields**: Specific fields to return (supports extended schema fields)
- **pagination**: Result pagination

##### Natural Language Query

- **natural_query**: Human-readable search query
- **user_context**: User preferences and context for personalization

#### 3. Filter Syntax

Filters support extended schema fields using namespace prefixes:

```json
"filters": {
  "operator": "and",
  "conditions": [
    "rating.value >= 4.0",                           // Base Item field
    "electronic:brand.name = 'Premium Tech'",        // ElectronicItem field
    "electronic:price.schema:price <= 2000",         // Nested field access
    "electronic:sku = 'ELECTRONIC-LAPTOP-GAMING-RTX4070-16GB'", // SKU filter
    "locations.gps within_radius(40.7128, -74.0060, 10km)"     // Geographic filter
  ]
}
```

## Response Structure

### Base Response Format

```json
{
  "id": "api.beckn.discover",
  "ver": "v2",
  "ts": "2024-04-10T16:10:50+05:30",
  "params": {
    "msgid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "traceid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d"
  },
  "response": {
    "context": {
      "@context": {
        "@vocab": "https://becknprotocol.io/schema/",
        "beckn": "https://becknprotocol.io/schema/",
        "schema": "https://schema.org/",
        "electronic": "https://becknprotocol.io/schema/",
        "grocery": "https://becknprotocol.io/schema/",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "owl": "http://www.w3.org/2002/07/owl#"
      },
      "schema_uris": [
        "https://becknprotocol.io/schema/Item.jsonld",
        "https://becknprotocol.io/schema/items/ElectronicItem.jsonld",
        "https://becknprotocol.io/schema/items/GroceryItem.jsonld"
      ]
    },
    "results": {
      "total_count": 45,
      "page": 1,
      "limit": 20,
      "has_more": true,
      "items": [
        {
          "@context": "https://becknprotocol.io/schema/context.jsonld",
          "@type": "beckn:ElectronicItem",
          "electronic:electronicItemId": "laptop-item-001",
          "schema:name": "Premium Gaming Laptop Pro",
          "beckn:descriptor": {
            "@type": "beckn:Descriptor",
            "schema:name": "Premium Gaming Laptop Pro",
            "beckn:shortDesc": "High-performance gaming laptop with RTX graphics"
          },
          "electronic:price": {
            "@type": "beckn:Price",
            "schema:price": 1499.99,
            "schema:priceCurrency": "USD"
          },
          "electronic:brand": {
            "@type": "schema:Brand",
            "schema:name": "Premium Tech"
          },
          "beckn:rating": {
            "@type": "beckn:Rating",
            "beckn:ratingValue": 4.8,
            "beckn:ratingCount": 156
          }
        },
        {
          "@context": "https://becknprotocol.io/schema/context.jsonld",
          "@type": "beckn:GroceryItem",
          "grocery:groceryItemId": "organic-apples-001",
          "schema:name": "Organic Gala Apples",
          "beckn:descriptor": {
            "@type": "beckn:Descriptor",
            "schema:name": "Organic Gala Apples",
            "beckn:shortDesc": "Fresh organic apples"
          },
          "grocery:price": {
            "@type": "beckn:Price",
            "schema:price": 4.99,
            "schema:priceCurrency": "USD"
          },
          "grocery:organicCertification": "USDA Organic",
          "beckn:rating": {
            "@type": "beckn:Rating",
            "beckn:ratingValue": 4.9,
            "beckn:ratingCount": 156
          }
        }
      ]
    },
    "facets": {
      "item_types": [
        {"type": "ElectronicItem", "count": 23},
        {"type": "GroceryItem", "count": 22}
      ],
      "price_ranges": [
        {"range": "0-100", "count": 15},
        {"range": "100-1000", "count": 18},
        {"range": "1000+", "count": 12}
      ],
      "brands": [
        {"brand": "Premium Tech", "count": 8},
        {"brand": "Fresh Market Organic", "count": 12}
      ]
    },
    "suggestions": [
      "gaming laptop",
      "rtx graphics",
      "organic bananas",
      "fresh milk"
    ]
  }
}
```

### Response Schema Components

#### 1. Context Section

The response context includes:
- **@context**: JSON-LD context with all necessary namespaces
- **schema_uris**: Array of schema URIs for returned item types

#### 2. Results Section

- **total_count**: Total number of matching items
- **page**: Current page number
- **limit**: Items per page
- **has_more**: Boolean indicating more results available
- **items**: Array of heterogeneous items with proper `@type` annotations

#### 3. Facets Section

Aggregated information about results:
- **item_types**: Count of each item type
- **price_ranges**: Price distribution
- **brands**: Brand distribution
- **categories**: Category distribution

#### 4. Suggestions Section

Search suggestions based on the query

## Implementation Considerations

### 1. Schema Registry

The API should maintain a registry of available item schemas:

```json
{
  "schemas": {
    "Item": {
      "uri": "https://becknprotocol.io/schema/Item.jsonld",
      "type": "base",
      "fields": ["id", "descriptor", "category", "rating"]
    },
    "ElectronicItem": {
      "uri": "https://becknprotocol.io/schema/items/ElectronicItem.jsonld",
      "type": "extended",
      "base": "Item",
      "fields": ["electronic:brand", "electronic:sku", "electronic:price"]
    },
    "GroceryItem": {
      "uri": "https://becknprotocol.io/schema/items/GroceryItem.jsonld",
      "type": "extended",
      "base": "Item",
      "fields": ["grocery:expiryDate", "grocery:nutritionalInfo", "grocery:organicCertification"]
    }
  }
}
```

### 2. Dynamic Context Generation

The API should dynamically generate the response context based on:
- Requested schema contexts
- Actually returned item types
- Field usage in filters and search

### 3. Field Resolution

Support for field resolution across extended schemas:

```json
"search_fields": [
  "descriptor.name",                    // Base Item field
  "descriptor.short_desc",              // Base Item field
  "electronic:brand.name",             // ElectronicItem field
  "electronic:sku"                     // ElectronicItem field
]
```

### 4. Filter Processing

Filters should be processed with awareness of:
- Field existence in different schemas
- Data type validation
- Cross-schema field relationships

### 5. Result Aggregation

The API should aggregate results from multiple item types while:
- Maintaining type information
- Preserving schema-specific fields
- Providing unified sorting and pagination

## Error Handling

### Schema Validation Errors

```json
{
  "error": {
    "code": "INVALID_SCHEMA_FIELD",
    "message": "Field 'electronic:invalidField' not found in ElectronicItem schema",
    "details": {
      "field": "electronic:invalidField",
      "schema": "ElectronicItem",
      "available_fields": ["electronic:brand", "electronic:sku", "electronic:price"]
    }
  }
}
```

### Context Resolution Errors

```json
{
  "error": {
    "code": "CONTEXT_RESOLUTION_FAILED",
    "message": "Failed to resolve schema context for 'https://invalid-schema.com'",
    "details": {
      "context_uri": "https://invalid-schema.com",
      "available_contexts": ["https://becknprotocol.io/schema/context.jsonld"]
    }
  }
}
```

## Extensibility Features

### 1. New Item Types

Adding new item types requires:
- Creating new JSON-LD schema file
- Updating schema registry
- No changes to API interface

### 2. Custom Fields

Extended schemas can add custom fields without affecting:
- Base API functionality
- Other item types
- Core search capabilities

### 3. Schema Evolution

The API supports:
- Backward compatibility
- Schema versioning
- Gradual schema updates

## Performance Considerations

### 1. Indexing Strategy

- Index common fields across all item types
- Type-specific indexes for extended fields
- Composite indexes for frequently used filter combinations

### 2. Query Optimization

- Query planning based on available schemas
- Field existence checking before filter application
- Result set size optimization

### 3. Caching

- Schema context caching
- Frequently used filter result caching
- Facet aggregation caching

## Security Considerations

### 1. Schema Validation

- Validate all schema URIs
- Prevent schema injection attacks
- Sanitize field references

### 2. Access Control

- Schema-level access control
- Field-level access control
- Rate limiting per schema

### 3. Data Privacy

- Field-level privacy controls
- User context isolation
- Audit logging for schema access

## Future Enhancements

### 1. GraphQL Integration

- GraphQL schema generation from JSON-LD
- GraphQL query support
- Schema introspection

### 2. Machine Learning

- Query intent recognition
- Personalized result ranking
- Schema recommendation

### 3. Real-time Updates

- WebSocket support for live results
- Schema change notifications
- Real-time filtering

## Conclusion

This design provides a robust, extensible foundation for the `/beckn/discover` API that:

1. **Maintains JSON-LD compatibility** while supporting heterogeneous item types
2. **Enables flexible filtering** across extended schema fields
3. **Provides dynamic context generation** based on actual result types
4. **Supports schema evolution** without breaking changes
5. **Ensures performance** through intelligent indexing and caching
6. **Maintains security** through proper validation and access controls

The API design follows Beckn protocol principles while providing the flexibility needed for modern e-commerce applications with diverse product catalogs.