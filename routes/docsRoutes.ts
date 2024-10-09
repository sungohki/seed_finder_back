import express from 'express';
import * as sc from '../controller/docsController';

const router = express.Router();
router.use(express.json());

// Create a document and insert idea
router.post('/', sc.documentCreateHandler);

// Read a document
router.get('/:documentId', sc.documentGetResultHandler);

// Update a document
router.put('/:documentId', sc.documentMessageUpdateHandler);

export const supportRouter = router;
