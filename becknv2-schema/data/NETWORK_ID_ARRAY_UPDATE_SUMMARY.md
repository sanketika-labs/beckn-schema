# Network ID Array Update Summary

## Overview

This document summarizes the changes made to update `network_id` and `beckn:networkId` from string type to array type across the entire schema system.

## Schema Changes

### 1. Core Item Schema (`schemas/core/Item.jsonld`)

#### **Before**
```json
{
  "@type": "owl:Restriction",
  "owl:onProperty": {
    "@id": "beckn:networkId",
    "rdfs:label": "Item Network ID",
    "rdfs:comment": "Network identifier for the BAP (Beckn App Provider) that offers this item"
  },
  "owl:allValuesFrom": "schema:Text"
}
```

#### **After**
```json
{
  "@type": "owl:Restriction",
  "owl:onProperty": {
    "@id": "beckn:networkId",
    "rdfs:label": "Item Network ID",
    "rdfs:comment": "Array of network identifiers for the BAP (Beckn App Provider) that offers this item"
  },
  "owl:allValuesFrom": {
    "@type": "rdfs:Bag",
    "rdfs:member": "schema:Text"
  }
}
```

## Data File Updates

### 1. Electronic Items

#### **Updated Files**
- ✅ `laptop-item.jsonld`: `"beckn:networkId": ["bap.net/electronics"]`
- ✅ `smartphone-item.jsonld`: `"beckn:networkId": ["bap.net/electronics"]`
- ✅ `smartwatch-item.jsonld`: `"beckn:networkId": ["bap.net/electronics"]`
- ✅ `tablet-item.jsonld`: `"beckn:networkId": ["bap.net/electronics"]`

#### **Before**
```json
"beckn:networkId": "bap.net/electronics"
```

#### **After**
```json
"beckn:networkId": ["bap.net/electronics"]
```

### 2. Grocery Items

#### **Updated Files**
- ✅ `fresh-milk-item.jsonld`: `"beckn:networkId": ["bap.net/grocery"]`
- ✅ `organic-apples-item.jsonld`: `"beckn:networkId": ["bap.net/grocery"]`
- ✅ `organic-bread-item.jsonld`: `"beckn:networkId": ["bap.net/grocery"]`
- ✅ `local-honey-item.jsonld`: `"beckn:networkId": ["bap.net/grocery"]`

#### **Before**
```json
"beckn:networkId": "bap.net/grocery"
```

#### **After**
```json
"beckn:networkId": ["bap.net/grocery"]
```

### 3. Special Items

#### **Updated Files**
- ✅ `item-with-electronic-attributes.jsonld`: `"beckn:networkId": ["bap.net/electronics"]`

### 4. Catalog Files

#### **Updated Files**
- ✅ `catalog-tech-mart.jsonld`: All 4 electronic items now have `"beckn:networkId": ["bap.net/electronics"]`
- ✅ `catalog-fresh-grocery.jsonld`: All 4 grocery items now have `"beckn:networkId": ["bap.net/grocery"]`

#### **Before**
Catalog items were missing the `beckn:networkId` property entirely.

#### **After**
All catalog items now include the `beckn:networkId` array:
```json
// Electronics catalog items
"beckn:networkId": ["bap.net/electronics"]

// Grocery catalog items  
"beckn:networkId": ["bap.net/grocery"]
```

## API Specification Updates

### 1. OpenAPI Schema (`api-specs/discover-api-openapi.yaml`)

#### **RequestContext.network_id**
```yaml
network_id:
  type: array
  items:
    type: string
  description: Array of network identifiers for the BAP (Beckn App Provider) that offer this item
  example: ["bap.net/electronics", "bap.net/tech"]
```

#### **Item.networkId**
```yaml
"beckn:networkId":
  type: array
  items:
    type: string
  description: Array of network identifiers for the BAP (Beckn App Provider) that offers this item
  example: ["bap.net/electronics", "bap.net/tech"]
```

