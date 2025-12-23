import express from 'express';
import {
	getReceipt,
	sendReceipt,
	receiveMessage,
	sendNewMessage,
} from '../controllers/receipt.js';

const router = express.Router();

router.get('/', getReceipt);
router.post('/', sendReceipt);
router.post('/receive-message', receiveMessage);
router.post('/send-message', sendNewMessage);

export default router;
