# Beckn Discover API Design

## Table of Contents
1. [Overview](#overview)
2. [Key Design Principles](#key-design-principles)
3. [API Endpoints](#api-endpoints)
4. [Request Structure](#request-structure)
5. [Response Structure](#response-structure)
6. [Implementation Considerations](#implementation-considerations)
7. [Error Handling](#error-handling)

## Overview

The Beckn Discover API provides a flexible, extensible search and discovery mechanism for heterogeneous item types while maintaining full JSON-LD compatibility. The API supports both structured queries and natural language queries, with the ability to filter across extended item schemas (ElectronicItem, GroceryItem, etc.) while returning a unified catalog-based response structure.

## Key Design Principles

1. **Schema Extensibility**: Support for any item type that extends the base `Item.jsonld` schema
2. **JSON-LD Compatibility**: Full support for JSON-LD context and type information
3. **Catalog-Based Results**: Returns catalogs containing items with proper schema context
4. **Flexible Filtering**: Support for filtering on any field from extended item schemas
5. **Dynamic Context**: Automatic context generation based on returned item types
6. **Schema-Driven Responses**: Response fields automatically determined by schema-settings.json
7. **No Hardcoded Dependencies**: API works with any new item schemas without changes

## API Endpoints

### 1. Structured and Natural Language API

#### **Endpoint:** `POST /beckn/discover`

Primary API for programmatic search with structured queries or natural language processing.

### 2. Browser Search API

#### **Endpoint:** `GET /beckn/discover/browser-search`

URL-based search API for browser navigation and direct links, supporting both HTML and JSON responses.

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
      "network_id": "bap.net/electronics",
      "action": "discover"
    },
    "structured_query": {
      "text_search": "gaming laptop premium tech",
      "filters": {
        "operator": "and",
        "conditions": [
          "rating.value >= 4.0",
          "electronic:brand.name = 'Premium Tech'",
          "electronic:price.schema:price <= 2000",
          "locations.gps within_radius(40.7128, -74.0060, 10km)"
        ]
      },
      "response_type": "basic",
      "pagination": {
        "page": 1,
        "limit": 20
      }
    }
  }
}
```

### Request Schema Components

#### 1. Context Section

The `context` section specifies:
- **`network_id`**: Network identifier for the BAP (Beckn App Provider)
- **`action`**: Action being performed (e.g., "discover")

#### 2. Query Section

The API supports two query types (oneOf):

##### Structured Query

- **`text_search`**: Basic text search string
- **`filters`**: Complex filtering with support for extended schema fields
- **`response_type`**: Level of detail ("basic" or "detailed")
- **`pagination`**: Result pagination

##### Natural Language Query

- **`text`**: Human-readable search query
- **`response_type`**: Level of detail ("basic" or "detailed")
- **`pagination`**: Result pagination

#### 3. Filter Syntax

Filters support extended schema fields using namespace prefixes:

```json
"filters": {
  "operator": "and",
  "conditions": [
    "rating.value >= 4.0",                           // Base Item field
    "electronic:brand.name = 'Premium Tech'",        // ElectronicItem field
    "electronic:price.schema:price <= 2000",         // Nested field access
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
      "network_id": "bap.net/electronics",
      "action": "discover"
    },
    "catalogs": [
      {
        "@type": "beckn:Catalog",
        "beckn:descriptor": {
          "@type": "beckn:Descriptor",
          "schema:name": "Premium Tech Electronics Store",
          "beckn:shortDesc": "High-quality electronics and gaming equipment"
        },
        "beckn:timePeriod": {
          "@type": "beckn:TimePeriod",
          "schema:startDate": "2025-01-27",
          "schema:endDate": "2026-12-31"
        },
        "beckn:items": [
          {
            "@context": "https://becknprotocol.io/schema/items/ElectronicItem/schema-settings.json",
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
          }
        ]
      }
    ]
  }
}
```

### Response Schema Components

#### 1. Context Section

The response context includes:
- **`network_id`**: Network identifier for the BAP
- **`action`**: Action being performed

#### 2. Catalogs Section

- **`@type`**: Type of the catalog (beckn:Catalog)
- **`beckn:descriptor`**: Catalog metadata (name, description)
- **`beckn:timePeriod`**: Validity period for the catalog
- **`beckn:items`**: Array of items with their schema context

#### 3. Item Structure

Each item includes:
- **`@context`**: Reference to schema-settings.json for field resolution
- **`@type`**: Item type (ElectronicItem, GroceryItem, etc.)
- **Schema-specific fields**: Fields defined in the extended schema
- **Base fields**: Common fields from the base Item schema

## Browser Search API Details

### **GET /beckn/discover/browser-search**

The browser search API handles URL-based searches with mandatory entity type specification.

#### **Query Parameters:**

**Required:**
- **`entity_type`**: Type of entity to search for
  - `item` - Search for items
  - `provider` - Search for providers  
  - `catalog` - Search for catalogs

**Optional:**
- **Identifiers**: `item_id`, `provider_id`, `catalog_id`
- **Filters**: `category`, `brand`, `price_min`, `price_max`, `rating_min`
- **Location**: `location`, `radius`
- **Features**: `featured`, `offer`, `new`, `trending`
- **Pagination**: `page`, `limit`
- **Sorting**: `sort`, `order`

#### **Response Types:**

- **HTML Response** (default): Browser-friendly search results page
- **JSON Response** (with `Accept: application/json`): Same structure as structured query API

#### **HTML Response Example:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results - Electrify America 100kW Station | Beckn Catalog</title>
    <meta name="description" content="Electrify America 100kW DC fast charging station - Available 24/7 with contactless payment.">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="Electrify America 100kW Station">
    <meta property="og:description" content="100kW DC fast charging station from Electrify America">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://catalog.beckn.org/search?provider_id=provider_123&item_id=item_456">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Electrify America 100kW Station",
      "description": "100kW DC fast charging station with CCS and CHAdeMO connectors",
      "brand": "Electrify America",
      "category": "EV Charging",
      "rating": {
        "@type": "Rating",
        "ratingValue": "4.8",
        "reviewCount": "1250"
      },
      "offers": {
        "@type": "Offer",
        "price": "0.45",
        "priceCurrency": "USD"
      }
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="search-bar">
                <form action="/search" method="GET">
                    <input type="text" name="query" placeholder="Search for products, services...">
                    <button type="submit">Search</button>
                </form>
            </div>
        </nav>
    </header>
    
    <main>
        <section class="search-results">
            <div class="results-header">
                <h1>Electrify America 100kW Station</h1>
                <p>From Electrify America</p>
            </div>
            
            <div class="results-grid">
                <article class="result-item">
                    <div class="item-image">
                        <img src="/images/ev-charging-station.jpg" alt="EV Charging Station">
                    </div>
                    <div class="item-details">
                        <h2>Electrify America 100kW Station</h2>
                        <p class="description">100kW DC fast charging station with CCS and CHAdeMO connectors</p>
                        <div class="rating">
                            <span class="stars">★★★★★</span>
                            <span class="rating-value">4.8</span>
                            <span class="review-count">(1,250 reviews)</span>
                        </div>
                        <div class="price">$0.45/kWh</div>
                        <div class="location">San Francisco, CA</div>
                        <div class="categories">
                            <span class="category-tag">EV Charging</span>
                            <span class="category-tag">Fast Charging</span>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Beckn Catalog. Powered by Beckn Protocol.</p>
    </footer>
</body>
</html>
```

#### **URL Examples:**

```
GET /beckn/discover/browser-search?entity_type=item&item_id=item_456
GET /beckn/discover/browser-search?entity_type=provider&provider_id=provider_123
GET /beckn/discover/browser-search?entity_type=item&category=electric_vehicles&price_max=50000
GET /beckn/discover/browser-search?entity_type=item&brand=tesla&sort=rating&order=desc
GET /beckn/discover/browser-search?entity_type=provider&location=san_francisco&radius=25
```

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

### 2. Response Field Resolution

Response fields are determined by the `searchResponse` section in schema-settings.json:

```json
"searchResponse": {
  "basic": ["electronicItemId", "price", "quantity", "brand", "sku"],
  "detailed": ["electronicItemId", "price", "quantity", "brand", "sku", "shippingInfo", "fulfillments", "payments", ...]
}
```

### 3. Filter Processing

Filters should be processed with awareness of:
- Field existence in different schemas
- Data type validation
- Cross-schema field relationships

### 4. Result Aggregation

The API aggregates results from multiple item types while:
- Maintaining type information
- Preserving schema-specific fields
- Providing unified pagination

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

### Browser Search API Errors

```json
{
  "error": {
    "code": "INVALID_ENTITY_TYPE",
    "message": "entity_type is required and must be one of: item, provider, catalog",
    "details": {
      "provided_entity_type": null,
      "valid_entity_types": ["item", "provider", "catalog"]
    }
  }
}
```