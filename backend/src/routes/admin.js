
const express = require('express');
const { getEmployees, approveEmployee } = require('../controllers/adminController');

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 */
router.get('/employees', getEmployees);

/**
 * @swagger
 * /api/admin/approve:
 *   post:
 *     summary: Approve or reject an employee
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               is_approved:
 *                 type: boolean
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
router.post('/approve', approveEmployee);


module.exports = router;
