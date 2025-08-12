# Beckn Protocol Retail Domain Data Examples

This directory contains example JSON-LD data files demonstrating how to use the Beckn Protocol schemas for retail applications.

## Overview

The examples showcase real-world retail scenarios using:
- **Providers**: Business entities offering products/services
- **Catalogs**: Product/service collections organized by categories
- **Items**: Individual products with detailed specifications
- **Schema.org Integration**: Leveraging existing standards for common entities

## Circular Reference Resolution

The data examples demonstrate how to avoid circular references:
- **Providers** are standalone entities with complete business information
- **Catalogs** reference providers by ID (`providerIds`) instead of embedding full objects
- **Items** reference catalogs by ID (`catalogIds`) instead of embedding full objects
- This approach maintains data integrity while enabling efficient querying and updates

## Data Relationships

### Example: Fresh Grocery Store
```
Provider: Fresh Grocery Store
    ↓ (providerIds)
Catalog: Organic Produce Catalog 2024
    ↓ (catalogIds)
Items: Organic Apples, Organic Vegetables, etc.
```

### Example: Tech Mart
```
Provider: Tech Mart
    ↓ (providerIds)
Catalog: Electronics & Gadgets Catalog 2024
    ↓ (catalogIds)
Items: iPhone 15 Pro Max, Laptops, etc.
```

### Key Properties
- **Provider**: `@id` and business information
- **Catalog**: `@id`, `providerIds`, categories, and metadata
- **Item**: `@id`, `catalogIds`, categories, and product details
- **RetailItem**: Extends Item with price, shipping, warranty, etc.

## Data Files

### Providers
1. **`provider-example.jsonld`** - Fresh Grocery Store (organic food retailer)
2. **`provider-tech-store.jsonld`** - Tech Mart (electronics retailer)

### Catalogs
1. **`catalog-fresh-grocery.jsonld`** - Organic produce catalog with categories
2. **`catalog-tech-mart.jsonld`** - Electronics catalog with tech categories

### Retail Items
1. **`items-organic-apples.jsonld`** - Organic apples with shipping and warranty info
2. **`items-smartphone.jsonld`** - iPhone 15 Pro Max with comprehensive details

## Example Scenarios

### Scenario 1: Organic Grocery Store
- **Provider**: Fresh Grocery Store (Mumbai)
- **Catalog**: Organic produce with fruits, vegetables, dairy categories
- **Items**: Organic apples with same-day delivery and freshness guarantee

### Scenario 2: Electronics Store
- **Provider**: Tech Mart (Bangalore)
- **Catalog**: Electronics with smartphones, laptops, gaming categories
- **Items**: iPhone 15 Pro Max with next-day delivery and Apple warranty

## Key Features Demonstrated

### 1. Provider Information
- Business descriptions and branding
- Multiple locations with addresses and GPS coordinates
- Ratings and labels for categorization
- Contact information and operational hours

### 2. Catalog Organization
- Hierarchical category structure
- Provider associations
- Time-based validity periods
- Descriptive metadata and images

### 3. Retail Item Details
- Comprehensive product descriptions
- Pricing with multiple value types
- Shipping options and costs
- Warranty information and terms
- Fulfillment and payment details
- Cancellation, refund, and return policies

### 4. Schema.org Integration
- Uses `schema:PostalAddress` for addresses
- Uses `schema:Time` for temporal data
- Uses `schema:Image` for media assets
- Maintains semantic web compatibility

## Usage Examples

### Basic Context Usage
```json
{
  "@context": "https://becknprotocol.io/schema/context.jsonld",
  "@type": "beckn:RetailItem",
  "beckn:name": "Product Name",
  "beckn:price": {
    "@type": "beckn:Price",
    "schema:price": 100.00,
    "schema:priceCurrency": "INR"
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
    "schema:name": "Store Name"
  },
  "beckn:locations": [
    {
      "@type": "beckn:Location",
      "schema:address": {
        "@type": "schema:PostalAddress",
        "schema:streetAddress": "123 Main Street",
        "schema:addressLocality": "City",
        "schema:addressCountry": "IN"
      }
    }
  ]
}
```

## Data Structure Benefits

### 1. Semantic Interoperability
- Machine-readable product information
- Structured data for search engines
- Linked data capabilities

### 2. E-commerce Integration
- Standardized product catalogs
- Consistent pricing structures
- Unified shipping and warranty information

### 3. Business Process Support
- Order fulfillment workflows
- Payment processing integration
- Customer service automation

## Validation

### JSON-LD Validation
- Use online JSON-LD validators
- Verify context resolution
- Check property inheritance

### RDF Validation
- Validate semantic structure
- Verify class hierarchies
- Check property constraints

## Extending the Examples

### Adding New Providers
1. Copy existing provider structure
2. Update business information
3. Modify location details
4. Adjust labels and categories

### Adding New Items
1. Use appropriate item type
2. Include required properties
3. Add domain-specific details
4. Maintain schema compliance

### Adding New Categories
1. Define category structure
2. Include descriptors
3. Link to parent categories
4. Add relevant labels

## Best Practices

### 1. Data Quality
- Use descriptive names and descriptions
- Include high-quality images
- Provide accurate pricing information
- Maintain up-to-date inventory

### 2. Schema Compliance
- Follow Beckn Protocol specifications
- Use appropriate schema.org classes
- Maintain consistent property naming
- Validate data structure

### 3. Performance
- Optimize image sizes
- Use appropriate TTL values
- Implement caching strategies
- Monitor data freshness

## Next Steps

1. **Customize Examples**: Adapt to your specific retail domain
2. **Add More Items**: Expand product catalogs
3. **Integrate Systems**: Connect with existing e-commerce platforms
4. **Validate Data**: Ensure compliance with schemas
5. **Test Workflows**: Verify end-to-end retail processes

## Support

For questions about the data examples or schema usage:
- Refer to the main schema documentation
- Check Beckn Protocol specifications
- Validate against JSON-LD standards
- Test with semantic web tools
