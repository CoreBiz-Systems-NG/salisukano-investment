import express from 'express';
import {
	getTransactions,
	getTransaction,
	cleanAndBalanceTransactionsAndAccount,
} from '../controllers/transaction.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getTransactions);
router.get('/:id', getTransaction);
// router.patch('/clean/:id', cleanAndBalanceTransactionsAndAccount);
// router.delete('/', cleanAndBalanceTransactionsAndAccount);

export default router;
