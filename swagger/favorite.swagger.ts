/**
 *  @swagger
 *  tags:
 *    name: Favorite
 *    description: API to manage User's personal Favorite Business Datas.
 */

/**
 * @swagger
 * /favorite/add/{businessId}:
 *   create:
 *     summary: Create user-business reltation data
 *     security:
 *       - Authorization: []
 *     tags:
 *       - Board
 *     parameters:
 *       - in: header
 *       name: Authorization
 *       schema:
 *         type: string
 *       description: 우측 상단 좌물쇠 버튼을 눌러 값을 넣은 후 테스트 해주세요! 아래에는 값을 넣지 말고 테스트 해주세요!!
 *     tags: [Favorite]
 *     requestBody:
 *       required: false
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
