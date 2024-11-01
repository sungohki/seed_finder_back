// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connection as conn } from '../../mariadb';
import { convertKeysToCamelCase, queryErrorChecker } from '../common';

// Import local module
// import { accessTokenVerify } from '../common';

interface IGuideContent {
  guideContent: string;
}

export const documentGetGuide = (req: Request, res: Response) => {
  const { numberingId } = req.body;
  const sql = `
    SELECT guide_content FROM Guide WHERE document_topic_id = 
      (SELECT id FROM Document_Topic WHERE numbering_id = ?) LIMIT 1`;
  const values = [numberingId];

  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    const guideLines = convertKeysToCamelCase(
      Object.values(results)[0]
    ) as IGuideContent;
    return res.status(StatusCodes.OK).json({
      guideLines: guideLines.guideContent,
    });
  });
};
