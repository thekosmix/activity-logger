
const express = require('express');
const {
  getActivityFeed,
  getActivityDetail,
  createActivity,
  addComment,
} = require('../controllers/activityController');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Activity management
 */

/**
 * @swagger
 * /api/activities/feed:
 *   get:
 *     summary: Get the activity feed (paginated)
 *     tags: [Activities]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 */
router.get('/feed', authenticateToken, getActivityFeed);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               media_url:
 *                 type: string
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
router.post('/', authenticateToken, createActivity);

/**
 * @swagger
 * /api/activities/{activityId}/comments:
 *   post:
 *     summary: Add a comment to an activity
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: activityId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The activity ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
/**\n * @swagger\n * /api/activities/{activityId}:\n *   get:\n *     summary: Get activity details with comments\n *     tags: [Activities]\n *     parameters:\n *       - in: path\n *         name: activityId\n *         schema:\n *           type: integer\n *         required: true\n *         description: The activity ID\n *     responses:\n *       200:\n *         description: Activity details with comments\n *         content:\n *           application/json:\n *             schema:\n *               type: object\n *               properties:\n *                 activity:\n *                   $ref: '#/components/schemas/Activity'\n *                 comments:\n *                   type: array\n *                   items:\n *                     $ref: '#/components/schemas/Comment'\n *       400:\n *         description: Bad request\n *       500:\n *         description: Server error\n */
router.get('/:activityId', authenticateToken, getActivityDetail);

router.post('/:activityId/comments', authenticateToken, addComment);


module.exports = router;
