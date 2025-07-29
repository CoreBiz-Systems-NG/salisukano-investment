import express from 'express';
import {
	createCreditor,
	getCreditors,
	getMonthlyCredits,
	getMonthlyCredit,
	// getCreditor,
	newCredit,
	getCredit,
	editCreditor,
	addCreditFunction,
	createDeposit,
	deleteCredit,
	updateCreditInvoice,
	deleteCreditInvoice,
} from '../controllers/creditor.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCreditors);
router.get('/:id/month', getMonthlyCredit);
router.get('/:id/month/:monthId', getMonthlyCredits);
router.get('/:id/credit', getCredit);
// router.get('/:id', getCreditor);
router.post('/', createCreditor);
router.post('/deposit', createDeposit);
router.post('/:id', newCredit);
router.patch('/invoices', updateCreditInvoice);
router.patch('/credit', addCreditFunction);
router.patch('/:id', editCreditor);
router.delete('/invoices/:invoiceId', deleteCreditInvoice);
router.delete('/:creditorId/:creditId', deleteCredit);

export default router;
