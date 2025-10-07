const express = require('express');
const router = express.Router();
const { logWork } = require('../controllers/workLogController');
const { authenticateToken } = require('../utils/auth');

/**
 * @swagger
 * /api/worklog:
 *   post:
 *     summary: Clock in or out for the day
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_clock_in:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Success
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, logWork);

module.exports = router;