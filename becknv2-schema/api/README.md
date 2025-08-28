# Beckn Discovery API

A Node.js API implementation based on the Beckn Protocol specification with JSONPath filtering support and MongoDB integration.

## Installation

```bash
npm install
```

## Data Sources

The API supports two data sources:

### 1. Memory Mode (Default)
Loads data from JSON-LD files in `../sample-data/`

```bash
npm start
# or
DATA_SOURCE=memory node server.js
```

### 2. MongoDB Mode
Uses MongoDB for better performance and scalability

**Setup MongoDB:**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Import data to MongoDB
node import-data.js

# Start server with MongoDB
DATA_SOURCE=mongo node server.js
```

**Environment Variables:**
```bash
DATA_SOURCE=mongo                                    # Use MongoDB
MONGO_URI=mongodb://localhost:27017/beckn_catalog   # MongoDB connection
PORT=8080                                           # Server port
```

The server will start on port 8080.

## API Endpoints

### POST /beckn/v1/discover

Discover items with text search and JSONPath filters.

**Example Request:**
```json
{
  "context": {
    "ts": "2024-04-10T16:10:50+05:30",
    "msgid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "traceid": "4a7f14c3-d61e-4d4f-be78-181834eeff6d",
    "network_id": "bap.net/electronics",
    "schema_context": [
      "https://example.org/schema/items/v1/ElectronicItem/schema-settings.json"
    ]
  },
  "text_search": "gaming laptop",
  "filters": "[?(@['electronic:price']['schema:price'] <= 2000 && @['electronic:brand']['schema:name'] == 'Premium Tech')]",
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

### GET /beckn/v1/discover/browser-search

Browser-friendly search with URL parameters.

**Example:**
```
GET /beckn/v1/discover/browser-search?filters=%5B%3F%28%40%5B%27electronic%3Aprice%27%5D%5B%27schema%3Aprice%27%5D%20%3C%3D%202000%29%5D
```

## JSONPath Filter Examples

**Electronics:**
- Filter by price: `[?(@['beckn:offer']['schema:price'] <= 1000)]`
- Filter by brand: `[?(@['electronic:brand']['schema:name'] == 'Apple')]`
- Filter by rating: `[?(@['beckn:rating']['schema:ratingValue'] >= 4.5)]`
- High-end smartphones: `[?(@['@type'] == 'beckn:SmartphoneItem' && @['beckn:offer']['schema:price'] > 1000)]`

**Groceries:**
- Filter by price: `[?(@['grocery:price']['schema:price'] < 50)]`
- Fresh produce: `[?(@['beckn:category']['schema:codeValue'] == 'FRESH_VEGETABLES')]`
- Expiring soon: `[?(@['grocery:expiryDate'] <= '2025-02-10')]`

**Combined filters:**
- `[?(@['beckn:offer']['schema:price'] <= 2000 && @['beckn:rating']['schema:ratingValue'] >= 4.0)]`
- `[?(@['grocery:price']['schema:price'] < 100 && @['grocery:brand']['schema:name'] == 'Amul')]`

## Performance Notes

- **Memory Mode**: Good for development and small datasets
- **MongoDB Mode**: Recommended for production with large datasets
- **Text Search**: MongoDB uses indexed full-text search vs regex in memory mode
- **Filtering**: MongoDB applies filters at database level for better performance