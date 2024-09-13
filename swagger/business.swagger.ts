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
 *     tags:
 *       - Business
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
 *                 "datetime":
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BusinessPreview'
 *       500:
 *         description: Internal Server Error.
 *
 * /business/partial:
 *   get:
 *     summary: Read business data to recommend for user
 *     tags:
 *       - Business
 *     parameters:
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
 *         description: Success to get all business data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 "datetime":
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BusinessPreview'
 *       500:
 *         description: Internal Server Error.
 *
 * /business/{businessId}:
 *   get:
 *     summary: Read the detail of the business
 *     tags:
 *       - Business
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
 *         description: Success to get detail of the business data
 *         content:
 *           appliaction/json:
 *             schema:
 *               $ref: '#/components/schemas/BusinessDetail'
 *       500:
 *         description: Internal Server Error.
 */
