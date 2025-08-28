# ONDC Grocery Item Schema Design Document

## 1. Schema Analysis Overview

The ONDC Grocery Item schema extends the base Beckn Protocol Item schema with ONDC-specific attributes and statutory requirements for Indian grocery commerce. This design document outlines the transformation from Beckn v1 schemas (Catalog, Provider, Item) to a lean v2 schema that leverages schema.org standards while maintaining ONDC compliance.

### 1.1 Analyzed Source Schemas

1. **Beckn v1 Catalog.yaml**
   - **Focus**: BPP-level catalog information with providers and fulfillments
   - **Key Elements**: Descriptor, fulfillments, payments, offers, providers array
   - **Transformation**: Simplified to use beckn:Catalog core schema

2. **Beckn v1 Provider.yaml**
   - **Focus**: Business entity information with locations, fulfillments, and items
   - **Key Elements**: ID, descriptor, category, rating, locations, fulfillments, payments
   - **Transformation**: Simplified to use beckn:Provider core schema

3. **Beckn v1 Item.yaml**
   - **Focus**: Product information with pricing, quantity, and category references
   - **Key Elements**: ID, descriptor, price, quantity, category_ids, fulfillment_ids
   - **Transformation**: Extended with ONDC-specific properties

4. **ONDC on_search.json**
   - **Focus**: ONDC-specific grocery item data with statutory requirements
   - **Key Elements**: Return policies, shipping info, payment methods, statutory compliance
   - **Transformation**: Mapped to ONDC core schemas and item extensions

### 1.2 Analysis Findings

Through this analysis, a consistent transformation pattern was identified:

1. **Core Schema Usage**: Leverage existing beckn:Catalog, beckn:Provider, and beckn:Item from core
2. **ONDC Core Schemas**: Create reusable schemas for common ONDC functionality
3. **Item-Centric Design**: Move most ONDC metadata to item level for better organization
4. **Schema.org Integration**: Use standard semantic web entities for compliance and interoperability

---

## 2. Schema Design Decisions

### 2.1 Property Mapping Strategy

**From Beckn v1 Catalog → Beckn v2 Core Catalog:**
- `descriptor` → `beckn:descriptor` (Direct mapping)
  - **Original**: Catalog-level description and branding
  - **New**: Uses beckn:Catalog core schema descriptor
  - **Benefit**: Standardized catalog structure
- `fulfillments` → `beckn:fulfillments` (Direct mapping)
  - **Original**: BPP-level fulfillment methods
  - **New**: Uses beckn:Catalog core schema fulfillments
  - **Benefit**: Standardized fulfillment representation
- `providers` → `beckn:providers` (Direct mapping)
  - **Original**: Array of provider references
  - **New**: Uses beckn:Catalog core schema providers
  - **Benefit**: Standardized provider relationships

**From Beckn v1 Provider → Beckn v2 Core Provider:**
- `id` → `beckn:id` (Direct mapping)
  - **Original**: Provider identifier
  - **New**: Uses beckn:Provider core schema ID
  - **Benefit**: Standardized identifier format
- `descriptor` → `beckn:descriptor` (Direct mapping)
  - **Original**: Provider name, description, images
  - **New**: Uses beckn:Provider core schema descriptor
  - **Benefit**: Standardized provider information
- `category_id` → `ondc:categoryId` (ONDC-specific mapping)
  - **Original**: Provider category identifier
  - **New**: ONDC-specific category mapping
  - **Benefit**: Domain-specific categorization
- `rating` → `beckn:rating` (Direct mapping)
  - **Original**: Provider rating information
  - **New**: Uses beckn:Provider core schema rating
  - **Benefit**: Standardized rating structure

**From Beckn v1 Item → ONDC Grocery Item Extensions:**
- `id` → `beckn:id` (Direct mapping)
  - **Original**: Item identifier
  - **New**: Uses beckn:Item core schema ID
  - **Benefit**: Standardized identifier format
- `descriptor` → `beckn:descriptor` (Direct mapping)
  - **Original**: Item name, description, images
  - **New**: Uses beckn:Item core schema descriptor
  - **Benefit**: Standardized item information
- `price` → `beckn:price` (Direct mapping)
  - **Original**: Item pricing information
  - **New**: Uses beckn:Item core schema price
  - **Benefit**: Standardized pricing structure
- `quantity` → `beckn:quantity` (Direct mapping)
  - **Original**: Item quantity and availability
  - **New**: Uses beckn:Item core schema quantity
  - **Benefit**: Standardized quantity representation

**From ONDC on_search.json → New ONDC Extensions:**
- `@ondc/org/returnable` → `ondc:returnPolicy` (ONDC core schema)
  - **Original**: Simple boolean returnable flag
  - **New**: Rich return policy using ONDC core ReturnPolicy schema
  - **Schema.org**: Extends `schema:MerchantReturnPolicy`
