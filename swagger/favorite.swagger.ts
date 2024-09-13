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
//  *     security:
//  *       - Authorization : []
 *     tags:
 *       - Favorite
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to add to favorites
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
 *         description: Success to create 'Favorite' entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       204:
 *         description: Fail to create entity 'Favorite' (Data already exists)
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       400:
 *         description: Bad Request (There is a grammatical error or a server error)
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: unknown
 *                   example: e
 *                   description: Information for error status
 */

/**
 * @swagger
 *
 * /favorite/delete/{businessId}:
 *   delete:
 *     summary: Create user-business reltation data
 *     tags:
 *       - Favorite
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the business to add to favorites
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
 *         description: Success to delete 'Favorite' entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       204:
 *         description: Fail to delete entity 'Favorite' (Data already erased)
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 0
 *                   description: Number of db's affected row
 *       400:
 *         description: Bad Request (There is a grammatical error or a server error)
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: unknown
 *                   example: e
 *                   description: Information for error status
 */

/**
 * @swagger
 * /favorite/list:
 *   get:
 *     summary: Read a user's personal user-business reltation data
 *     security:
 *       - Authorization : []
 *     tags:
 *       - Favorite
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *     tags: [Favorite]
 *     requestBody:
 *       description: No body content is required.
 *       content: {}
 *     responses:
 *       200:
 *         description: Success to read personal 'Favorite' table entities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       400:
 *         description: Bad Request to db connection
 *
 */
