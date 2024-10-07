import express from 'express';
import * as sc from '../controller/supportController';

const router = express.Router();
router.use(express.json());

// idea 보냄
router.post('/document', sc.documentCreateHandler);

//db에서 message요청
router.get('/document', sc.documentGetResultHandler)

export const supportRouter = router;