- `@ondc/org/cancellable` → `ondc:returnPolicy` (ONDC core schema)
  - **Original**: Simple boolean cancellable flag
  - **New**: Part of comprehensive return policy
  - **Schema.org**: Extends `schema:MerchantReturnPolicy`
- `@ondc/org/time_to_ship` → `ondc:shippingInfo` (ONDC core schema)
  - **Original**: ISO 8601 duration string
  - **New**: Rich shipping information using ONDC core ShippingInfo schema
  - **Schema.org**: Extends `schema:ShippingInfo`
- `@ondc/org/available_on_cod` → `ondc:paymentMethods` (ONDC core schema)
  - **Original**: Simple boolean COD flag
  - **New**: Comprehensive payment methods using ONDC core PaymentMethods schema
  - **Schema.org**: Extends `schema:PaymentMethod`

### 2.2 New ONDC-Specific Properties (Enhanced with Schema.org)

#### 2.2.1 Return and Cancellation Policies
- `ondc:returnPolicy` (extends ONDC core ReturnPolicy)
  - **New Property**: Comprehensive return and cancellation policy
  - **Schema.org**: Extends `schema:MerchantReturnPolicy`
  - **Benefits**: Standardized return policy, international compliance

#### 2.2.2 Shipping Information
- `ondc:shippingInfo` (extends ONDC core ShippingInfo)
  - **New Property**: Shipping time, delivery methods, shipping zones
  - **Schema.org**: Extends `schema:ShippingInfo`
  - **Benefits**: Standardized shipping information, delivery tracking

#### 2.2.3 Payment Methods
- `ondc:paymentMethods` (extends ONDC core PaymentMethods)
  - **New Property**: COD availability, online payments, digital wallets
  - **Schema.org**: Extends `schema:PaymentMethod`
  - **Benefits**: Standardized payment method representation

#### 2.2.4 Consumer Care
- `ondc:consumerCare` (extends ONDC core ContactPoint)
  - **New Property**: Consumer care contact information
  - **Schema.org**: Extends `schema:ContactPoint`
  - **Benefits**: Standardized contact information, accessibility

#### 2.2.5 Statutory Requirements
- `ondc:statutoryRequirements` (extends ONDC core StatutoryRequirements)
  - **New Property**: FSSAI compliance, nutritional info, additives
  - **Schema.org**: Extends `schema:Product`
  - **Benefits**: Regulatory compliance, food safety standards

#### 2.2.6 Dietary Categories
- `ondc:dietaryCategory` (extends ONDC core DietaryCategory)
  - **New Property**: Vegetarian, vegan, gluten-free, etc.
  - **Schema.org**: Extends `schema:Enumeration`
  - **Benefits**: Standardized dietary preferences, accessibility

#### 2.2.7 Fulfillment Methods
- `ondc:fulfillmentMethods` (array of schema:DeliveryMethod)
  - **New Property**: Home delivery, self pickup, express delivery
  - **Schema.org**: Uses `schema:DeliveryMethod`
  - **Benefits**: Standardized delivery method representation

### 2.3 Complete Property Mapping Table

