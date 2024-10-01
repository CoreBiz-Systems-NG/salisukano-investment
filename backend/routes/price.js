import express from 'express';
import {
	getPrices,
	getPrice,
	createPrice,
	deletePrice,
	deletePrices,
} from '../controllers/price.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getPrices);
router.get('/:id', getPrice);
router.post('/:id', createPrice);
router.delete('/:id/:priceId', deletePrice);
router.delete('/:id', deletePrices);

export default router;
