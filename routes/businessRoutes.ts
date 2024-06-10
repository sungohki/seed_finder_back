import express from 'express';
import {
  businessPreviewsHandler,
  businessDetailHandler,
} from '../controller/businessController';

const router = express.Router();
router.use(express.json());

// Read list of businesses
router.get('/', businessPreviewsHandler);
// Read detail of the business
router.get('/:businessId', businessDetailHandler);

export const businessRouter = router;