| Beckn v1 Source | Original Property | New Property | Schema.org Entity | Transformation Type | Benefits |
|------------------|-------------------|---------------|-------------------|---------------------|----------|
| **Catalog.yaml** |
| `descriptor` | `descriptor` | `beckn:descriptor` | `beckn:Descriptor` | Direct mapping | Standardized catalog structure |
| `fulfillments` | `fulfillments[]` | `beckn:fulfillments` | `beckn:Fulfillment` | Direct mapping | Standardized fulfillment representation |
| `providers` | `providers[]` | `beckn:providers` | `beckn:Provider` | Direct mapping | Standardized provider relationships |
| `exp` | `exp` | `beckn:exp` | `beckn:Time` | Direct mapping | Standardized expiration handling |
| `ttl` | `ttl` | `beckn:ttl` | `beckn:Time` | Direct mapping | Standardized time-to-live handling |
| **Provider.yaml** |
| `id` | `id` | `beckn:id` | `beckn:Identifier` | Direct mapping | Standardized identifier format |
| `descriptor` | `descriptor` | `beckn:descriptor` | `beckn:Descriptor` | Direct mapping | Standardized provider information |
| `category_id` | `category_id` | `ondc:categoryId` | `ondc:CategoryCode` | ONDC-specific mapping | Domain-specific categorization |
| `rating` | `rating` | `beckn:rating` | `beckn:Rating` | Direct mapping | Standardized rating structure |
| `time` | `time` | `beckn:time` | `beckn:Time` | Direct mapping | Standardized time handling |
| `locations` | `locations[]` | `beckn:locations` | `beckn:Location` | Direct mapping | Standardized location representation |
| `fulfillments` | `fulfillments[]` | `beckn:fulfillments` | `beckn:Fulfillment` | Direct mapping | Standardized fulfillment representation |
| `payments` | `payments[]` | `beckn:payments` | `beckn:Payment` | Direct mapping | Standardized payment representation |
| **Item.yaml** |
| `id` | `id` | `beckn:id` | `beckn:Identifier` | Direct mapping | Standardized identifier format |
| `descriptor` | `descriptor` | `beckn:descriptor` | `beckn:Descriptor` | Direct mapping | Standardized item information |
| `price` | `price` | `beckn:price` | `beckn:Price` | Direct mapping | Standardized pricing structure |
| `quantity` | `quantity` | `beckn:quantity` | `beckn:Quantity` | Direct mapping | Standardized quantity representation |
| `category_ids` | `category_ids[]` | `ondc:categoryId` | `ondc:CategoryCode` | ONDC-specific mapping | Domain-specific categorization |
| `fulfillment_ids` | `fulfillment_ids[]` | `ondc:fulfillmentMethods` | `schema:DeliveryMethod` | ONDC extension | Standardized delivery methods |
| `location_ids` | `location_ids[]` | `beckn:availableAt` | `beckn:Location` | Core field mapping | Standardized location handling |
| **ONDC on_search.json** |
| `@ondc/org/returnable` | `returnable` | `ondc:returnPolicy` | `ondc:ReturnPolicy` | ONDC core schema | Rich return policy, compliance |
| `@ondc/org/cancellable` | `cancellable` | `ondc:returnPolicy` | `ondc:ReturnPolicy` | ONDC core schema | Comprehensive return policy |
| `@ondc/org/return_window` | `return_window` | `ondc:returnPolicy` | `ondc:ReturnPolicy` | ONDC core schema | Return time window |
| `@ondc/org/seller_pickup_return` | `seller_pickup_return` | `ondc:returnPolicy` | `ondc:ReturnPolicy` | ONDC core schema | Return pickup service |
| `@ondc/org/time_to_ship` | `time_to_ship` | `ondc:shippingInfo` | `ondc:ShippingInfo` | ONDC core schema | Shipping time information |
| `@ondc/org/available_on_cod` | `available_on_cod` | `ondc:paymentMethods` | `ondc:PaymentMethods` | ONDC core schema | Payment method availability |
| `@ondc/org/contact_details_consumer_care` | `contact_details_consumer_care` | `ondc:consumerCare` | `ondc:ContactPoint` | ONDC core schema | Consumer care contact |
| `@ondc/org/statutory_reqs_*` | `statutory_reqs_*` | `ondc:statutoryRequirements` | `ondc:StatutoryRequirements` | ONDC core schema | Regulatory compliance |
| `@ondc/org/mandatory_reqs_*` | `mandatory_reqs_*` | `ondc:statutoryRequirements` | `ondc:StatutoryRequirements` | ONDC core schema | Mandatory requirements |
| `tags` | `tags.veg` | `ondc:dietaryCategory` | `ondc:DietaryCategory` | ONDC core schema | Standardized dietary preferences |
| `tags` | `tags.non_veg` | `ondc:dietaryCategory` | `ondc:DietaryCategory` | ONDC core schema | Standardized dietary preferences |
| **New ONDC Extensions** |
| - | - | `ondc:fulfillmentMethods` | `schema:DeliveryMethod[]` | New property | Multiple delivery options |
| - | - | `ondc:fssaiLicenseNo` | `schema:Text` | New property | FSSAI compliance |
| - | - | `ondc:serviceabilityTags` | `schema:PropertyValue[]` | New property | Serviceability information |

### 2.4 Schema.org Integration Benefits

#### 2.4.1 Microdata Generation
The transformed properties now generate perfect schema.org microdata:
```html
<div itemscope itemtype="https://schema.org/Product">
  <h1 itemprop="name">{{beckn:descriptor.name}}</h1>
  <div itemprop="description">{{beckn:descriptor.longDesc}}</div>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <meta itemprop="priceCurrency" content="{{beckn:price.currency}}" />
    <meta itemprop="price" content="{{beckn:price.value}}" />
  </div>
  <div itemprop="brand" itemscope itemtype="https://schema.org/Brand">
    <span itemprop="name">{{ondc:statutoryRequirements.manufacturerOrPackerName}}</span>
  </div>
  <div itemprop="nutrition" itemscope itemtype="https://schema.org/NutritionInformation">
    <meta itemprop="calories" content="{{ondc:statutoryRequirements.nutritionalInfo}}" />
  </div>
  <div itemprop="returnPolicy" itemscope itemtype="https://schema.org/MerchantReturnPolicy">
    <meta itemprop="returnable" content="{{ondc:returnPolicy.returnable}}" />
    <meta itemprop="returnTime" content="{{ondc:returnPolicy.returnWindow}}" />
  </div>
</div>
```

