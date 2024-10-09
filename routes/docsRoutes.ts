import express from 'express';
import * as sc from '../controller/docsController';

const router = express.Router();
router.use(express.json());

// Read all documents of user
router.get('/', sc.documentGetAllHandler);

// Create a document and insert idea
router.post('/create', sc.documentCreateHandler);

// Read the document of user
router.get('/:documentId', sc.documentGetOneHandler);

// Update the document
router.put('/:documentId', sc.documentMessageUpdateHandler);

export const supportRouter = router;
