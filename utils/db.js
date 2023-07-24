const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const db = this.client.db();
    const collection = db.collection('users');
    const count = await collection.countDocuments();
    return count;
  }

  async nbFiles() {
    const db = this.client.db();
    const collection = db.collection('files');
    const count = await collection.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
