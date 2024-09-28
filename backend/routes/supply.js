import express from 'express';
import {
	getSupply,
	getSupplies,
	getSuppliers,
	createSupply,
	updateSupply,
	createCustomerSupply,
	updateCustomerSupply,
	deleteSupplyTransaction,
	getTotal,
} from '../controllers/supply.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/suppliers/:id', getSuppliers);
router.get('/:id', getSupplies);
router.get('/supplies/:id', getSupply);
router.get('/:id/total', getTotal);
router.post('/', createSupply);
router.post('/customers', createCustomerSupply);
router.patch('/customers/:id', updateCustomerSupply);
router.patch('/:id', updateSupply);
router.delete('/:id', deleteSupplyTransaction);

export default router;
