// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFile } from 'fs/promises';
import mariadb from 'mysql2/promise';
import { ChatCompletionMessageParam } from 'openai/resources';

// Import local module
import { connInfo } from '../../mariadb';
import {
  sendFCM,
  accessTokenVerify,
  convertKeysToCamelCase,
  IMessageRequest,
  openAi,
} from '../common';
import { documentInsert } from './documentInsert';
import { IDocumentRequest, IDocumentGuide } from '.';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const documentRequest = req.body as IDocumentRequest;
  const conn = await mariadb.createConnection(connInfo);

  console.log('핸들러 테스트');
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

    console.log(documentRequest);
    if (!documentRequest.deviceToken)
      documentRequest.deviceToken =
        'fIY1yA8nRN6iLi8GDfos5h:APA91bHG2LlehZGIC1TK0yLAzAmwE0CW5EtGAxeJR9WBQaKuoyEQwXu4UUEWsrdjgzXtKFnd19ZCvSC-xd15lN8jOVIaeEEaHjGLzskNlizgnR54ejvTpiBmiRPW3PeNYf6G5foDn3RJ';

    const messageRequest: IMessageRequest = {
      title: documentRequest.title,
      body: '답변 생성이 완료되었습니다.',
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
    messages.push({
      role: 'user',
      content:
        `
      내 아이템은
      ` +
        param +
        `이거야. 내가 생각하는 아이템 관련 ${num}번 항목 내용은
      ` +
        param +
        `
      이거야. 내 생각을 참고해서 ${num}번 항목을 작성하는데 없는 근거는 작성하면 안돼. 
      제목과 본문은 사실 기반으로 참신한 글쓰기 방식으로 글을 작성하고 주장을 잘 설명할 수 있는 실제 데이터나 근거가 있는 통계나 보고서를 인용해도 좋지만 없으면 작성하지마. 
      비즈니스 전문가 답게 "~니다."체로 작성해줘. 본문은 250자 이내로 작성해줘. 이미지 가이드라인과 제목과 본문에 인용된 데이터 출처도 작성해줘. 중요한 부분 bold체 해줘.
      ` +
        `200 자 이내로 작성해줘.`,
    });

    const response = await openAi.chat.completions.create({
      messages: messages,
      model: process.env.FINE_TUNING_MODEL as string,
    });
    return response.choices[0].message.content?.replace('**', '') as string;
  } catch (e) {
    console.error(e);
  }
};
