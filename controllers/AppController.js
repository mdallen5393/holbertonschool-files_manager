const DBClient = require('../utils/db');
const RedisClient = require('../utils/redis');

const db = new DBClient();
const redis = new RedisClient();

const getStatus = async (req, res) => {
  const isRedisAlive = redis.isAlive();
  const isDBAlive = db.isAlive();

  res.status(200).json({
    redis: isRedisAlive,
    db: isDBAlive
  });
};

const getStats = async (req, res) => {
  try {
    const usersCount = await db.nbUsers();
    const filesCount = await db.nbFiles();

    res.status(200).json({
      users: usersCount,
      files: filesCount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving statistics'
    });
  }
};