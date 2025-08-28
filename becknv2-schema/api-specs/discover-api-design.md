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

The Beckn Discover API provides a flexible, extensible search and discovery mechanism for heterogeneous item types while maintaining full JSON-LD compatibility. The API supports both structured queries and natural language queries, with the ability to filter across extended item schemas (ElectronicItem, GroceryItem, etc.) while returning a unified catalog-based response structure. **The API directly returns beckn core Item entities instead of wrapping them in separate ItemResult objects, simplifying the response structure and improving performance.**

## Key Design Principles

1. **Schema Extensibility**: Support for any item type that extends the base `Item.jsonld` schema
2. **JSON-LD Compatibility**: Full support for JSON-LD context and type information
3. **Catalog-Based Results**: Returns catalogs containing items with proper schema context
4. **Direct Item Return**: Beckn core Item entities are returned directly without ItemResult wrapper
5. **Flexible Filtering**: Support for filtering on any field from extended item schemas
6. **Dynamic Context**: Automatic context generation based on returned item types
7. **Schema-Driven Responses**: Response fields automatically determined by schema-context.jsonld with JSON-LD context validation
8. **No Hardcoded Dependencies**: API works with any new item schemas without changes

## JSON-LD Context Validation

The API enforces proper JSON-LD context hierarchy through OpenAPI extensions (`x-*` fields) to ensure schema compliance:

### Context Validation Rules

1. **Base Context Requirement**: All extended schemas must import the base Item schema context
   - **Base Context URI**: `https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld`
   - **Required Import**: Extended schemas must include this base context in their `@context` array

2. **Schema Context Validation**: The `schema_context` array must contain valid JSON-LD context URIs
   - **Minimum Requirement**: At least one context URI must be provided
   - **Validation**: All URIs must point to accessible JSON-LD context files
   - **Hierarchy**: Extended contexts must properly extend the base Item schema

3. **@context Field Validation**: Individual item `@context` fields are validated for proper JSON-LD structure
   - **Format**: Must be valid URI pointing to schema-context.jsonld files
   - **Compliance**: Must import the base Item context
   - **Extensibility**: No hardcoded lists limit future schema extensions

### Example Context Structure

```json
{
  "@context": {
    "electronic": "https://example.org/schema/items/v1/ElectronicItem/",
    "x-jsonld-validation": {
      "base-context": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld"
    }
  }
}
```

## API Endpoints

### 1. Structured and Natural Language API

#### **Endpoint:** `POST /beckn/v1/discover`

Primary API for programmatic search with structured queries or natural language processing.

### 2. Browser Search API

#### **Endpoint:** `GET /beckn/v1/discover/browser-search`

URL-based search API for browser navigation and direct links, supporting both HTML and JSON responses.

## Request Structure

### Base Request Format

