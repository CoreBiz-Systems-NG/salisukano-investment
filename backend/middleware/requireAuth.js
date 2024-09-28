import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
// import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

export const requireAuth = async (req, res, next) => {
	// verify user is authenticated
	const { authorization } = req.headers;
	const token =
		req.cookies?.accessToken ||
		authorization?.split(' ')[1] ||
		req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ error: 'Authorization token required' });
	}
	try {
		const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findOne({ _id }).select('-password -refreshToken');
		if (!user) {
			return res.status(401).json({ error: 'Invalid access token' });
		}
		req.user = user;
		next();
	} catch (error) {
		// console.log(error);
		res.status(401).json({ error: 'Request is not authorized' });
	}
};


const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			// console.log(token);

			//decodes token id
			const decoded = jwt.verify(token, process.env.SECRET);
			// console.log(token);

			req.user = await User.findById(decoded._id).select('-password');

			next();
		} catch (error) {
			res.status(401).json('Not authorized, token failed');
		}
	}

	if (!token) {
		res.status(401).json('Not authorized, no token');
	}
};
const admin = async (req, res, next) => {
	if (!req.user.role.includes('admin'))
		return res.status(403).send({
			ok: false,
			error: 'Access denied.',
		});

	next();
};
const superAdmin = async (req, res, next) => {
	if (!req.user.role.includes('superAdmin'))
		return res.status(403).send({
			ok: false,
			error: 'Access denied.',
		});

	next();
};

export { protect, admin, superAdmin };