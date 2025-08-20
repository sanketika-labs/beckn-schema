# Beckn Protocol Data Examples

This directory contains example JSON-LD data files that demonstrate the usage of the Beckn Protocol schemas for the retail domain.

## 📁 **Data Structure**

### **Providers** (`@type: "beckn:Provider"`)
- **`provider-grocery-store.jsonld`** - Fresh Market Grocery Store
- **`provider-tech-store.jsonld`** - TechMart Electronics

### **Catalogs** (`@type: "beckn:Catalog"`)
- **`catalog-fresh-grocery.jsonld`** - Fresh Market Organic Groceries (lists GroceryItems)
- **`catalog-tech-mart.jsonld`** - TechMart Electronics Catalog (lists ElectronicItems)

### **Items** (`@type: "beckn:Item"`)
- **`items-organic-apples.jsonld`** - Organic Gala Apples (Base Item)
- **`items-smartphone.jsonld`** - Premium Smartphone Pro (Base Item)

### **Grocery Items** (`@type: "beckn:GroceryItem"`)
- **`organic-apples-item.jsonld`** - Organic Gala Apples with Grocery Properties
- **`fresh-milk-item.jsonld`** - Fresh Organic Whole Milk with Grocery Properties
- **`organic-bread-item.jsonld`** - Artisan Organic Sourdough Bread with Grocery Properties
- **`local-honey-item.jsonld`** - Local Wildflower Honey with Grocery Properties

### **Electronic Items** (`@type: "beckn:ElectronicItem"`)
- **`smartphone-item.jsonld`** - Premium Smartphone Pro with Electronic Properties
- **`smartwatch-item.jsonld`** - Premium Smartwatch Series with Electronic Properties
- **`laptop-item.jsonld`** - Premium Gaming Laptop Pro with Electronic Properties
- **`tablet-item.jsonld`** - Premium Tablet Pro with Electronic Properties

## 🔗 **Data Relationships**

### **Provider → Catalog → Item → ElectronicItem Hierarchy**

```
Provider (grocery-store-001)
    ↓
Catalog (catalog-fresh-grocery-001)
    ↓ (references providerId)
Item (item-organic-apples-001)
    ↓ (extends with electronic properties)
ElectronicItem (smartphone-item-001)
```

### **Circular Reference Resolution**

The data examples demonstrate how to avoid circular references:

- **Catalogs** reference providers by ID (`beckn:providerId: "grocery-store-001"`)
- **Items** can reference catalogs by ID (`beckn:catalogIds: ["catalog-fresh-grocery-001"]`)
- **ElectronicItems** extend Items with additional electronic-specific properties

## 📊 **Data Examples Breakdown**

### **1. Provider Examples**

#### **Fresh Market Grocery Store**
- **Type**: `beckn:Provider` (extends `schema:Organization`)
- **Features**: Organic certification, local sourcing, sustainable practices
- **Location**: Organic City, Green State, US
- **Rating**: 4.8/5 (1,250 reviews)

#### **TechMart Electronics**
- **Type**: `beckn:Provider` (extends `schema:Organization`)
- **Features**: Electronics specialty, expert support, extended warranty
- **Location**: Digital City, Innovation State, US
- **Rating**: 4.6/5 (890 reviews)

### **2. Catalog Examples**

#### **Fresh Market Organic Groceries**
- **Type**: `beckn:Catalog` (extends `schema:Collection`)
- **Provider**: References `grocery-store-001`
- **Items**: Organic fruits, dairy, pantry essentials
- **Category**: Grocery & Food

#### **TechMart Electronics Catalog**
- **Type**: `beckn:Catalog` (extends `schema:Collection`)
- **Provider**: References `tech-store-001`
- **Items**: Smartphones, laptops, tablets, smart devices
- **Category**: Electronics & Technology

### **3. Item Examples (Base Schema)**

#### **Organic Gala Apples**
- **Type**: `beckn:Item` (extends `schema:Product`)
- **Category**: Fresh Fruits
- **Features**: USDA Organic, local farm sourcing
- **Rating**: 4.9/5 (156 reviews)

