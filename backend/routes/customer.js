import express from 'express';
import {
	getCustomers,
	getCustomer,
	getTransactionCustomer,
	createCustomer,editCustomer
} from '../controllers/customer.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCustomers);
router.get('/transacting-customers', getTransactionCustomer);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.patch('/:id', editCustomer);

export default router;
