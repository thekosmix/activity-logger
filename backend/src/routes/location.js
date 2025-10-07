
const express = require('express');
const {
  updateLocation,
  getLocation,
} = require('../controllers/locationController');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Location
 *   description: Location tracking
 */

/**
 * @swagger
 * /api/location:
 *   post:
 *     summary: Update user's location
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, updateLocation);

/**
 * @swagger
 * /api/location/{userId}:
 *   get:
 *     summary: Get user's location data
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 */
router.get('/:userId', authenticateToken, getLocation);


module.exports = router;
