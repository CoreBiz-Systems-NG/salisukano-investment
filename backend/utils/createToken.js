import jwt from 'jsonwebtoken';
const createToken = (_id, time) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: time || '1h' });
};
const createRefreshToken = (_id, time) => {
	return jwt.sign({ _id }, process.env.REFRESH_SECRET, {
		expiresIn: time || '1d',
	});
};

export default createToken;
export { createRefreshToken, createToken };
//  refresh token rotation and of zero
