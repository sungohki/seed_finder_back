// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { createRes, accessTokenVerify, queryErrorChecker } from '../common';
import { ResultSetHeader } from 'mysql2';
import {createDoc} from "./createDocument";
import {generateMessage} from './generateMessage';

export const supportSendData =async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;

  try {

    //TODO: 엑세스 토큰 로직 필요()
    const {message}=req.body()
    //TODO: message길이 오류 처리 필요
    res.json({"message":"successss"}); 
    
    //chat gpt api
    const data:Array<String|undefined>=await generateMessageAll(message)

    //database 저장
    await createDoc(decodedUserAccount.id,message,data)
    
    //TODO: push alarm module()
    
} catch (err) {
    console.error(err);
    res.status(500).send('Database error');
}
};

async function generateMessageAll(message:string) {
  const data:Array<String|undefined>=[]
  for(let i=0;i<32;i++){
   const ret=await generateMessage(i,message)
    data.push(ret)
  }
  return data
}