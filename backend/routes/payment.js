import express from 'express';
import {
	getPayments,
	createPayment,
	updatePayment,
	updateCustomerPayment,
	createCustomerPayment,
	deletePaymentAndUpdateBalance,
} from '../controllers/payment.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/:id', getPayments);
router.post('/', createPayment);
router.post('/customers', createCustomerPayment);
router.patch('/customers/:id', updateCustomerPayment);
router.patch('/:id', updatePayment);
router.delete('/:id', deletePaymentAndUpdateBalance);

export default router;
