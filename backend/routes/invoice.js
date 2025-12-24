import express from 'express';
import Invoice from '../models/Invoice.js';
import {
	createInvoice,
	getInvoices,
	getInvoiceById,
	deleteInvoice,
	updateInvoice,
	getStats,
	parseInvoiceText,
} from '../controllers/invoice.js';

const router = express.Router();
router.post('/create', createInvoice);
router.get('/all', getInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.get('/stats', getStats);
router.post('/validate', (req, res) => {
	try {
		const { text } = req.body;
		const parsedData = parseInvoiceText(text);
		res.json({
			success: true,
			data: parsedData,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
});

export default router;
