const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db();
    } catch (err) {
      console.error(err);
    }
  }

  async isAlive() {
    return this.db !== null;
  }

  async nbUsers() {
    if (!this.db) {
      await this.connect();
    }

    const collection = this.db.collection('users');
    const count = await collection.countDocuments();
    return count;
  }

  async nbFiles() {
    if (!this.db) {
      await this.connect();
    }

    const collection = this.db.collection('files');
    const count = await collection.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