#### **Premium Smartphone Pro**
- **Type**: `beckn:Item` (extends `schema:Product`)
- **Category**: Smartphones & Mobile
- **Features**: 5G ready, professional camera, latest processor
- **Rating**: 4.7/5 (89 reviews)

### **4. Retail Item Examples (Extended Schema)**

#### **Grocery Retail Items**
- **`retail-item-organic-apples.jsonld`** - Organic Gala Apples ($4.99, 500g)
- **`retail-item-fresh-milk.jsonld`** - Fresh Organic Whole Milk ($3.99, 946ml)
- **`retail-item-organic-bread.jsonld`** - Artisan Organic Sourdough Bread ($5.99, 680g)
- **`retail-item-local-honey.jsonld`** - Local Wildflower Honey ($8.99, 340g)

#### **Electronics Items**
- **`smartphone-item.jsonld`** - Premium Smartphone Pro ($999.99)
- **`laptop-item.jsonld`** - Premium Gaming Laptop Pro ($1499.99)
- **`tablet-item.jsonld`** - Premium Tablet Pro ($799.99)
- **`smartwatch-item.jsonld`** - Premium Smartwatch Series ($399.99)

**All RetailItems include**: Pricing, shipping, fulfillment, payment, add-ons, and terms (cancellation, refund, replacement, return)

## 🎯 **Key Features Demonstrated**

### **Schema Compliance**
- ✅ **Provider Schema**: Organization-based with Beckn extensions
- ✅ **Catalog Schema**: Collection-based with provider and item references
- ✅ **Item Schema**: Product-based with category and location support
- ✅ **RetailItem Schema**: Item extension with retail-specific properties

### **Data Types**
- ✅ **schema:Number** for prices and measurements (replacing custom DecimalValue)
- ✅ **schema:Text** for strings and identifiers
- ✅ **schema:Boolean** for boolean values
- ✅ **schema:DateTime** for timestamps
- ✅ **schema:URL** for web addresses
- ✅ **schema:Email** for email addresses

### **Property Usage**
- ✅ **Labels**: Using `schema:PropertyValue` for structured metadata
- ✅ **Ratings**: Comprehensive rating information with counts and categories
- ✅ **Locations**: Detailed address and GPS information
- ✅ **Time Periods**: Start and end dates for validity

## 🚀 **Usage Examples**

### **Querying Providers**
```json
{
  "@type": "beckn:Provider",
  "beckn:id": "grocery-store-001",
  "schema:name": "Fresh Market Grocery Store"
}
```

### **Querying Catalogs by Provider**
```json
{
  "@type": "beckn:Catalog",
  "beckn:providerId": "grocery-store-001",
  "beckn:items": [
    { "@type": "beckn:GroceryItem", "grocery:groceryItemId": "organic-apples-item-001" },
    { "@type": "beckn:GroceryItem", "grocery:groceryItemId": "fresh-milk-item-001" }
  ]
}
```

### **Querying Items with Retail Properties**
```json
{
  "@type": "beckn:RetailItem",
  "retail:price": {
    "@type": "beckn:Price",
    "schema:price": 4.99,
    "schema:priceCurrency": "USD"
  },
  "retail:shippingInfo": { ... }
}
```

## 📋 **Data Validation**

All data examples are validated against their respective schemas:

- ✅ **Provider**: Extends `schema:Organization` with Beckn properties
- ✅ **Catalog**: Extends `schema:Collection` with provider and item references
- ✅ **Item**: Extends `schema:Product` with Beckn properties
- ✅ **RetailItem**: Extends `beckn:Item` with retail-specific properties

## 🔄 **Data Updates**

The data examples have been updated to reflect:

1. **Schema Changes**: Using updated Provider, Catalog, Item, and RetailItem schemas
2. **Property Updates**: Using `schema:Number` instead of custom `beckn:DecimalValue`
3. **Structure Improvements**: Cleaner, more consistent data organization
4. **Relationship Clarity**: Clear provider → catalog → item → retail item hierarchy

## 📚 **Related Documentation**

- **Schemas**: See `../schemas/` directory for JSON-LD schema definitions
- **Context**: See `../context.jsonld` for namespace mappings
- **Main README**: See `../README.md` for project overview

---

*These data examples demonstrate real-world usage of the Beckn Protocol schemas for retail e-commerce applications.* 🛒✨
