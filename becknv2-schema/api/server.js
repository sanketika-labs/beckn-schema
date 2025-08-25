const express = require('express');
const jp = require('jsonpath');
const fs = require('fs');
const path = require('path');

// Build type hierarchy dynamically from schema files
const buildTypeHierarchy = () => {
  const hierarchy = {};
  const schemasDir = path.join(__dirname, '../schemas/items');
  
  try {
    const itemDirs = fs.readdirSync(schemasDir);
    itemDirs.forEach(dir => {
      const schemaFile = path.join(schemasDir, dir, 'schema-definition.jsonld');
      if (fs.existsSync(schemaFile)) {
        try {
          const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
          const childType = schema['@id']?.replace('https://becknprotocol.io/schema/', 'beckn:');
          let parentType = schema['rdfs:subClassOf'];
          if (parentType) {
            parentType = parentType.replace('electronic:', 'beckn:').replace('grocery:', 'beckn:').replace('beckn:', 'beckn:');
          }
          
          if (childType && parentType) {
            if (!hierarchy[parentType]) hierarchy[parentType] = [];
            hierarchy[parentType].push(childType);
          }
        } catch (error) {
          console.log(`[DEBUG] Error parsing schema ${dir}: ${error.message}`);
        }
      }
    });
  } catch (error) {
    console.log(`[DEBUG] Error reading schemas directory: ${error.message}`);
  }
  
  return hierarchy;
};

const typeHierarchy = buildTypeHierarchy();
console.log(`[DEBUG] Discovered type hierarchy:`, typeHierarchy);

// Expand parent types to include all subtypes
const expandSchemaTypes = (schemaTypes) => {
  const expandedTypes = new Set(schemaTypes);
  schemaTypes.forEach(type => {
    if (typeHierarchy[type]) {
      typeHierarchy[type].forEach(subtype => expandedTypes.add(subtype));
    }
  });
  return Array.from(expandedTypes);
};

const app = express();
app.use(express.json());