### 2. Request Examples
All request examples updated to show array format:
```json
"network_id": ["bap.net/electronics"]
"network_id": ["bap.net/grocery"]
"network_id": ["bap.net/mixed", "bap.net/electronics", "bap.net/grocery"]
```

### 3. Response Examples
All response examples updated to show array format:
```json
"network_id": ["bap.net/electronics"]
"beckn:networkId": ["bap.net/electronics"]
```

## Design Document Updates

### 1. API Design (`api-specs/discover-api-design.md`)

#### **Context Section Description**
- **Before**: "Network identifier for the BAP (Beckn App Provider)"
- **After**: "Array of network identifiers for the BAP (Beckn App Provider)"

#### **Examples Updated**
- ✅ Base request: `"network_id": ["bap.net/electronics"]`
- ✅ Multi-schema: `"network_id": ["bap.net/mixed", "bap.net/electronics", "bap.net/grocery"]`
- ✅ Response context: `"network_id": ["bap.net/electronics"]`

#### **Benefits Section Added**
- **Cross-Network Search**: Items can be associated with multiple networks
- **Federated Discovery**: Search across multiple BAP networks simultaneously
- **Network Aggregation**: Combine results from different network providers
- **Flexible Affiliation**: Items can belong to multiple network categories

#### **Browser Search Examples**
```
GET /beckn/discover/browser-search?network_id=bap.net/electronics,bap.net/tech
GET /beckn/discover/browser-search?network_id=bap.net/grocery&category=organic
```

## Benefits of Array Type

### 1. **Enhanced Functionality**
- **Multi-Network Items**: Items can belong to multiple networks simultaneously
- **Cross-Network Search**: Search across multiple network domains in one query
- **Federated Discovery**: Combine results from different BAP providers
- **Flexible Categorization**: Items can be part of multiple network categories

### 2. **Use Cases**
- **Electronics + Tech**: An item can belong to both "electronics" and "tech" networks
- **Grocery + Local**: An item can belong to both "grocery" and "local" networks
- **Cross-Domain Items**: Items that span multiple business domains
- **Network Aggregation**: Combine specialized networks for comprehensive search

### 3. **Technical Advantages**
- **Consistent Schema**: Both request and item schemas use array type
- **Extensible Design**: Easy to add new networks without schema changes
- **Validation Support**: Proper array validation in OpenAPI
- **JSON-LD Compliance**: Follows RDF/OWL array patterns

## Implementation Notes

### 1. **Backward Compatibility**
- **Single Network**: `["bap.net/electronics"]` (array with one element)
- **Multiple Networks**: `["bap.net/electronics", "bap.net/tech"]`
- **Empty Array**: `[]` (no network association)

### 2. **Validation Rules**
- **Type**: Must be an array
- **Items**: Each item must be a string (network identifier)
- **Required**: Array can be empty but must be present
- **Format**: Network identifiers should follow BAP naming conventions

### 3. **Search Behavior**
- **Single Network**: `network_id=["bap.net/electronics"]` - search only electronics network
- **Multiple Networks**: `network_id=["bap.net/electronics", "bap.net/tech"]` - search both networks
- **Network + Filters**: Combine with other search parameters for refined results

## Summary

All components of the schema system have been successfully updated to support `network_id` and `beckn:networkId` as arrays:

- ✅ **Core Schema**: Item.jsonld updated with proper RDF array type
- ✅ **Data Files**: All 9 individual item files updated to use array format
- ✅ **Catalog Files**: All 8 catalog items updated to include beckn:networkId arrays
- ✅ **API Spec**: OpenAPI schema and examples updated
- ✅ **Design Doc**: Comprehensive documentation and examples
- ✅ **Benefits**: Clear explanation of multi-network advantages

This change enables powerful cross-network search capabilities and flexible item categorization across multiple BAP networks.
