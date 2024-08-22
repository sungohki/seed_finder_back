/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: API to manage User Data.
 */

/**
 * @swagger
 * /user/join:
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
 *               userEmail:
 *                 type: string
 *                 example: ex1@naver.com
 *               userName:
 *                 type: string
 *                 example: kim
 *               userPw:
 *                 type: string
 *                 example: aa1234
 *               userContact:
 *                 type: string
 *                 example: 010-1234-1234
 *     responses:
 *       201:
 *         description: Create new user success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 1
 *                   description: Number of db's affected row
 *                 insertId:
 *                   type: int
 *                   example: 4
 *                   description: Id of new user
 *       404:
 *         description: Not Found userId or userPw
 * /user/login:
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
 *                 example: ex1@naver.com
 *               userPw:
 *                 type: string
 *                 example: aa1234
 *     responses:
 *       200:
 *         description: Create new access&refresh token for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: int
 *                   example: 2
 *                   description: Id of user
 *                 accessToken:
 *                   type: string
 *                   example: asdf.asdf.asdf
 *                   description: Access token of user
 *                 refreshToken:
 *                   type: string
 *                   example: asdf.asdf.qwer
 *                   description: Refresh token of user
 *       401:
 *         description: Unauthorized (Wrong id/pw or Not found user)
 *       500:
 *         description: INTERNAL_SERVER_ERROR (No Private Key in .env file)
 * /user/info:
 *   post:
 *     summary: Create new information of user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessCategory:
 *                 type: Array<string>
 *                 example: ["글로벌", "사업화"]
 *                 description: Data for User & Classification of Business
 *               businessRegion:
 *                 type: Array<string>
 *                 example: ["강원", "대구"]
 *                 description: Data for User & Support Region of Business
 *               businessApply:
 *                 type: Array<string>
 *                 example: ["대학", "대학생"]
 *                 description: Data for User & Application Target of Business
 *               businessExperience:
 *                 type: int
 *                 example: 5
 *                 description: Data for User's Experience of Business. If it is 0, user's pre-startup stance will be true. (default false)
 *               businessTargetAge:
 *                 type: int
 *                 example: 25
 *                 description: Data for User's age
 *     responses:
 *       200:
 *         description: Create new business data of user & Update default user info data
 *       401:
 *         description: Unauthorized (Wrong access)
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
 *         description: Update user info
 *       401:
 *         description: Unauthorized
 */
