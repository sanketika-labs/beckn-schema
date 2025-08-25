# Beckn Discovery API

A simple Node.js API implementation based on the Beckn Protocol specification with JSONPath filtering support.

## Installation

```bash
npm install
```

## Usage

```bash
npm start
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

- Filter by price: `[?(@['electronic:price']['schema:price'] <= 1000)]`
- Filter by brand: `[?(@['electronic:brand']['schema:name'] == 'Premium Tech')]`
- Filter by rating: `[?(@['beckn:rating']['schema:ratingValue'] >= 4.5)]`
- Combined filters: `[?(@['electronic:price']['schema:price'] <= 2000 && @['beckn:rating']['schema:ratingValue'] >= 4.0)]`