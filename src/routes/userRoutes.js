const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { userSearchController } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by email
 *     description: Find users by email substring for payment recipient lookup.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email address or partial email to search for.
 *     responses:
 *       200:
 *         description: Matching users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Missing or invalid email query parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', authMiddleware, userSearchController);

module.exports = router;
