# Beckn Discover API - Design Summary

## Key Design Decisions

### 1. **Heterogeneous Item Support**
- **Problem**: Need to return mixed item types (ElectronicItem, GroceryItem, etc.) in a single response
- **Solution**: Dynamic context generation with `@type` annotations for each item
- **Benefit**: Clients can process different item types without knowing the schema in advance

### 2. **JSON-LD Context Flexibility**
- **Problem**: Request body needs to specify JSON-LD contexts for extended schemas
- **Solution**: `schema_contexts` array in request context section
- **Benefit**: API can validate and process fields from any extended schema

### 3. **Extended Schema Field Filtering**
- **Problem**: Filters need to reference fields from extended schemas (e.g., `electronic:brand.name`)
- **Solution**: Namespace-prefixed field references in filter conditions
- **Benefit**: Powerful filtering across all item types while maintaining schema awareness

### 4. **Dynamic Response Context**
- **Problem**: Response context must include all schemas for returned item types
- **Solution**: Automatic context generation based on actual returned items
- **Benefit**: Clients receive complete context information for processing results

## Architecture Highlights

### Request Structure
```
request/
├── context/
│   ├── domain_codes
│   ├── entity_types
│   └── schema_contexts[]          # JSON-LD context URIs
└── search/
    ├── structured_query/           # JSON API
    │   ├── filters/               # Extended schema field support
    │   ├── search_fields/         # Cross-schema field paths
    │   └── sort/                  # Multi-field sorting
    └── natural_query/             # Natural language
```

### Response Structure
```
response/
├── context/                       # Dynamic JSON-LD context
│   ├── @context                  # All necessary namespaces
│   └── schema_uris[]            # Schemas for returned items
├── results/
│   ├── items[]                   # Heterogeneous item array
│   │   ├── @type                # Item type (ElectronicItem, GroceryItem)
│   │   └── [schema-specific fields]
│   └── pagination
├── facets/                       # Aggregated result information
└── suggestions/                  # Search suggestions
```

## Field Resolution Strategy

### Namespace Prefixes
- **Base Item**: `descriptor.name`, `rating.value`
- **ElectronicItem**: `electronic:brand.name`, `electronic:price.schema:price`
- **GroceryItem**: `grocery:organicCertification`, `grocery:expiryDate`

### Nested Field Access
- **Single level**: `electronic:brand.name`
- **Multi-level**: `grocery:nutritionalInfo.calories`
- **Schema.org fields**: `electronic:price.schema:price`

## Filter Examples

### Cross-Schema Filtering
```json
"filters": {
  "operator": "and",
  "conditions": [
    "rating.value >= 4.0",                           // Base Item
    "electronic:brand.name = 'Tesla'",               // ElectronicItem
    "grocery:organicCertification = 'USDA Organic'", // GroceryItem
    "electronic:price.schema:price <= 50000"         // Nested field
  ]
}
```

### Type-Specific Filters
```json
"filters": {
  "operator": "or",
  "conditions": [
    "electronic:brand.name in ['Tesla', 'BMW', 'Audi']",
    "grocery:organicCertification exists"
  ]
}
```

## Context Management

### Request Context
- Clients specify which schemas they want to use
- API validates schema availability
- Enables field validation before processing

### Response Context
- Automatically generated based on returned items
- Includes all necessary namespaces
- Provides schema URIs for client reference

## Extensibility Features

### Adding New Item Types
1. Create new JSON-LD schema file
2. Update schema registry
3. No API changes required

### Schema Evolution
- Backward compatibility maintained
- Gradual schema updates supported
- Version control for schemas

## Performance Optimizations

### Indexing Strategy
- Common fields indexed across all item types
- Type-specific indexes for extended fields
- Composite indexes for frequent filter combinations

### Query Optimization
- Schema-aware query planning
- Field existence checking
- Result set size optimization

## Security Considerations

### Schema Validation
- URI validation for all schemas
- Field reference sanitization
- Schema injection prevention

### Access Control
- Schema-level permissions
- Field-level access control
- Rate limiting per schema

## Implementation Benefits

1. **Unified Interface**: Single API endpoint for all item types
2. **Schema Agnostic**: No hardcoded item type dependencies
3. **Future Proof**: Easy to add new item types
4. **Performance**: Optimized for heterogeneous queries
5. **Standards Compliant**: Full JSON-LD support
6. **Developer Friendly**: Intuitive field reference syntax

## Use Cases Supported

1. **E-commerce Search**: Mixed product catalogs
2. **Service Discovery**: Various service types
3. **Content Search**: Different content schemas
4. **Multi-domain Search**: Cross-domain item discovery
5. **Personalized Results**: User preference-based filtering

This design provides a robust foundation for building scalable, extensible discovery APIs that can handle the complexity of modern digital commerce while maintaining simplicity and performance.
