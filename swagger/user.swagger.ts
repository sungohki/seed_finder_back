/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: API to manage User Data.
 */

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete the data of user
 *     tags:
 *       - User
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
 *         description: Success to delete entity
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
 *         description: Fail to delete entity. (No data to delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: int
 *                   example: 0
 *                   description: Number of db's affected row
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: unknown
 *                   example: e
 *                   description: Information for error status
 * /user/info:
 *   post:
 *     summary: Create new information of user
 *     tags:
 *       - User
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: Enter the token by pressing the lock at the top right. (Input field below is a dummy.)
 *     requestBody:
 *       description: No body content is required.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessCategory:
 *                 type: Array<string>
 *                 example: ["글로벌", "사업화", "인력", "정책자금"]
 *                 description: Data for User & Classification of Business
 *               businessRegion:
 *                 type: Array<string>
 *                 example: ["전국", "서울", "강원", "경기", "부산"]
 *                 description: Data for User & Support Region of Business
 *               businessApply:
 *                 type: Array<string>
 *                 example: ["대학", "대학생", "1인 창조기업", "일반인"]
 *                 description: Data for User & Application Target of Business
 *               businessExperience:
 *                 type: int
 *                 example: 5
 *                 description: Data for User's Experience of Business. If it is 0, user's pre-startup stance will be true. (default false)
 *               businessTargetAge:
 *                 type: int
 *                 example: 20
 *                 description: Data for User's age
 *     responses:
 *       200:
 *         description: Create new business data of user & Update default user info data
 *       401:
 *         description: Unauthorized (Wrong access)
 */
