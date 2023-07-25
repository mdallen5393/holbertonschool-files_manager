const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const AppController = {
  async getStatus(req, res) {
    const redisAlive = await redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    res.status(200).json({
      redis: redisAlive,
      db: dbAlive,
    });
  },

  async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      res.status(200).json({
        users: usersCount,
        files: filesCount,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving statistics',
      });
    }
  },
};

module.exports = AppController;
