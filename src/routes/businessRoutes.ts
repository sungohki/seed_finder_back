import express from 'express';
import * as BC from '../controller/businessController';

const router = express.Router();
router.use(express.json());

// Read list of all businesses
router.get('/all', BC.businessGetAllHandler);
// Read list of optional businesses
router.get('/by-survey', BC.businessGetPartialHandler);
// Read detail of the business
router.get('/:businessId', BC.businessGetDetailHandler);

export const businessRouter = router;
