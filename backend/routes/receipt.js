import express from 'express';
import {
	getReceipt,
	sendReceipt,
	receiveMessage,
} from '../controllers/receipt.js';

const router = express.Router();

router.get('/', getReceipt);
router.post('/', sendReceipt);
router.post('/receive-message', receiveMessage);

export default router;