```json
{
  "context": {
    "ts": "2024-04-10T16:10:50+05:30",
    "msgid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "traceid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "network_id": ["bap.net/electronics"],
    "schema_context": [
      "https://example.org/schema/items/v1/ElectronicItem/schema-context.jsonld"
    ]
  },
  "text_search": "gaming laptop premium tech",
  "filters": "$[?(@.rating.value >= 4.0 && @.electronic.brand.name == 'Premium Tech' && @.electronic.price['schema:price'] <= 2000 && @.locations.gps within_radius(40.7128, -74.0060, 10km))]",
  "pagination": {
    "page": 1,
    "limit": 20
  }
}

### Multi-Schema Search Example

```json
{
  "context": {
    "ts": "2024-04-10T16:10:50+05:30",
    "msgid": "8e1j47g7-h05i-7g7j-eh12-525167hh2j9h",
    "traceid": "8e1j47g7-h05i-7g7j-eh12-525167hh2j9h",
    "network_id": ["bap.net/electronics", "bap.net/tech"],
    "schema_context": [
      "https://example.org/schema/items/v1/ElectronicItem/schema-context.jsonld",
      "https://example.org/schema/items/v1/TelevisionItem/schema-context.jsonld"
    ]
  },
  "text_search": "premium tech and home entertainment",
  "filters": "$[?(@.rating.value >= 4.5 && (@.electronic.brand.name == 'Premium Tech' || @.television.resolution == '4K Ultra HD'))]",
  "pagination": {
    "page": 1,
    "limit": 25
  }
}
```

This example demonstrates searching across both ElectronicItem and GroceryItem schemas simultaneously, allowing for heterogeneous item discovery in a single query.

## Request Schema Components

#### 1. Context Section

The `context` section specifies:
- **`network_id`**: Array of network identifiers for the BAP (Beckn App Provider)
- **`action`**: Action being performed (e.g., "discover")
- **`schema_context`**: Array of URIs to specific item schemas' schema-context.jsonld files that define the search and response structure. **Must include at least one context URI and all URIs must point to valid JSON-LD context files that extend the base Item schema.**

**Benefits of Multiple Network IDs:**
- **Cross-Network Search**: Items can be associated with multiple networks (e.g., electronics and tech)
- **Federated Discovery**: Search across multiple BAP networks simultaneously
- **Network Aggregation**: Combine results from different network providers
- **Flexible Affiliation**: Items can belong to multiple network categories

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

Filters support complex filtering using JSONPath expressions (RFC 9355):

```json
"filters": "rating.value >= 4.0 and electronic:brand.name = 'Premium Tech' and electronic:price.schema:price <= 2000 and locations.gps within_radius(40.7128, -74.0060, 10km)"
```

The filters field accepts a single string that represents a valid JSONPath expression (RFC 9355), allowing for flexible and powerful querying capabilities:

- **Simple expressions**: `$[?(@.rating.value >= 4.0)]`
- **Field-based filters**: `$[?(@.electronic.brand.name == 'Premium Tech')]`
- **Range filters**: `$[?(@.electronic.price['schema:price'] <= 2000)]`
- **Geographic filters**: `$[?(@.locations.gps within_radius(40.7128, -74.0060, 10km))]`
- **Complex expressions**: `$[?(@.rating.value >= 4.0 && @.electronic.brand.name == 'Premium Tech' && @.electronic.price['schema:price'] <= 2000)]`

## Response Structure

### Base Response Format

```json
{
  "context": {
    "ts": "2024-04-10T16:10:50+05:30",
    "msgid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "traceid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "network_id": [
      "bap.net/electronics"
    ]
  },
  "catalogs": [
    {
      "@type": "beckn:Catalog",
      "beckn:descriptor": {
        "@type": "beckn:Descriptor",
        "schema:name": "Premium Tech Electronics Store",
        "beckn:shortDesc": "High-quality electronics, gaming equipment, and home entertainment"
      },
      "beckn:timePeriod": {
        "@type": "beckn:TimePeriod",
        "schema:startDate": "2025-01-27",
        "schema:endDate": "2026-12-31"
      },
      "beckn:items": [
        {
          "@context": "https://example.org/schema/items/v1/ElectronicItem/schema-context.jsonld",
          "@type": "beckn:ElectronicItem",
          "x-jsonld-validation": {
            "base-context": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld"
          },
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
          },
          "beckn:provider": {
            "beckn:id": "tech-store-001",
            "beckn:descriptor": {
              "schema:name": "Premium Tech Store",
              "beckn:shortDesc": "High-quality electronics and gaming equipment"
            },
            "beckn:rating": {
              "beckn:ratingValue": 4.7,
              "beckn:ratingCount": 89
            }
          }
        },
        {
          "@context": "https://example.org/schema/items/v1/TelevisionItem/schema-context.jsonld",
          "@type": "beckn:TelevisionItem",
          "x-jsonld-validation": {
            "base-context": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld"
          },
          "television:televisionItemId": "tv-item-001",
          "schema:name": "4K Ultra HD Smart TV",
          "beckn:descriptor": {
            "@type": "beckn:Descriptor",
            "schema:name": "4K Ultra HD Smart TV",
            "beckn:shortDesc": "65-inch 4K smart TV with HDR and streaming apps"
          },
          "television:price": {
            "@type": "beckn:Price",
            "schema:price": 899.99,
            "schema:priceCurrency": "USD"
          },
          "television:brand": {
            "@type": "schema:Brand",
            "schema:name": "Premium Tech"
          },
          "television:screenSize": "65-inch",
          "television:resolution": "4K Ultra HD",
          "beckn:rating": {
            "@type": "beckn:Rating",
            "beckn:ratingValue": 4.6,
            "beckn:ratingCount": 89
          },
          "beckn:provider": {
            "beckn:id": "tech-store-001",
            "beckn:descriptor": {
              "schema:name": "Premium Tech Store",
              "beckn:shortDesc": "High-quality electronics and gaming equipment"
            },
            "beckn:rating": {
              "beckn:ratingValue": 4.7,
              "beckn:ratingCount": 89
            }
          }
        }
      ]
    }
  ]
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
- **`beckn:items`**: Array of beckn core Item entities with their schema context

