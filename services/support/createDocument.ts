const conn = require('./database/mariaDB');

export const createDoc = async function createDoc(userId:number, message:string, data:Array<String|undefined>) {
    try {
        // 트랜잭션 시작
        await conn.beginTransaction();

        // 1. Document 테이블에 새로운 문서 추가
        const documentQuery = 'INSERT INTO Document (user_id, idea_message) VALUES (?, ?)';
        const [result] = await conn.query(documentQuery, [userId, message]);

        // 삽입된 Document의 id 가져오기
        const documentId = result.insertId;

        // 2. Message 테이블에 메시지 추가
        const messageQuery = 'INSERT INTO Message (document_id, guide_id, message_content) VALUES (?, ?, ?)';
        
        for (let i = 0; i < data.length; i++) {
            const msg = data[i]; // 현재 인덱스의 메시지 데이터
            // 각 메시지에 대해 Message 테이블에 삽입
            await conn.query(messageQuery, [documentId, i, msg]);
        }

        // 트랜잭션 커밋
        await conn.commit();
        console.log('Document와 메시지가 성공적으로 삽입되었습니다.');
    } catch (error) {
        // 오류 발생 시 롤백
        await conn.rollback();
        console.error('문서 삽입 실패:', error);
    }
};
