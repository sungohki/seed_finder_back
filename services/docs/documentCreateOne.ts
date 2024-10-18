// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFile } from 'fs/promises';
import mariadb from 'mysql2/promise';
import { ChatCompletionMessageParam } from 'openai/resources';

// Import local module
import { connInfo } from '../../config/mariadb';
import {
  sendFCM,
  accessTokenVerify,
  convertKeysToCamelCase,
  IMessageRequest,
} from '../common';
import { documentInsert } from './documentInsert';
import { openAi } from '../../config/openaiClient';
import { IDocumentRequest, IDocumentGuide } from '.';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const documentRequest = req.body as IDocumentRequest;
  const conn = await mariadb.createConnection(connInfo);

  try {
    console.log('info: 문서 요청 전처리 시작');
    // 1. numbering_id 전처리
    let sql = `
      SELECT id FROM Document_Topic WHERE numbering_id = ?
    `;
    let values: Array<string> = [documentRequest.numberingId];
    let [results] = await conn.query(sql, values);
    const documentTopicId = (results as Array<{ id: number }>)[0].id;
    if (!documentTopicId)
      throw new Error(`info: ${values[0]})에 맞는 numbering_id가 없습니다.`);

    // 2. 해당되는 guide 읽어오기
    sql = `
      SELECT *
      FROM Guide
      WHERE document_topic_id = ?
    `;
    values = [(results as Array<{ id: number }>)[0].id + ''];
    [results] = await conn.query(sql, values);
    const openAiAnswer: Array<String | undefined> = [];
    const documentGuides: Array<IDocumentGuide> = [];
    for (const item of results as Array<IDocumentGuide>)
      documentGuides.push(convertKeysToCamelCase(item));
    console.log('info: 문서 요청 전처리 완료. 답변 생성 시작');
    res.status(StatusCodes.OK).end(); // 요청 전처리 완료 알림

    // 3. open ai 답변 생성
    for (const guide of documentGuides) {
      const ret = await generateMessage(guide.id, documentRequest.message);
      openAiAnswer.push(ret);
    }
    await documentInsert(
      decodedUserAccount.id,
      documentRequest,
      documentGuides[0].id,
      openAiAnswer
    );

    // test device token
    // const testToken =
    //   'ek4vgM6bSAmhM5rItu39Mf:APA91bEGIAqTKwdrXoi8hWu9BW0fzkNXq3JvAHeESfGdvecufuSobw0QZG1-CulylrTxnIH0LDMXWBXsBWjPkNijY1X1g29apf0nDvwHeAP_XRgjGl7qClxYlW7jOolGkNv6AaMF0pzS';
    // const testToken =
    //   'fIY1yA8nRN6iLi8GDfos5h:APA91bHG2LlehZGIC1TK0yLAzAmwE0CW5EtGAxeJR9WBQaKuoyEQwXu4UUEWsrdjgzXtKFnd19ZCvSC-xd15lN8jOVIaeEEaHjGLzskNlizgnR54ejvTpiBmiRPW3PeNYf6G5foDn3RJ';

    console.log(documentRequest);
    if (!documentRequest.deviceToken)
      documentRequest.deviceToken =
        'fIY1yA8nRN6iLi8GDfos5h:APA91bHG2LlehZGIC1TK0yLAzAmwE0CW5EtGAxeJR9WBQaKuoyEQwXu4UUEWsrdjgzXtKFnd19ZCvSC-xd15lN8jOVIaeEEaHjGLzskNlizgnR54ejvTpiBmiRPW3PeNYf6G5foDn3RJ';

    const messageRequest: IMessageRequest = {
      title: documentRequest.title,
      body: documentRequest.message,
      data: {
        documentId: documentRequest.numberingId,
      },
      deviceToken: documentRequest.deviceToken,
    };
    console.log('info: 답변 생성 완료');
    return sendFCM(messageRequest);
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.BAD_REQUEST).json(e);
  } finally {
    await conn.end();
  }
};

interface ITraining {
  messages: Array<ChatCompletionMessageParam>;
}

export const generateMessage = async (num: number, param: string) => {
  try {
    const messages: Array<ChatCompletionMessageParam> = [];
    const history = await readFile('./data/training_data.jsonl', 'utf-8');
    const lines = history.split('\n').filter((line) => line.trim() !== '');
    if (num >= lines.length)
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);
    lines.forEach((line) => {
      const parsedLine: ITraining = JSON.parse(line);
      const parsedLineContent = parsedLine.messages[0].content as string;
      if (parsedLineContent?.includes(`${num}번 항목`)) {
        parsedLine.messages.forEach((messageParam) => {
          messages.push(messageParam);
        });
      }
    });

    const data = await readFile('./data/guidelines.json', 'utf8');
    const guidelines = JSON.parse(data);
    const messageContent = guidelines[num];
    if (!messageContent)
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);

    messages.push({
      role: 'system',
      content: messageContent + `200 자 이내로 작성해줘.`,
    });
    messages.push({ role: 'user', content: param + `200 자 이내로 작성해줘.` });

    const response = await openAi.chat.completions.create({
      messages: messages,
      model: process.env.FINE_TUNING_MODEL as string,
    });
    return response.choices[0].message.content?.replace('**', '') as string;
  } catch (e) {
    console.error(e);
  }
};
