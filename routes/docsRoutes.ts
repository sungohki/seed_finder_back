import express from 'express';
import * as DC from '../controller/docsController';

const router = express.Router();
router.use(express.json());

// Read all documents of user
router.get('/', DC.documentGetAllHandler);

// Create a document and insert idea
router.post('/create', DC.documentCreateHandler);

// Read the document of user
router.get('/:documentId', DC.documentGetOneHandler);

// Update the document
router.put('/:documentId', DC.documentMessageUpdateHandler);

export const supportRouter = router;
