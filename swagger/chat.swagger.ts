/**
 *  @swagger
 *  tags:
 *    name: Chat
 *    description: API to manage Chat Data.
 */

/**
 * @swagger
 * /chat/{chatroomId}:
 *   post:
 *     summary: Create one chatting
 *     tags:
 *       - Chat
 *     parameters:
 *       - name: chatroomId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chatroom to create new chat
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *     requestBody:
 *       description: No body content is required.
 *       content: {}
 *     responses:
 *       200:
 *         description: Success to get detail of the business data
 *         content:
 *           appliaction/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       500:
 *         description: Internal Server Error.
 */
