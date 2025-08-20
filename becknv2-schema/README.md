# Beckn Protocol JSON-LD Schemas

This directory contains the JSON-LD (JSON for Linked Data) conversion of Beckn Protocol schemas using RDF (Resource Description Framework) principles and schema.org integration.

## Overview

The Beckn Protocol schemas have been converted from YAML format to JSON-LD format to provide:
- **Semantic Web Compatibility**: Full RDF and OWL 2 DL compliance
- **Schema.org Integration**: Leverages existing schema.org standards for common entities
- **Linked Data Support**: Enables graph databases and SPARQL queries
- **Machine Readable Semantics**: Better interoperability with semantic web tools

## Schema.org Integration

The following schemas use schema.org classes instead of custom implementations:
- **Time** → `schema:Time`
- **Address** → `schema:PostalAddress`
- **Contact** → `schema:ContactPoint`
- **Duration** → `schema:Duration`
- **Labels** → Simplified array approach

## Circular Reference Resolution

The schemas have been designed to avoid circular references:
- **Provider** → Standalone entity with business information
- **Catalog** → References providers by ID (`provider_id`) and contains a list of items
- **Item** → Standalone entity that can be referenced by catalogs

## Schema Relationships

### Provider → Catalog → Item Hierarchy
```
Provider (Business Entity)
    ↓ (referenced by ID)
Catalog (Product Collection)
    ↓ (contains list of items)
Item (Individual Product)
```

### Data Flow
1. **Provider** creates and manages **Catalogs**
2. **Catalogs** contain a list of **Items** directly
3. **Items** are standalone entities that can be included in multiple catalogs

## Directory Structure

```
becknv2-schema/
├── context.jsonld          # Main context file with all namespaces
├── schemas/                # All Beckn Protocol schemas (owl:Class)
│   ├── core/               # Core business schemas and data types
│   │   ├── Provider.jsonld     # Business provider
│   │   ├── Catalog.jsonld      # Product catalog
│   │   ├── Item.jsonld         # Base item
│   │   ├── Fulfillment.jsonld  # Fulfillment details
│   │   ├── DecimalValue.jsonld # Decimal representation
│   │   ├── Image.jsonld        # Image representation
│   │   ├── MediaFile.jsonld    # Media file representation
│   │   ├── Price.jsonld        # Price representation
│   │   ├── Descriptor.jsonld   # Item descriptor schema
│   │   ├── Rating.jsonld       # Rating representation
│   │   ├── Category.jsonld     # Category classification
│   │   └── Location.jsonld     # Location representation
│   │
│   └── items/              # Item-specific schemas
│       ├── ElectronicItem/     # Electronic item schemas
│       │   ├── schema-definition.jsonld    # Item schema definition
│       │   ├── schema-settings.json        # Search and privacy settings
│       │   ├── schema-rules.json           # Validation rules
│       │   ├── schema-renderer.json        # UI rendering templates
│       │   └── schema-context.jsonld       # Item-specific contexts and aliases
│       ├── GroceryItem/        # Grocery item schemas
│       │   ├── schema-definition.jsonld    # Item schema definition
│       │   ├── schema-settings.json        # Search and privacy settings
│       │   ├── schema-rules.json           # Validation rules
│       │   ├── schema-renderer.json        # UI rendering templates
│       │   └── schema-context.jsonld       # Item-specific contexts and aliases
│       ├── TelevisionItem/     # Television item schemas
│       │   ├── schema-definition.jsonld    # Item schema definition
│       │   ├── schema-settings.json        # Search and privacy settings
│       │   ├── schema-rules.json           # Validation rules
│       │   ├── schema-renderer.json        # UI rendering templates
│       │   └── schema-context.jsonld       # Item-specific contexts and aliases
│       └── SmartphoneItem/     # Smartphone item schemas
│           ├── schema-definition.jsonld    # Item schema definition
│           ├── schema-settings.json        # Search and privacy settings
│           ├── schema-rules.json           # Validation rules
│           ├── schema-renderer.json        # UI rendering templates
│           └── schema-context.jsonld       # Item-specific contexts and aliases

```