// Load sample data
const loadData = () => {
  const dataDir = path.join(__dirname, '../sample-data');
  console.log(`[DEBUG] Loading data from: ${dataDir}`);
  
  let allItems = [];
  
  try {
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.jsonld'));
    
    console.log(`[DEBUG] Found JSON-LD files: ${jsonFiles.join(', ')}`);
    
    jsonFiles.forEach(file => {
      try {
        const filePath = path.join(dataDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const items = data['beckn:items'] || [];
        if (items.length > 0) {
          allItems = allItems.concat(items);
          console.log(`[DEBUG] Loaded ${items.length} items from ${file}`);
        }
      } catch (error) {
        console.log(`[DEBUG] Error loading ${file}: ${error.message}`);
      }
    });
    
    console.log(`[DEBUG] Total loaded ${allItems.length} items from JSON-LD files`);
  } catch (error) {
    console.log(`[DEBUG] Error reading data directory: ${error.message}`);
  }
  
  return allItems;
};

// POST /beckn/v1/discover
app.post('/beckn/v1/discover', (req, res) => {
  try {
    const { context, text_search, filters, pagination = { page: 1, limit: 20 } } = req.body;
    console.log(`[DEBUG] POST /discover - text_search: ${text_search}, filters: ${filters}`);
    
    // Validate required context
    if (!context) {
      return res.status(400).json({
        error: { code: 'MISSING_CONTEXT', message: 'Context is required' }
      });
    }

    // Validate required fields in context
    const requiredFields = ['ts', 'msgid', 'traceid', 'network_id', 'schema_context'];
    for (const field of requiredFields) {
      if (!context[field]) {
        return res.status(400).json({
          error: { code: 'MISSING_CONTEXT_FIELD', message: `Context field '${field}' is required` }
        });
      }
    }

    if (!Array.isArray(context.schema_context)) {
      return res.status(400).json({
        error: { code: 'INVALID_SCHEMA_CONTEXT', message: 'schema_context must be an array' }
      });
    }

    // Validate pagination
    if (pagination) {
      if (pagination.page && (pagination.page < 1 || !Number.isInteger(pagination.page))) {
        return res.status(400).json({
          error: { code: 'INVALID_PAGINATION', message: 'Page must be a positive integer' }
        });
      }
      if (pagination.limit && (pagination.limit < 1 || pagination.limit > 100 || !Number.isInteger(pagination.limit))) {
        return res.status(400).json({
          error: { code: 'INVALID_PAGINATION', message: 'Limit must be between 1 and 100' }
        });
      }
    }

    console.log(`[DEBUG] Schema contexts: ${context.schema_context.join(', ')}`);
    console.log(`[DEBUG] Request validation passed - proceeding with data loading`);

    // Validate schema contexts - check for invalid schemas and return 400 immediately
    const validSchemaPatterns = ['SmartphoneItem', 'TelevisionItem', 'ElectronicItem', 'GroceryItem', 'WorkOpportunityItem'];
    
    for (const ctx of context.schema_context) {
      console.log(`[DEBUG] Validating schema context: ${ctx}`);
      
      if (ctx === 'https://becknprotocol.io/schema/context.jsonld') {
        continue; // Base context is always valid
      }
      
      const hasValidItemType = validSchemaPatterns.some(pattern => ctx.includes(pattern));
      
      if (!hasValidItemType) {
        console.log(`[DEBUG] Invalid schema context: ${ctx}`);
        return res.status(400).json({
          error: {
            code: 'INVALID_SCHEMA_CONTEXT',
            message: `Invalid schema context: ${ctx}`
          }
        });
      }
    }

    let items = loadData();
    
    // Filter by schema context (item type) with hierarchy support
    const schemaTypes = context.schema_context.map(ctx => {
      console.log(`[DEBUG] Processing schema context: ${ctx}`);
      if (ctx.includes('SmartphoneItem')) return 'beckn:SmartphoneItem';
      if (ctx.includes('TelevisionItem')) return 'beckn:TelevisionItem';
      if (ctx.includes('ElectronicItem')) return 'beckn:ElectronicItem';
      if (ctx.includes('GroceryItem')) return 'beckn:GroceryItem';
      if (ctx.includes('WorkOpportunityItem')) return 'beckn:WorkOpportunityItem';
      console.log(`[DEBUG] No match found for: ${ctx}`);
      return null;
    }).filter(Boolean);
    
    console.log(`[DEBUG] Mapped schema types: ${schemaTypes.join(', ')}`);
    
    if (schemaTypes.length > 0) {
      const beforeCount = items.length;
      const expandedTypes = expandSchemaTypes(schemaTypes);
      items = items.filter(item => expandedTypes.includes(item['@type']));
      console.log(`[DEBUG] Schema type filter (${schemaTypes.join(', ')} -> ${expandedTypes.join(', ')}): ${beforeCount} -> ${items.length} items`);
    } else {
      console.log(`[DEBUG] No schema types matched - returning all ${items.length} items`);
    }
    
    // Apply text search
    if (text_search) {
      const searchTerm = text_search.toLowerCase();
      const wordRegex = new RegExp(`\\b${searchTerm}\\b`, 'i');
      const beforeCount = items.length;
      items = items.filter(item => 
        wordRegex.test(item['beckn:descriptor']?.['schema:name'] || '') ||
        wordRegex.test(item['beckn:descriptor']?.['beckn:shortDesc'] || '') ||
        wordRegex.test(item['beckn:descriptor']?.['beckn:longDesc'] || '') ||
        wordRegex.test(item['@type'] || '')
      );
      console.log(`[DEBUG] Text search '${searchTerm}': ${beforeCount} -> ${items.length} items`);
    }

    // Apply JSONPath filters
    if (filters) {
      try {
        const beforeCount = items.length;
        const query = `$.items${filters.startsWith('$') ? filters.substring(1) : filters}`;
        items = jp.query({ items }, query);
        console.log(`[DEBUG] JSONPath filter '${query}': ${beforeCount} -> ${items.length} items`);
      } catch (error) {
        console.log(`[DEBUG] Invalid JSONPath filter: ${filters} - ${error.message}`);
        return res.status(400).json({
          error: { 
            code: 'INVALID_FILTER', 
            message: 'Invalid JSONPath filter expression',
            details: {
              filter: filters,
              error: error.message
            }
          }
        });
      }
    }

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedItems = items.slice(startIndex, startIndex + pagination.limit);
    console.log(`[DEBUG] Pagination: page ${pagination.page}, limit ${pagination.limit}, showing ${paginatedItems.length} of ${items.length} items`);

    // Generate dynamic catalog descriptor based on item types
    const itemTypes = [...new Set(items.map(item => item['@type']))];
    let catalogName = "Beckn Catalog";
    let catalogDesc = "Items catalog";
    
    if (itemTypes.includes('beckn:SmartphoneItem') || itemTypes.includes('beckn:ElectronicItem') || itemTypes.includes('beckn:TelevisionItem')) {
      catalogName = "Electronic Catalog";
      catalogDesc = "Latest elecronics, smartphones and telivisons";
    } else if (itemTypes.includes('beckn:GroceryItem')) {
      catalogName = "Grocery Catalog";
      catalogDesc = "Fresh groceries and organic products";
    }

    const response = {
      context: {
        ts: new Date().toISOString(),
        msgid: context.msgid,
        traceid: context.traceid,
        network_id: context.network_id,
        schema_context: context.schema_context
      },
      catalogs: [{
        "@type": "beckn:Catalog",
        "beckn:descriptor": {
          "@type": "beckn:Descriptor",
          "schema:name": catalogName,
          "beckn:shortDesc": catalogDesc
        },
        "beckn:providerId": "tech-store-001",
        "beckn:timePeriod": {
          "@type": "beckn:TimePeriod",
          "schema:startDate": "2025-01-27",
          "schema:endDate": "2026-12-31"
        },
        "beckn:items": paginatedItems.map(item => ({
          ...item,
          "@context": context.schema_context[0] || "https://becknprotocol.io/schema/context.jsonld"
        }))
      }]
    };

    res.json(response);
  } catch (error) {
    console.error(`[ERROR] Internal server error: ${error.message}`);
    res.status(500).json({
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'An unexpected error occurred while processing the request'
      }
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[INFO] Beckn API server running on port ${PORT}`);
  console.log(`[INFO] Available endpoints:`);
  console.log(`[INFO] - POST /beckn/v1/discover`);
  console.log(`[INFO] - GET /beckn/v1/discover/browser-search`);
});
