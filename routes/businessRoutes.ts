import express from 'express';
import {
  businessGetAllHandler,
  businessGetPartialHandler,
  businessGetDetailHandler,
} from '../controller/businessController';

const router = express.Router();
router.use(express.json());

// Read list of all businesses
router.get('/all', businessGetAllHandler);
// Read list of optional businesses
router.get('/by-survey', businessGetPartialHandler);
// Read detail of the business
router.get('/:businessId', businessGetDetailHandler);

export const businessRouter = router;