**Note**: Schemas are organized by domain within the `schemas/` directory. The `core/` directory contains essential business schemas and data types, while the `items/` directory contains item-specific extensions. All schemas remain of type `owl:Class` and use absolute URLs, so the local file organization doesn't affect their functionality.

### Schema Configuration Files

Each item type includes several configuration files:

- **`schema-definition.jsonld`**: Core JSON-LD schema definition with properties and types
- **`schema-settings.json`**: Search indexing hints and privacy settings for the item
- **`schema-rules.json`**: JSON Schema validation rules and field dependencies
- **`schema-renderer.json`**: HTML rendering templates and UI configuration
- **`schema-context.jsonld`**: Item-specific JSON-LD contexts with aliases and namespaces

## Usage Examples

### Basic Context Usage

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:Item",
  "beckn:descriptor": {
    "@type": "beckn:Descriptor",
    "schema:name": "Organic Apples"
  },
  "beckn:price": {
    "@type": "beckn:Price",
    "schema:price": 2.99,
    "schema:priceCurrency": "USD"
  }
}
```

### Provider with Location

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:Provider",
  "beckn:descriptor": {
    "@type": "beckn:Descriptor",
    "schema:name": "Fresh Grocery Store"
  },
  "beckn:locations": [
    {
      "@type": "beckn:Location",
      "schema:address": {
        "@type": "schema:PostalAddress",
        "schema:streetAddress": "123 Main Street",
        "schema:addressLocality": "Mumbai",
        "schema:addressCountry": "IN"
      }
    }
  ]
}
```

### Using Item-Specific Schema Contexts

Each item type provides its own schema context with aliases for easier property access:

```json
{
  "@context": "https://example.org/schema/items/v1/ElectronicItem/schema-context.jsonld",
  "@type": "beckn:ElectronicItem",
  "electronicItemId": "laptop-001",
  "brand": "Premium Tech",
  "model": "Gaming Laptop Pro",
  "screen": "15.6 inch",
  "processor": "Intel i7",
  "ram": "16GB",
  "storage": "512GB SSD"
}
```

```json
{
  "@context": "https://example.org/schema/items/v1/GroceryItem/schema-context.jsonld",
  "@type": "beckn:GroceryItem",
  "groceryItemId": "apple-001",
  "brand": "Organic Valley",
  "organicCertification": "USDA Organic",
  "expiryDate": "2024-12-31",
  "storageInstructions": "Refrigerate after opening",
  "calories": 95,
  "fiber": "4g"
}
```

```json
{
  "@context": "https://example.org/schema/items/v1/TelevisionItem/schema-context.jsonld",
  "@type": "beckn:TelevisionItem",
  "televisionItemId": "tv-001",
  "brand": "Samsung",
  "model": "QLED 4K Smart TV",
  "screenSize": "65 inch",
  "resolution": "4K Ultra HD",
  "hdr": true,
  "smartTv": true,
  "operatingSystem": "Tizen"
}
```

```json
{
  "@context": "https://example.org/schema/items/v1/SmartphoneItem/schema-context.jsonld",
  "@type": "beckn:SmartphoneItem",
  "smartphoneItemId": "phone-001",
  "brand": "Apple",
  "model": "iPhone 15 Pro",
  "screenSize": "6.1 inch",
  "camera": "48MP Triple Camera",
  "battery": "4000mAh",
  "storage": "256GB",
  "operatingSystem": "iOS 17"
}
```

