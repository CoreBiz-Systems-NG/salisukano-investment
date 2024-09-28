import express from 'express';
import { getDashboardStats } from '../controllers/general.js';
// import { uploadMiddleware } from '../utils/uploadMiddleware.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);

export default router;
