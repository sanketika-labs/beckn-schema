# Intelligent Category System for Beckn Protocol

## Overview

The Beckn Protocol now features an intelligent category system that provides hierarchical categorization, intelligent attributes, and automatic mapping between item types and categories. This system enables better search, filtering, and business logic based on item characteristics.

## 🏗️ Architecture

### Schema Hierarchy
```
beckn:Item (Base Class)
├── beckn:ElectronicItem (Electronics & Technology)
└── beckn:GroceryItem (Grocery & Food)
```

### Category Structure
```
ELECTRONICS (Level 1)
├── SMARTPHONES (Level 2)
├── LAPTOPS (Level 2)
├── TABLETS (Level 2)
├── WEARABLES (Level 2)
├── GAMING (Level 2)
└── SMART_HOME (Level 2)

GROCERY (Level 1)
├── FRESH_FRUITS (Level 2)
├── FRESH_VEGETABLES (Level 2)
├── DAIRY_EGGS (Level 2)
├── PANTRY_ESSENTIALS (Level 2)
├── BEVERAGES (Level 2)
└── FROZEN_FOODS (Level 2)
```

## 🧠 Intelligent Features

### 1. Automatic Attribute Inference

The system automatically assigns relevant attributes based on category:

#### Electronics (Non-perishable)
- `perishable: false`
- `storageType: "room_temperature"`
- `requiresSpecialHandling: true`
- `seasonal: false`

#### Grocery Items (Variable perishability)
- **Fresh Fruits**: `perishable: true`, `storageType: "refrigerated"`
- **Dairy**: `perishable: true`, `storageType: "refrigerated"`
- **Pantry**: `perishable: false`, `storageType: "shelf_stable"`
- **Honey**: `perishable: false`, `storageType: "shelf_stable"`

### 2. Smart Category Mapping

```json
{
  "beckn:categoryMapping": {
    "beckn:electronicItems": {
      "beckn:primaryCategory": "ELECTRONICS",
      "beckn:subCategory": "SMARTPHONES",
      "beckn:itemType": "beckn:ElectronicItem"
    },
    "beckn:groceryItems": {
      "beckn:primaryCategory": "GROCERY",
      "beckn:subCategory": "FRESH_FRUITS",
      "beckn:itemType": "beckn:GroceryItem"
    }
  }
}
```

### 3. Hierarchical Relationships

Each category maintains parent-child relationships:
- `beckn:parentCategory`: Links to parent category
- `beckn:level`: Indicates hierarchy depth
- `beckn:subCategories`: Contains child categories

## 📱 Electronic Items

### Schema: `beckn:ElectronicItem`
- **Namespace**: `electronic:`
- **Properties**: `electronicItemId`, `price`, `quantity`, `brand`, `sku`
- **Special Features**: `shippingInfo`, `fulfillments`, `payments`, `addOnIds`

### Example Categories
- **SMARTPHONES**: Mobile devices with cellular connectivity
- **LAPTOPS**: Portable computers for productivity and gaming
- **TABLETS**: Touch-screen computing devices
- **WEARABLES**: Smartwatches and fitness trackers

## 🥕 Grocery Items

### Schema: `beckn:GroceryItem`
- **Namespace**: `grocery:`
- **Properties**: `groceryItemId`, `price`, `quantity`, `brand`, `sku`
- **Special Features**: `expiryDate`, `storageInstructions`, `nutritionalInfo`, `organicCertification`

### Example Categories
- **FRESH_FRUITS**: Perishable fruits requiring refrigeration
- **DAIRY_EGGS**: Milk, cheese, eggs requiring cold storage
- **PANTRY_ESSENTIALS**: Shelf-stable items like bread, honey, grains

## 🔍 Search & Filtering Examples

### Find All Perishable Items
```sparql
SELECT ?item WHERE {
  ?item a ?itemType .
  ?item beckn:category ?category .
  ?category beckn:perishable true .
}
```

### Find Items by Storage Type
```sparql
SELECT ?item WHERE {
  ?item a ?itemType .
  ?item beckn:category ?category .
  ?category beckn:storageType "refrigerated" .
}
```

### Find Items by Parent Category
```sparql
SELECT ?item WHERE {
  ?item a ?itemType .
  ?item beckn:category ?category .
  ?category beckn:parentCategory "GROCERY" .
}
```

## 🚀 Business Logic Applications

### 1. Shipping Optimization
- **Perishable items**: Prioritize same-day delivery
- **Electronics**: Standard shipping with insurance
- **Heavy items**: Special handling requirements

### 2. Inventory Management
- **Perishable**: Track expiry dates, FIFO rotation
- **Non-perishable**: Standard inventory management
- **Seasonal**: Plan for demand fluctuations

### 3. Pricing Strategies
- **Perishable**: Dynamic pricing based on expiry
- **Electronics**: Competitive pricing, bundle offers
- **Organic**: Premium pricing for certification

### 4. Customer Experience
- **Storage recommendations**: Automatic display based on category
- **Delivery options**: Tailored to item requirements
- **Return policies**: Category-specific terms

## 📊 Implementation Benefits

### For Developers
- **Consistent structure**: Standardized item schemas
- **Type safety**: Clear item type definitions
- **Extensibility**: Easy to add new categories

### For Businesses
- **Better search**: Intelligent categorization
- **Inventory optimization**: Category-based management
- **Customer satisfaction**: Relevant recommendations

### For Customers
- **Easier discovery**: Logical category organization
- **Better information**: Category-specific details
- **Improved experience**: Tailored interactions

## 🔮 Future Enhancements

### 1. Machine Learning Integration
- **Automatic categorization**: AI-powered item classification
- **Demand prediction**: Category-based forecasting
- **Personalization**: Category-aware recommendations

### 2. Advanced Attributes
- **Environmental impact**: Carbon footprint, sustainability
- **Allergen information**: Food safety attributes
- **Compatibility**: Electronics compatibility matrices

### 3. Cross-Category Relationships
- **Bundle suggestions**: Complementary items
- **Substitution logic**: Alternative product recommendations
- **Cross-selling**: Related category promotions

## 📝 Usage Examples

### Creating an Electronic Item
```json
{
  "@type": "beckn:ElectronicItem",
  "electronic:electronicItemId": "smartphone-001",
  "beckn:category": {
    "schema:codeValue": "SMARTPHONES",
    "beckn:parentCategory": "ELECTRONICS",
    "beckn:level": 2
  }
}
```

### Creating a Grocery Item
```json
{
  "@type": "beckn:GroceryItem",
  "grocery:groceryItemId": "apples-001",
  "beckn:category": {
    "schema:codeValue": "FRESH_FRUITS",
    "beckn:parentCategory": "GROCERY",
    "beckn:level": 2,
    "beckn:perishable": true,
    "beckn:storageType": "refrigerated"
  }
}
```

This intelligent category system provides a robust foundation for scalable e-commerce applications while maintaining flexibility for future enhancements.
