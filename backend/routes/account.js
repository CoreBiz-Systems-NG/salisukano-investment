import express from 'express';
import {
	getAccounts,
	getAccount,
	createAccount,
	changeAccountStatus,
	updateOpeningBalance,
	getActiveAccount,
} from '../controllers/account.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAccounts);
router.get('/active/:id', getActiveAccount);
router.get('/:id', getAccount);
// router.get('/:id', getTransactionAccount);
router.post('/', createAccount);
router.patch('/status', changeAccountStatus);
router.patch('/opening-balance', updateOpeningBalance);

export default router;
