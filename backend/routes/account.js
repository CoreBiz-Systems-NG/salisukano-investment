import express from 'express';
import {
	getAccounts,
	getAccount,
	createAccount,
	changeAccountStatus,
	updateOpeningBalance,
	getActiveAccount,
	getAccountCommission,
	addAccountCommission,updateCommissionTransaction,
	deleteCommissionTransaction,
} from '../controllers/account.js';
// import { protect } from '../middleware/requireAuth.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAccounts);
router.get('/active/:id', getActiveAccount);
router.get('/commission/:id', getAccountCommission);
router.get('/:id', getAccount);
router.post('/', createAccount);
router.post('/commission', addAccountCommission);
router.patch('/status', changeAccountStatus);
router.patch('/opening-balance', updateOpeningBalance);
router.patch('/commission/:id', updateCommissionTransaction);
router.delete('/commission/:id/:commissionId', deleteCommissionTransaction);

export default router;
