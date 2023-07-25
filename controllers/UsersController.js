const sha1 = require('sha1');
const dbClient = require('../utils/db');

const UsersController = {
  async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const user = await dbClient.getUserByEmail(email);
      if (user) {
        return res.status(400).json({ error: 'Already exists' });
      }

      const hashedPwd = sha1(password);
      const newUser = await dbClient.createUser(email, hashedPwd);

      res.status(201).json({ email: newUser.email, id: newUser._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = UsersController;
