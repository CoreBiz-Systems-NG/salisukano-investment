import express from 'express';
import {
	getDebtors,
	getDebtor,
	createDebtor,
	editDebtor,
	addCreditFunction,
	addDebitFunction,
	editDebt,
	deleteDebtor,
	deleteDebt,
} from '../controllers/debtor.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getDebtors);
router.get('/:id', getDebtor);
router.post('/', createDebtor);
router.patch('/credit', addCreditFunction);
router.patch('/debit', addDebitFunction);
router.patch('/:id/edit', editDebt);
router.patch('/:id', editDebtor);
router.delete('/:id', deleteDebtor);
router.delete('/:debtorId/:debtId', deleteDebt);

export default router;
