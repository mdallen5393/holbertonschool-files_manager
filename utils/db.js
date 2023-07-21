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
    // if (!this.db) {
    //   await this.connect();
    // }

    // try {
    //   const serverStatus = await this.db.command({ serverStatus: 1 });
    //   return serverStatus.ok === 1;
    // } catch (err) {
    //   console.error(err);
    //   return false;
    // }
    return false
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