#### 3. Item Structure

**Key Change**: Items are now returned directly as beckn core Item entities instead of being wrapped in ItemResult objects. This simplifies the response structure and improves performance.

Each item includes:
- **`@context`**: Reference to schema-context.jsonld for field resolution
- **`@type`**: Item type (ElectronicItem, GroceryItem, etc.)
- **Schema-specific fields**: Fields defined in the extended schema
- **Base fields**: Common fields from the base Item schema

**Benefits of Direct Item Return:**
- **Simplified Response**: No unnecessary ItemResult wrapper
- **Better Performance**: Reduced JSON parsing overhead
- **Faster Parsing**: Direct access to item properties
- **Better Memory Usage**: No intermediate object creation
- **Simplified Client Code**: Direct item access without unwrapping
- **Consistent with Beckn Standards**: Aligns with core Item representation
- **Easier Integration**: Direct compatibility with existing beckn Item consumers

### Response Validation

The API enforces validation on response items to ensure proper JSON-LD context compliance:

#### @context Field Validation

Each item's `@context` field is validated to ensure:
- **Valid URI Format**: Must be a properly formatted URI
- **Base Context Import**: Must import the base Item schema context
- **Accessibility**: URI must point to an accessible JSON-LD context file
- **JSON-LD Compliance**: Context file must be valid JSON-LD

#### Schema Context Hierarchy

The response maintains proper schema hierarchy:
1. **Base Item Schema**: All items inherit from `https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld`
2. **Extended Schemas**: Items can extend with additional context files
3. **Property Resolution**: Fields are resolved using the combined context hierarchy
4. **Type Safety**: `@type` declarations are validated against available contexts

#### Validation Example

```json
{
  "@context": [
    {
      "electronic": "https://example.org/schema/items/v1/ElectronicItem/",
      "x-jsonld-validation": {
        "base-context": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld"
      }
    }
  ],
  "@type": "beckn:ElectronicItem",
  "beckn:id": "laptop-001",
  "electronic:brand": "Premium Tech"
}
```

**Validation Rules:**
- ✅ Base context is imported
- ✅ Extended context extends base schema
- ✅ All properties have valid mappings
- ✅ JSON-LD structure is compliant

## Browser Search API Details

### **GET /beckn/discover/browser-search**

The browser search API handles URL-based searches using encoded JSONPath expressions for flexible filtering.

#### **Query Parameters:**

**Optional:**
- **`filters`**: URL-encoded JSONPath expression for complex filtering
  - Example: `filters=%24%5B%3F%28%40.price%20%3C%3D%201000%29%5D`
  - Decoded: `$[?(@.price <= 1000)]`
- **`pagination`**: URL-encoded pagination object
  - Example: `pagination=%7B%22page%22%3A1%2C%22limit%22%3A20%7D`
  - Decoded: `{"page":1,"limit":20}`

#### **Request Headers:**
- **`Accept: text/html`**: Returns browser-friendly HTML page (default)
- **`Accept: application/json`**: Returns structured JSON data

#### **URL Encoding Notes:**
- **JSONPath expressions** must be URL-encoded for safe transmission
- **Pagination objects** must be URL-encoded JSON
- **Special characters** like `$`, `@`, `[`, `]`, `(`, `)`, `&`, `|` need encoding
- **Example URL**: `/beckn/v1/discover/browser-search?filters=%24%5B%3F%28%40.price%20%3C%3D%201000%29%5D`

#### **Response Types:**

- **HTML Response** (default): Browser-friendly search results page with Beckn catalog structure
- **JSON Response** (with `Accept: application/json`): Same structure as structured query API

#### **Schema Context:**

The browser-search API uses the same schema context as the main discover API:
- **Request Context**: Includes `schema_context` as an array pointing to specific item schemas' schema-context.jsonld files
- **Multi-Schema Support**: Can search across multiple item types simultaneously
- **Response Structure**: Returns catalogs with items following the specified schema structures

