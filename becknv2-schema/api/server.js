const express = require('express');
const jp = require('jsonpath');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Load sample data
const loadData = () => {
  const dataDir = path.join(__dirname, '../becknv2-schema/data');
  console.log(`[DEBUG] Loading data from: ${dataDir}`);
  const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog-fresh-grocery.jsonld'), 'utf8'));
  const items = catalog['beckn:items'] || [];
  console.log(`[DEBUG] Loaded ${items.length} items`);
  return items;
};

// POST /beckn/v1/discover
app.post('/beckn/v1/discover', (req, res) => {
  try {
    const { context, text_search, filters, pagination = { page: 1, limit: 20 } } = req.body;
    console.log(`[DEBUG] POST /discover - text_search: ${text_search}, filters: ${filters}`);
    
    if (!context) {
      console.log(`[DEBUG] Missing context in request`);
      return res.status(400).json({
        error: { code: 'MISSING_CONTEXT', message: 'Context is required' }
      });
    }

    if (!context.schema_context || !Array.isArray(context.schema_context)) {
      console.log(`[DEBUG] Missing or invalid schema_context in request`);
      return res.status(400).json({
        error: { code: 'MISSING_SCHEMA_CONTEXT', message: 'Context must include schema_context array' }
      });
    }

    console.log(`[DEBUG] Schema contexts: ${context.schema_context.join(', ')}`);

    let items = loadData();
    
    // Filter by schema context (item type)
    const schemaTypes = context.schema_context.map(ctx => {
      if (ctx.includes('ElectronicItem')) return 'beckn:ElectronicItem';
      if (ctx.includes('GroceryItem')) return 'beckn:GroceryItem';
      return null;
    }).filter(Boolean);
    
    if (schemaTypes.length > 0) {
      const beforeCount = items.length;
      items = items.filter(item => schemaTypes.includes(item['@type']));
      console.log(`[DEBUG] Schema type filter (${schemaTypes.join(', ')}): ${beforeCount} -> ${items.length} items`);
    }
    
    // Apply text search
    if (text_search) {
      const searchTerm = text_search.toLowerCase();
      const beforeCount = items.length;
      items = items.filter(item => 
        item['schema:name']?.toLowerCase().includes(searchTerm) ||
        item['beckn:descriptor']?.['beckn:shortDesc']?.toLowerCase().includes(searchTerm) ||
        item['beckn:descriptor']?.['beckn:longDesc']?.toLowerCase().includes(searchTerm) ||
        item['electronic:brand']?.['schema:name']?.toLowerCase().includes(searchTerm) ||
        item['grocery:brand']?.['schema:name']?.toLowerCase().includes(searchTerm) ||
        item['beckn:category']?.['schema:name']?.toLowerCase().includes(searchTerm) ||
        item['@type']?.toLowerCase().includes(searchTerm)
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
          error: { code: 'INVALID_FILTER', message: 'Invalid JSONPath filter expression' }
        });
      }
    }

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedItems = items.slice(startIndex, startIndex + pagination.limit);
    console.log(`[DEBUG] Pagination: page ${pagination.page}, limit ${pagination.limit}, showing ${paginatedItems.length} of ${items.length} items`);

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
          "schema:name": "TechMart Electronics Catalog",
          "beckn:shortDesc": "Latest electronics and gadgets"
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
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

// GET /beckn/v1/discover/browser-search
// app.get('/beckn/v1/discover/browser-search', (req, res) => {
//   try {
//     const { filters, pagination } = req.query;
//     const accept = req.headers.accept || 'text/html';
//     console.log(`[DEBUG] GET /browser-search - filters: ${filters}, accept: ${accept}`);
    
//     let items = loadData();
    
//     // Apply JSONPath filters if provided
//     if (filters) {
//       try {
//         const decodedFilters = decodeURIComponent(filters);
//         const beforeCount = items.length;
//         const query = `$.items${decodedFilters.startsWith('$') ? decodedFilters.substring(1) : decodedFilters}`;
//         items = jp.query({ items }, query);
//         console.log(`[DEBUG] Browser JSONPath filter '${query}': ${beforeCount} -> ${items.length} items`);
//       } catch (error) {
//         console.log(`[DEBUG] Invalid browser JSONPath filter: ${filters} - ${error.message}`);
//         return res.status(400).json({
//           error: { code: 'INVALID_FILTER', message: 'Invalid JSONPath filter expression' }
//         });
//       }
//     }

//     // Apply pagination if provided
//     if (pagination) {
//       try {
//         const paginationObj = JSON.parse(decodeURIComponent(pagination));
//         const startIndex = (paginationObj.page - 1) * paginationObj.limit;
//         items = items.slice(startIndex, startIndex + paginationObj.limit);
//       } catch (error) {
//         // Ignore pagination errors, use all items
//       }
//     }

//     if (accept.includes('application/json')) {
//       const response = {
//         context: {
//           ts: new Date().toISOString(),
//           network_id: "bap.net/electronics"
//         },
//         catalogs: [{
//           "@type": "beckn:Catalog",
//           "beckn:descriptor": {
//             "@type": "beckn:Descriptor",
//             "schema:name": "TechMart Electronics Catalog",
//             "beckn:shortDesc": "Latest electronics and gadgets"
//           },
//           "beckn:providerId": "tech-store-001",
//           "beckn:items": items
//         }]
//       };
//       return res.json(response);
//     }

//     // Return HTML for browser
//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
//     <title>Beckn Electronics Catalog</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; }
//         .item { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
//         .price { font-weight: bold; color: #007bff; }
//         .rating { color: #ffa500; }
//     </style>
// </head>
// <body>
//     <h1>Electronics Catalog</h1>
//     ${items.map(item => `
//         <div class="item">
//             <h3>${item['schema:name']}</h3>
//             <p>${item['beckn:descriptor']?.['beckn:shortDesc'] || ''}</p>
//             <div class="price">$${item['electronic:price']?.['schema:price']}</div>
//             <div class="rating">Rating: ${item['beckn:rating']?.['schema:ratingValue']} ⭐ (${item['beckn:rating']?.['schema:ratingCount']} reviews)</div>
//             <div>Brand: ${item['electronic:brand']?.['schema:name']}</div>
//         </div>
//     `).join('')}
// </body>
// </html>`;
    
//     res.send(html);
//   } catch (error) {
//     res.status(500).json({
//       error: { code: 'INTERNAL_ERROR', message: error.message }
//     });
//   }
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[INFO] Beckn API server running on port ${PORT}`);
  console.log(`[INFO] Available endpoints:`);
  console.log(`[INFO] - POST /beckn/v1/discover`);
  console.log(`[INFO] - GET /beckn/v1/discover/browser-search`);
});
