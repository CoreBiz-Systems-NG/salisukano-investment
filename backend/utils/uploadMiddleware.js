import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to create the uploads directory if it doesn't exist
const createUploadsDir = (req, res, next) => {
	const uploadsDir = path.join(__dirname, 'public', 'uploads');

	// Check if the uploads directory exists
	if (!fs.existsSync(uploadsDir)) {
		// If it doesn't exist, create it
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	next(); // Move on to the next middleware or route handler
};
// Set up Multer storage and options
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, join(__dirname, '../public', 'uploads'));
	},
	filename: (req, file, cb) => {
		const fileName =
			new Date().getTime().toString() + path.extname(file.originalname);
		cb(null, fileName);
	},
});

const upload = multer({ storage });
const uploadMiddleware = multer({ storage }).single('image');

export { createUploadsDir, upload, uploadMiddleware };
