import express from 'express';
import * as TC from '../controller/testController';

const router = express.Router();
router.use(express.json());

// Test sending fcm message function
router.post('send-fcm', TC.testSendFCMHander);

export const testRouter = router;
