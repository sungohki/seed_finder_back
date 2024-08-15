import express from 'express';
import {
  userLoginHandler,
  userJoinHandler,
  userSurveyInfoHandler,
  userUpdateInfoHandler,
} from '../controller/userController';

const router = express.Router();
router.use(express.json());

// Create user login token
router.post('/login', userLoginHandler);
// Create user account
router.post('/join', userJoinHandler);
// Create user info
router.post('/info', userSurveyInfoHandler);
// Update user info
router.put('/info', userUpdateInfoHandler);

export const userRouter = router;

/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: API to manage User Data.
 */

/**
 * @swagger
 * /join:
 *   post:
 *     summary: Create new user data
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: Kim
 *               userId:
 *                 type: string
 *                 example: exUser12
 *               userPw:
 *                 type: string
 *                 example: aaaa1234
 *               userContact:
 *                 type: string
 *                 example: 010-1234-1234
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 * /login:
 *   post:
 *     summary: Create new login token for user who tried login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user123
 *               userPw:
 *                 type: string
 *                 example: aaaa1234
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 * /info:
 *   post:
 *     summary: Create new information of user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update information of user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
