/**
 *  @swagger
 *  tags:
 *    name: Favorite
 *    description: API to manage User's personal Favorite Business Datas.
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
 *       - Authoriaztion : []  # JWT 토큰 적용 (이 요청에만 적용)
 */

/**
 * @swagger
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
 */

/**
 * @swagger
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