#### **HTML Response Example:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results - Premium Tech Electronics | Beckn Catalog</title>
    <meta name="description" content="Premium Tech Electronics Store - High-quality electronics, gaming equipment, and home entertainment with premium brands.">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="Premium Tech Electronics Store">
    <meta property="og:description" content="High-quality electronics, gaming equipment, and home entertainment from Premium Tech">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://catalog.beckn.org/search?network_id=bap.net/electronics,bap.net/tech">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://example.org/schema/items/v1/ElectronicItem/schema-context.jsonld",
      "@type": "beckn:Catalog",
      "beckn:descriptor": {
        "@type": "beckn:Descriptor",
        "schema:name": "Premium Tech Electronics Store",
        "beckn:shortDesc": "High-quality electronics, gaming equipment, and home entertainment"
      },
      "beckn:timePeriod": {
        "@type": "beckn:TimePeriod",
        "schema:startDate": "2025-01-27",
        "schema:endDate": "2026-12-31"
      },
      "beckn:items": [
        {
          "@type": "beckn:ElectronicItem",
          "x-jsonld-validation": {
            "base-context": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld"
          },
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
          },
          "beckn:provider": {
            "beckn:id": "tech-store-001",
            "beckn:descriptor": {
              "schema:name": "Premium Tech Store",
              "beckn:shortDesc": "High-quality electronics and gaming equipment"
            },
            "beckn:rating": {
              "beckn:ratingValue": 4.7,
              "beckn:ratingCount": 89
            }
          }
        },
        {
          "@type": "beckn:TelevisionItem",
          "x-jsonld-validation": {
            "base-context": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld"
          },
          "television:televisionItemId": "tv-item-001",
          "schema:name": "4K Ultra HD Smart TV",
          "beckn:descriptor": {
            "@type": "beckn:Descriptor",
            "schema:name": "4K Ultra HD Smart TV",
            "beckn:shortDesc": "65-inch 4K smart TV with HDR and streaming apps"
          },
          "television:price": {
            "@type": "beckn:Price",
            "schema:price": 899.99,
            "schema:priceCurrency": "USD"
          },
          "television:brand": {
            "@type": "schema:Brand",
            "schema:name": "Premium Tech"
          },
          "television:screenSize": "65-inch",
          "television:resolution": "4K Ultra HD",
          "beckn:rating": {
            "@type": "beckn:Rating",
            "beckn:ratingValue": 4.6,
            "beckn:ratingCount": 89
          },
          "beckn:provider": {
            "beckn:id": "tech-store-001",
            "beckn:descriptor": {
              "schema:name": "Premium Tech Store",
              "beckn:shortDesc": "High-quality electronics and gaming equipment"
            },
            "beckn:rating": {
              "beckn:ratingValue": 4.7,
              "beckn:ratingCount": 89
            }
          }
        }
      ]
    }
    </script>
</head>
<body>
    <header>
        <nav>
            <div class="search-bar">
                <form action="/beckn/discover/browser-search" method="GET">
                    <input type="text" name="query" placeholder="Search for electronics, gaming equipment, TVs...">
                    <button type="submit">Search</button>
                </form>
            </div>
        </nav>
    </header>
    
    <main>
        <section class="search-results">
            <div class="results-header">
                <h1>Premium Tech Electronics Store</h1>
                <p class="store-description">High-quality electronics, gaming equipment, and home entertainment</p>
                <p class="availability">Available from Jan 27, 2025 to Dec 31, 2026</p>
            </div>
            
            <div class="results-grid">
                <article class="result-item electronic-item">
                    <div class="item-details">
                        <h2>Premium Gaming Laptop Pro</h2>
                        <p class="description">High-performance gaming laptop with RTX graphics</p>
                        <div class="rating">
                            <span class="stars">★★★★★</span>
                            <span class="rating-value">4.8</span>
                            <span class="rating-count">(156 reviews)</span>
                        </div>
                        <div class="price">$1,499.99 USD</div>
                        <div class="brand">Brand: Premium Tech</div>
                        <div class="item-id">ID: laptop-item-001</div>
                        <div class="item-type">Type: Electronic Item</div>
                    </div>
                </article>
                
                <article class="result-item television-item">
                    <div class="item-details">
                        <h2>4K Ultra HD Smart TV</h2>
                        <p class="description">65-inch 4K smart TV with HDR and streaming apps</p>
                        <div class="rating">
                            <span class="stars">★★★★☆</span>
                            <span class="rating-value">4.6</span>
                            <span class="rating-count">(89 reviews)</span>
                        </div>
                        <div class="price">$899.99 USD</div>
                        <div class="brand">Brand: Premium Tech</div>
                        <div class="item-id">ID: tv-item-001</div>
                        <div class="item-type">Type: Television Item</div>
                        <div class="tv-specs">
                            <span class="screen-size">65-inch</span>
                            <span class="resolution">4K Ultra HD</span>
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

