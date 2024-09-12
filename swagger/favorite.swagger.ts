/**
 *  @swagger
 *  tags:
 *    name: Favorite
 *    description: API to manage User's personal Favorite Business Datas.
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */

/**
 * @swagger
 * /favorite/add/{businessId}:
 *   post:
 *     summary: Create user-business reltation data
 *     tags: [Favorite]
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to add to favorites
 *     requestBody:
 *       description: No body content is required.
 *       content: {}
 *     responses:
 *       200:
 *         description: Success to create user-business data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       400:
 *         description: Bad Request
 *     security:
 *       - bearerAuth: []
 *
 * /favorite/delete/{businessId}:
 *   delete:
 *     summary: Create user-business reltation data
 *     tags: [Favorite]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to delete user-business data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       400:
 *         description: Bad Request to db connection
 *
 * /favorite/list:
 *   get:
 *     summary: Read a user's personal user-business reltation data
 *     tags: [Favorite]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to read personal user-business data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       400:
 *         description: Bad Request to db connection
 *
 */
