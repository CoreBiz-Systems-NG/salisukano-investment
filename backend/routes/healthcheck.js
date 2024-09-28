import express from 'express';
const router = express.Router();
router.get('/', async (req, res) => {
	return res
		.status(200)
		.json({ status: 'success', message: 'Server is up and running' });
});

export default router;
