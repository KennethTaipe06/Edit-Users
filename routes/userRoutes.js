const express = require('express');
const User = require('../models/user');
const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The user token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const { username, email, firstName, lastName, address, phone } = req.body;

  try {
    const redisClient = req.redisClient;
    const logger = req.logger;
    redisClient.get(id, async (err, result) => {
      if (err) {
        logger.error('Redis error', err);
        return res.status(500).send(err.message);
      }
      if (result !== token) {
        logger.warn(`Invalid token for user ID: ${id}`);
        return res.status(404).json({ message: 'Invalid token' });
      }

      const user = await User.findByIdAndUpdate(id, { username, email, firstName, lastName, address, phone }, { new: true });
      if (!user) {
        logger.warn(`User not found: ${id}`);
        return res.status(404).json({ message: 'User not found' });
      }
      logger.info(`User updated: ${id}`);
      res.json({ message: 'Usuario actualizado correctamente' });
    });
  } catch (error) {
    req.logger.error('Error updating user', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