### Catalog with Items

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:Catalog",
  "beckn:descriptor": {
    "@type": "beckn:Descriptor",
    "schema:name": "Electronics Catalog"
  },
  "beckn:provider_id": "provider_tech_store_001",
  "beckn:items": [
    {
      "@type": "beckn:TelevisionItem",
      "beckn:descriptor": {
        "@type": "beckn:Descriptor",
        "schema:name": "4K Smart TV"
      },
      "beckn:price": {
        "@type": "beckn:Price",
        "schema:price": 799.99,
        "schema:priceCurrency": "USD"
      },
      "beckn:dimensions": {
        "@type": "beckn:Dimensions",
        "beckn:length": 55,
        "beckn:width": 32,
        "beckn:height": 3,
        "beckn:unit": "inches"
      }
    },
    {
      "@type": "beckn:TelevisionItem",
      "beckn:descriptor": {
        "@type": "beckn:Descriptor",
        "schema:name": "OLED Gaming TV"
      },
      "beckn:price": {
        "@type": "beckn:Price",
        "schema:price": 1299.99,
        "schema:priceCurrency": "USD"
      },
      "beckn:dimensions": {
        "@type": "beckn:Dimensions",
        "beckn:length": 65,
        "beckn:width": 37,
        "beckn:height": 2.5,
        "beckn:unit": "inches"
      }
    }
  ]
}
```

### Item with Fulfillment

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:Item",
  "beckn:descriptor": {
    "@type": "beckn:Descriptor",
    "schema:name": "Smartphone"
  },
  "beckn:price": {
    "@type": "beckn:Price",
    "schema:price": 599.99,
    "schema:priceCurrency": "USD"
  },
  "beckn:fulfillment": {
    "@type": "beckn:Fulfillment",
    "beckn:shippingInfo": {
      "@type": "beckn:ShippingInfo",
      "beckn:shippingMethods": [
        {
          "@type": "beckn:ShippingMethod",
          "beckn:methodName": "Standard Delivery",
          "beckn:estimatedDeliveryDays": 3,
          "beckn:cost": {
            "@type": "beckn:Price",
            "schema:price": 5.99,
            "schema:priceCurrency": "USD"
          }
        }
      ]
    }
  }
}
```

### Benefits of Schema Contexts

The `schema-context.jsonld` files provide several advantages:

1. **Simplified Property Access**: Use short property names instead of full URIs
2. **Type Safety**: Clear mapping between aliases and actual schema properties
3. **Namespace Management**: Organized property grouping by item type
4. **Search Optimization**: Easy filtering and querying using aliases
5. **Consistent Naming**: Standardized property names across applications
6. **Extensibility**: Easy to add new properties and aliases

## RDF Principles Applied

### 1. Class Definitions
- Each schema becomes an `owl:Class`
- Proper inheritance using `rdfs:subClassOf`
- Schema.org integration for common entities
- **Intersection Classes**: Use `owl:intersectionOf` to combine attributes from both parent and child classes, ensuring all properties are available

### 2. Property Restrictions
- `owl:Restriction` for property constraints
- `owl:allValuesFrom` for value types
- `owl:oneOf` for enumerated values

### 3. Data Types
- Uses schema.org data types: `schema:Text`, `schema:Number`, `schema:Boolean`
- Maintains semantic meaning while ensuring compatibility

### 4. Relationships
- Proper domain and range definitions
- Referential integrity through URIs
- Graph-based relationship modeling

## Validation

### RDF Validation
Use RDF validators like Apache Jena or RDF4J to validate:
- OWL 2 DL compliance
- Class hierarchy consistency
- Property domain/range validation

### JSON-LD Validation
- Context resolution
- Property inheritance
- Namespace consistency

## Benefits

### 1. Semantic Interoperability
- Machine-readable semantics
- Linked data capabilities
- Standard RDF tooling support

### 2. Integration Benefits
- SPARQL query support
- Graph database compatibility
- Semantic reasoning capabilities

### 3. Standards Compliance
- W3C JSON-LD specification
- RDF 1.1 standards
- OWL 2 Web Ontology Language

### 4. Schema.org Integration
- Wide adoption and compatibility
- Better search engine understanding
- Reduced duplication of common schemas

## License

This work is part of the Beckn Protocol and follows the same licensing terms.
