const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { FOLDER_PATH } = process.env;

const FilesController = {
  async postUpload(req, res) {
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, parentId, isPublic, data } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId) {
      const parentFile = await dbClient.getFileById(parentId);

      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const file = {
      userId,
      name,
      type,
      isPublic: !!isPublic,
      parentId: parentId || 0,
    };

    if (type === 'folder') {
      const newFile = await dbClient.createFile(file);
      return res.status(201).json(newFile);
    } else {
      const storingFolderPath = FOLDER_PATH || '/tmp/files_manager';
      const localPath = path.join(storingFolderPath, uuidv4());

      if (!fs.existsSync(storingFolderPath)) {
        fs.mkdirSync(storingFolderPath, { recursive: true });
      }

      const fileData = Buffer.from(data, 'base64');

      fs.writeFileSync(localPath, fileData);

      file.localPath = localPath;
      const newFile = await dbClient.createFile(file);
      return res.status(201).json(newFile);
    }
  },
};

module.exports = FilesController;
