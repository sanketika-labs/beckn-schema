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
- **Catalog** → References providers by ID (`providerIds`) instead of full objects
- **Item** → References catalogs by ID (`catalogIds`) instead of full objects
- **RetailItem** → Extends Item with retail-specific properties

## Schema Relationships

### Provider → Catalog → Item Hierarchy
```
Provider (Business Entity)
    ↓ (referenced by ID)
Catalog (Product Collection)
    ↓ (referenced by ID)
Item (Individual Product)
    ↓ (inheritance)
RetailItem (Retail-Specific Product)
```

### Data Flow
1. **Provider** creates and manages **Catalogs**
2. **Catalogs** contain **Items** (referenced by ID)
3. **Items** reference their **Catalogs** (referenced by ID)
4. **RetailItems** extend **Items** with retail-specific properties

## Directory Structure

```
becknv2-schema/
├── context.jsonld          # Main context file with all namespaces
├── schemas/                # All Beckn Protocol schemas (owl:Class)
│   ├── Catalog.jsonld      # Product catalog schema
│   ├── Provider.jsonld     # Business provider schema
│   ├── Item.jsonld         # Base item schema
│   ├── RetailItem.jsonld   # Retail-specific item schema
│   ├── ShippingInfo.jsonld # Shipping information schema
│   ├── WarrantyInfo.jsonld # Warranty information schema
│   ├── DecimalValue.jsonld # Decimal value representation
│   ├── Image.jsonld        # Image representation
│   ├── MediaFile.jsonld    # Media file representation
│   ├── Price.jsonld        # Price representation
│   ├── Descriptor.jsonld   # Item descriptor schema
│   ├── Rating.jsonld       # Rating representation
│   ├── Category.jsonld     # Category classification
│   ├── Location.jsonld     # Location representation
│   └── Fulfillment.jsonld  # Fulfillment information
├── data/                   # Example data files
│   ├── provider-example.jsonld
│   ├── catalog-fresh-grocery.jsonld
│   ├── items-organic-apples.jsonld
│   └── items-smartphone.jsonld
└── README.md               # This file
```

**Note**: All schemas are consolidated in the `schemas/` directory since they are all of type `owl:Class`. The previous separation into `classes/`, `core/`, and `properties/` was unnecessary and confusing since these are not different types of schemas but rather different domains of the same schema type.

## Usage Examples

### Basic Context Usage

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:RetailItem",
  "beckn:name": "Organic Apples",
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

### Catalog with Items

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:Catalog",
  "beckn:descriptor": {
    "@type": "beckn:Descriptor",
    "schema:name": "Fresh Produce Catalog"
  },
  "beckn:categories": [
    {
      "@type": "beckn:Category",
      "schema:identifier": "fruits",
      "beckn:descriptor": {
        "@type": "beckn:Descriptor",
        "schema:name": "Fresh Fruits"
      }
    }
  ]
}
```

### Shipping Information

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
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
```

### Warranty Information

```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:WarrantyInfo",
  "beckn:warrantyType": "beckn:manufacturer",
  "beckn:warrantyName": "1-Year Manufacturer Warranty",
  "beckn:coveragePeriod": {
    "@type": "schema:Time",
    "schema:startDate": "2024-01-01"
  },
  "beckn:warrantyStatus": "beckn:active"
}
```

## RDF Principles Applied

### 1. Class Definitions
- Each schema becomes an `owl:Class`
- Proper inheritance using `rdfs:subClassOf`
- Schema.org integration for common entities

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
