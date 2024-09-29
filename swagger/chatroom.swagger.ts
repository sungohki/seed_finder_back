/**
 *  @swagger
 *  tags:
 *    name: Business
 *    description: API to manage Business Data.
 */

/**
 *  @swagger
 *  /chatroom/all:
 *   get:
 *     summary: Read all of chatroom data of user
 *     tags:
 *       - Chatroom
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to get all chatroom data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *                 items:
 *                   $ref: '#/components/schemas/ChatroomPreview'
 *       500:
 *         description: Internal Server Error.
 *  /chatroom/{chatroomId}:
 *   get:
 *     summary: Read one of chatroom data of user
 *     tags:
 *       - Chatroom
 *     parameters:
 *       - name: chatroomId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chatroom to read
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to get the chatroom data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *                 items:
 *                   $ref: '#/components/schemas/ChatLog'
 *       500:
 *         description: Internal Server Error.
 *  /chatroom/create:
 *   get:
 *     summary: Create new chatroom data of user
 *     tags:
 *       - Chatroom
 *     parameters:
 *       - name: chatroomId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chatroom to read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberingId:
 *                 type: string
 *                 example: "1-2"
 *     responses:
 *       200:
 *         description: Success to get the chatroom data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *                 properties:
 *                   affectedRows:
 *                     type: int
 *                     example: 1
 *                     description: Number of db's affected row
 *       500:
 *         description: Internal Server Error.
 */