#### 2.4.2 Search Engine Optimization
- **Rich Snippets**: Product information with pricing, availability, and policies
- **Structured Data**: Clear product categorization and dietary information
- **Local SEO**: Location-based availability and service areas

#### 2.4.3 Semantic Web Compliance
- **Schema.org Standards**: Uses recognized semantic web entities
- **Interoperability**: Better compatibility with other systems and tools
- **Future-Proof**: Automatically benefits from schema.org updates

---

## 3. ONDC Core Schema Design

### 3.1 ReturnPolicy.jsonld
**Extends**: `schema:MerchantReturnPolicy`
**Purpose**: Standardized return and cancellation policies for all ONDC domains

**Properties**:
- `ondc:returnable` (schema:Boolean) - Whether item can be returned
- `ondc:cancellable` (schema:Boolean) - Whether order can be cancelled
- `ondc:returnWindow` (schema:Duration) - Return time window
- `ondc:sellerPickupReturn` (schema:Boolean) - Seller pickup service

### 3.2 ShippingInfo.jsonld
**Extends**: `schema:ShippingInfo`
**Purpose**: Shipping and delivery information for all ONDC domains

**Properties**:
- `ondc:timeToShip` (schema:Duration) - Time required to ship
- `ondc:deliveryMethods` (schema:DeliveryMethod[]) - Available delivery methods
- `ondc:shippingZones` (beckn:ShippingZone[]) - Shipping zone coverage

### 3.3 PaymentMethods.jsonld
**Extends**: `schema:PaymentMethod`
**Purpose**: Payment method definitions for all ONDC domains

**Properties**:
- `ondc:availableOnCod` (schema:Boolean) - Cash on delivery availability
- `ondc:onlinePayment` (schema:Boolean) - Online payment availability
- `ondc:digitalWallet` (schema:Boolean) - Digital wallet support
- `ondc:upiPayment` (schema:Boolean) - UPI payment support

### 3.4 ContactPoint.jsonld
**Extends**: `schema:ContactPoint`
**Purpose**: Consumer care contact information for all ONDC domains

**Properties**:
- `ondc:contactType` (schema:Text) - Type of contact (customer service, support)
- `ondc:availableLanguage` (schema:Text) - Languages supported
- `ondc:availableHours` (schema:Time) - Service hours
- `ondc:responseTime` (schema:Duration) - Expected response time

### 3.5 StatutoryRequirements.jsonld
**Extends**: `schema:Product`
**Purpose**: Compliance and statutory data for all ONDC domains

**Properties**:
- `ondc:fssaiLicense` (schema:Text) - FSSAI license number
- `ondc:nutritionalInfo` (schema:NutritionInformation) - Nutritional facts
- `ondc:additivesInfo` (schema:Text) - Food additives information
- `ondc:manufactureDate` (schema:Date) - Manufacture date
- `ondc:expiryDate` (schema:Date) - Expiry date
- `ondc:netQuantity` (schema:QuantitativeValue) - Net quantity

### 3.6 DietaryCategory.jsonld
**Extends**: `schema:Enumeration`
**Purpose**: Standardized dietary preference categories for all food-related ONDC domains

**Values**:
- `vegetarian` - Plant-based foods only
- `vegan` - No animal products or by-products
- `meat-products` - Contains meat, fish, poultry
- `gluten-free` - No gluten-containing ingredients
- `dairy-free` - No dairy products
- `nut-free` - No nuts or nut derivatives
- `halal` - Meets Islamic dietary laws
- `kosher` - Meets Jewish dietary laws
- `organic` - Certified organic ingredients
- `non-organic` - Contains non-organic ingredients

---

## 4. Implementation Benefits

### 4.1 Schema.org Compliance
- **Standard Entities**: Uses recognized semantic web entities
- **Rich Data**: Comprehensive product information for search engines
- **Accessibility**: Better support for assistive technologies

### 4.2 Modular Architecture
- **Reusable Components**: ONDC core schemas for common functionality
- **Domain Customization**: Grocery-specific extensions while maintaining consistency
- **Clear Separation**: Core functionality vs. domain-specific features

### 4.3 Better Maintainability
- **Centralized Logic**: Common ONDC functionality in core schemas
- **Standardized Extensions**: Consistent approach across different domains
- **Easier Validation**: Clear schema structure for testing and validation

### 4.4 Enhanced Flexibility
- **Extensible Properties**: Easy to add new ONDC-specific features
- **Schema Evolution**: Backward compatibility while adding new capabilities
- **Domain Adaptation**: Framework for other ONDC domains (electronics, services, etc.)