- **Entity Types**: `item`, `provider`, `catalog`
- **Item Categories**: Electronics, Television, Grocery, etc.
- **Multi-Schema Support**: Search across different item types simultaneously
- **Network Filtering**: Filter by single or multiple network IDs
- **Rich Metadata**: Access to schema-specific fields and properties

**Example Queries:**
- Search for electronics: `?entity_type=item&category=electronics`
- Find 4K TVs: `?entity_type=item&category=television&resolution=4K`
- Multi-network search: `?network_id=bap.net/electronics,bap.net/tech`
- Cross-schema search: `?schema_context=ElectronicItem,TelevisionItem`

#### **URL Examples:**

```
GET /beckn/discover/browser-search?entity_type=item&item_id=item_456
GET /beckn/discover/browser-search?entity_type=provider&provider_id=provider_123
GET /beckn/discover/browser-search?entity_type=item&category=electric_vehicles&price_max=50000
GET /beckn/discover/browser-search?entity_type=item&brand=tesla&sort=rating&order=desc
GET /beckn/discover/browser-search?entity_type=provider&location=san_francisco&radius=25
GET /beckn/discover/browser-search?network_id=bap.net/electronics,bap.net/tech
GET /beckn/discover/browser-search?network_id=bap.net/grocery&category=organic
```

**Network ID Support:**
- **Single Network**: `network_id=bap.net/electronics`
- **Multiple Networks**: `network_id=bap.net/electronics,bap.net/tech`
- **Network + Filters**: `network_id=bap.net/grocery&category=organic`

## Implementation Considerations

### 1. Schema Registry

The API should maintain a registry of available item schemas:

```json
{
  "schemas": {
    "Item": {
      "uri": "https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld",
      "type": "base",
      "fields": ["beckn:id", "beckn:descriptor", "beckn:category", "beckn:rating"]
    },
    "ElectronicItem": {
      "uri": "https://example.org/schema/items/v1/ElectronicItem/schema-context.jsonld",
      "type": "extended",
      "base": "Item",
      "fields": ["electronic:brand", "electronic:sku", "electronic:price"]
    },
    "TelevisionItem": {
      "uri": "https://example.org/schema/items/v1/TelevisionItem/schema-context.jsonld",
      "type": "extended",
      "base": "Item",
      "fields": ["television:screenSize", "television:resolution", "television:brand"]
    },
    "GroceryItem": {
      "uri": "https://example.org/schema/items/v1/GroceryItem/schema-context.jsonld",
      "type": "extended",
      "base": "Item",
      "fields": ["grocery:expiryDate", "grocery:nutritionalInfo", "grocery:organicCertification"]
    }
  }
}
```

### 2. JSON-LD Context Validation

The API enforces proper JSON-LD context hierarchy through validation rules:

#### Validation Requirements

1. **Base Context Requirement**: All extended schemas must import the base Item schema context
   - **Base Context URI**: `https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld`
   - **Required Import**: Extended schemas must include this base context in their `@context` array

2. **Schema Context Validation**: The `schema_context` array must contain valid JSON-LD context URIs
   - **Minimum Requirement**: At least one context URI must be provided
   - **Validation**: All URIs must point to accessible JSON-LD context files
   - **Hierarchy**: Extended contexts must properly extend the base Item schema

3. **@context Field Validation**: Individual item `@context` fields are validated for proper JSON-LD structure
   - **Format**: Must be valid URI pointing to schema-context.jsonld files
   - **Compliance**: Must import the base Item context
   - **Extensibility**: No hardcoded lists limit future schema extensions

#### Context Resolution Process

1. **Base Context Loading**: Load and parse the base Item schema context
2. **Extended Context Loading**: Load additional contexts from the `schema_context` array
3. **Context Merging**: Combine contexts for property resolution
4. **Property Validation**: Ensure all properties have valid mappings
5. **Type Validation**: Verify `@type` declarations match available contexts

