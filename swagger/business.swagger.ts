/**
 *  @swagger
 *  tags:
 *    name: Business
 *    description: API to manage Business Data.
 */

/**
 * @swagger
 * /business/all:
 *   get:
 *     summary: Read all of business data
 *     tags: [Business]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to get all business data
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
 *         description: No results
 *       400:
 *         description: Bad Request to db connection
 *
 * /business/all?page=n&limit=n:
 *   get:
 *     summary: Read all of business data
 *     tags: [Business]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to get all business data
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
 *         description: No results
 *       400:
 *         description: Bad Request to db connection
 *
 * /business/partial:
 *
 * /business/:businessid:
 *
 */
