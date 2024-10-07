import express from 'express';
import * as sc from '../controller/supportController';

const router = express.Router();
router.use(express.json());

// Create a document and insert idea
router.post('/document', sc.documentCreateHandler);

// Read a document
router.get('/document/:documentId', sc.documentGetResultHandler);

export const supportRouter = router;
