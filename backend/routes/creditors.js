import express from 'express';
import {
	createCreditor,
	getCreditors,
	getCreditor,
	newCredit,
	getCredit,
	editCreditor,
	addCreditFunction,
	createDeposit,
} from '../controllers/creditor.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCreditors);
router.get('/:id', getCreditor);
router.get('/:id/credit', getCredit);
router.post('/', createCreditor);
router.post('/deposit', createDeposit);
router.post('/:id', newCredit);
router.patch('/credit', addCreditFunction);
router.patch('/credit', addCreditFunction);
router.patch('/:id', editCreditor);

export default router;
