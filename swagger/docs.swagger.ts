/**
 *  @swagger
 *  tags:
 *    name: Document
 *    description: API to manage Document Data.
 */

/**
 * @swagger
 * /docs/all:
 *   get:
 *     summary: Read all of document data
 *     tags:
 *       - Document
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to get all document data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocumentPreview'
 *       500:
 *         description: Internal Server Error.
 *
 * /docs/{documentId}:
 *   get:
 *     summary: Read one of document data of user
 *     tags:
 *       - Document
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *       - name: documentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the document to read
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to get the document data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocumentMessage'
 *       500:
 *         description: Internal Server Error.
 *
 * /docs/create:
 *   post:
 *     summary: Create new document data
 *     tags:
 *       - Document
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberingId:
 *                 type: string
 *                 example: "1-1"
 *     responses:
 *       200:
 *         description: Success to get the chatroom data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *       500:
 *         description: Internal Server Error.
 *
 * /docs/delete/{documentId}:
 *   delete:
 *     summary: Delete one of document data of user
 *     tags:
 *       - Document
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *       - name: documentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the document to read
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Success to delete the document data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: sucess
 *       500:
 *         description: Internal Server Error.
 */
