import express from 'express';

const router = express.Router();
router.use(express.json());

// Read list of businesses
router.get('/', () => {});
// Read detail of the business
router.get('/:businessId', () => {});

export const businessRouter = router;
