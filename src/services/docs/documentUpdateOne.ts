// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { accessTokenVerify, queryErrorChecker } from '../common';
import { generateMessage } from '.';

export const documentUpdateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;

  try {
    //TODO: 엑세스 토큰 로직 필요()
    var { messageNum } = req.params;
    const { message } = req.body();

    //TODO: message 길이 오류 처리 필요
    res.status(StatusCodes.OK).end();

    //chat gpt api
    const generatedMessage = await generateMessage(
      parseInt(messageNum),
      message
    );
    const sql = `
    UPDATE Message M
      JOIN Document D ON M.document_id = D.id
      SET M.message_content = ?
      WHERE D.user_id = ? AND M.guide_id = ?;
    `;
    const values = [
      generatedMessage,
      decodedUserAccount.id,
      parseInt(messageNum),
    ];

    // MariaDB 쿼리 실행
    conn.query(sql, values, (err, results) => {
      if (queryErrorChecker(err, res)) return;

      // 업데이트 성공 응답
      return res.status(StatusCodes.OK).json({
        message: 'Message updated successfully',
        data: results,
      });
    });

    //TODO: push alarm module()
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};
