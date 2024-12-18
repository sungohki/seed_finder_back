import express from 'express';
import * as DC from '../controller/docsController';

const router = express.Router();
router.use(express.json());

// Read document guides
router.get('/guides', DC.documentGetGuideHandler);

// Read all documents of user
router.get('/all', DC.documentGetAllHandler);

// Create a document and insert idea
router.post('/create', DC.documentCreateHandler);

// Read the document of user
router.get('/:documentId', DC.documentGetOneHandler);

// Delete the document
router.delete('/delete/:documentId', DC.documentMessageDeleteOneHandler);

// // Update the document message
// router.put('/:documentId', DC.documentMessageUpdateOneHandler);

export const supportRouter = router;
