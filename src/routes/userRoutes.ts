import express from 'express';
import * as UC from '../controller/userController';

const router = express.Router();
router.use(express.json());

// // Create user login token
// router.post('/login', UC.userLoginHandler);
// // Create user account
// router.post('/join', UC.userJoinHandler);

// Read user account profile
router.get('/profile', UC.userGetProfileHandler);
// Delete user account
router.delete('/delete', UC.userDeleteHandler);
// Create user info
router.post('/info', UC.userSurveyInfoHandler);
// Read servey options
router.get('/option', UC.userSurveyOptionHandler);
// Read servey check
router.get('/check', UC.userSurveyCheckHandler);

export const userRouter = router;