### 3. Response Field Resolution

Response fields are determined by the JSON-LD context hierarchy defined in schema-context.jsonld files:

#### Base Item Schema Fields
All items include core fields from the base Item schema:
- **`beckn:id`**: Unique item identifier
- **`beckn:descriptor`**: Item name and description
- **`beckn:category`**: Item categorization
- **`beckn:rating`**: User ratings and reviews
- **`beckn:price`**: Pricing information

#### Extended Schema Fields
Extended schemas add domain-specific fields through JSON-LD context:
- **ElectronicItem**: `electronic:brand`, `electronic:sku`, `electronic:model`
- **GroceryItem**: `grocery:organicCertification`, `grocery:expiryDate`
- **TelevisionItem**: `television:screenSize`, `television:resolution`

#### Context Resolution Process
1. **Base Context**: Load `https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld`
2. **Extended Contexts**: Load additional context files from `schema_context` array
3. **Field Mapping**: Resolve all property names to their IRI definitions
4. **Type Validation**: Ensure `@type` declarations match available contexts
5. **Property Resolution**: Map namespaced properties to their full IRI paths

### 4. Filter Processing

Filters should be processed with awareness of:
- Field existence in different schemas
- Data type validation
- Cross-schema field relationships

### 5. Result Aggregation

The API aggregates results from multiple item types while:
- Maintaining type information
- Preserving schema-specific fields
- Providing unified pagination
- **Directly returning beckn core Item entities** without ItemResult wrapper
- **Supporting multi-schema searches** across heterogeneous item types simultaneously

### 6. Performance Benefits of Direct Item Return

**Eliminating ItemResult wrapper provides several advantages:**

- **Reduced JSON Size**: Smaller response payloads
- **Faster Parsing**: Direct access to item properties
- **Better Memory Usage**: No intermediate object creation
- **Simplified Client Code**: Direct item access without unwrapping
- **Consistent with Beckn Standards**: Aligns with core Item representation

### 7. Multi-Schema Search Benefits

**Searching across multiple item types simultaneously provides several advantages:**

- **Cross-Category Discovery**: Find related items across different schemas (e.g., electronics and televisions)
- **Unified Search Experience**: Single query interface for heterogeneous catalogs
- **Efficient Resource Usage**: No need for multiple API calls to different schemas
- **Complex Filtering**: Apply filters across multiple item types in one request
- **Marketplace Integration**: Support for vendors offering diverse item categories
- **Enhanced User Experience**: Users can discover items they might not have considered

**Example Use Cases:**
- **E-commerce**: Search for both electronics and home entertainment in one query
- **Tech Stores**: Find laptops, smartphones, and TVs simultaneously
- **Home Improvement**: Discover tools, appliances, and furniture together
- **Real Estate**: Search properties, services, and related offerings

**Multi-Schema Search Example:**
- **ElectronicItem + TelevisionItem**: Search for high-rated electronics and 4K TVs
- **Cross-Category Discovery**: Find gaming laptops and smart TVs from the same brand
- **Unified Results**: Single response with both item types properly categorized

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

## Summary

### Key Changes Made

1. **JSON-LD Context Validation**: Added comprehensive validation using OpenAPI extensions (`x-*` fields) to ensure proper schema hierarchy
2. **Base Context Requirement**: Enforced that all extended schemas must import the base Item schema context
3. **Schema Context Validation**: Added validation for the `schema_context` array to ensure proper JSON-LD compliance
4. **Response Validation**: Enhanced validation for individual item `@context` fields
5. **Context Resolution Process**: Documented the step-by-step process for resolving JSON-LD contexts

### Validation Benefits

- **Schema Compliance**: Ensures all extended schemas properly inherit from the base Item schema
- **JSON-LD Standards**: Maintains full compliance with JSON-LD specifications
- **Extensibility**: No hardcoded lists limit future schema extensions
- **Quality Assurance**: Validates context files are accessible and properly structured
- **Developer Experience**: Clear validation rules and error messages

### Implementation Notes

- **OpenAPI Extensions**: Uses `x-jsonld-validation` and `x-jsonld-context-validation` for validation
- **Base Context URI**: `https://becknprotocol.io/schema/core/v1/Item/schema-context.jsonld`
- **Flexible Validation**: Allows any valid JSON-LD context that extends the base schema
- **Performance**: Validation happens at request/response time without caching overhead