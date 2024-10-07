// Import node module
import mariadb, { ResultSetHeader } from 'mysql2/promise';

// Import local module
import { connInfo } from '../../mariadb';

export const documentCreate = async (
  userId: number,
  message: string,
  data: Array<String | undefined>
) => {
  const conn = await mariadb.createConnection(connInfo);
  try {
    // 트랜잭션 시작
    await conn.beginTransaction();

    // 1. Document 테이블에 새로운 문서 추가
    let sql = `
      INSERT INTO
        Document
          (user_id, idea_message)
      VALUES
        (?, ?)
    `;
    const [result] = await conn.query<ResultSetHeader>(sql, [userId, message]);
    const documentId = result.insertId;

    // 2. Message 테이블에 메시지 추가
    sql = `
      INSERT INTO
        Message
          (document_id, guide_id, message_content)
        VALUES
          (?, ?, ?)
    `;

    for (let index = 0; index < data.length; index++) {
      const msg = data[index]; // 현재 인덱스의 메시지 데이터

      // 각 메시지에 대해 Message 테이블에 삽입
      await conn.query(sql, [documentId, index, msg]);
    }

    await conn.commit(); // 트랜잭션 커밋
    console.log('info: document 생성 요청 완료');
  } catch (e) {
    await conn.rollback(); // 오류 발생 시 롤백
    console.error(e);
  }
};
