const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beckn_catalog';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../sample-data');

// Item schema for MongoDB
const itemSchema = new mongoose.Schema({}, { strict: false, collection: 'items' });
itemSchema.index({
  'beckn:descriptor.schema:name': 'text',
  'beckn:descriptor.beckn:shortDesc': 'text', 
  'beckn:descriptor.beckn:longDesc': 'text',
  '@type': 'text'
}); // Text index for search
const Item = mongoose.model('Item', itemSchema);

const loadDataToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Item.deleteMany({});
    console.log('Cleared existing items');

    const dataDir = DATA_DIR;
    console.log(`Loading data from: ${dataDir}`);
    if (!fs.existsSync(dataDir)) {
      throw new Error(`Data directory does not exist: ${dataDir}`);
    }
    
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.jsonld'));
    
    let totalItems = 0;
    
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const items = data['beckn:items'] || [];
      
      if (items.length > 0) {
        await Item.insertMany(items);
        console.log(`Loaded ${items.length} items from ${file}`);
        totalItems += items.length;
      }
    }
    
    console.log(`Total loaded: ${totalItems} items`);
    await mongoose.disconnect();
    console.log('Data loading completed');
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
};

loadDataToMongo();