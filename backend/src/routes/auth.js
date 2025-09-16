
const express = require('express');
const { register, login, sendOtp } = require('../controllers/authController');

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new employee
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/sendOtp:
 *   post:
 *     summary: Send OTP to a registered and approved user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.post('/sendOtp', sendOtp);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an employee with phone number and OTP
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.post('/login', login);


module.exports = router;
