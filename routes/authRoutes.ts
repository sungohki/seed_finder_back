import express from 'express';
import * as AC from '../controller/authController';

const router = express.Router();
router.use(express.json());

// Create
router.post('/kakao');
//
router.post('/google');
//
router.post('/refresh');
