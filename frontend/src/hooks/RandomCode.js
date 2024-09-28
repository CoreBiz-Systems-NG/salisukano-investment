const generateRandomCode = () => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let code = '';

	for (let i = 0; i < 7; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters.charAt(randomIndex);
	}

	return code;
};
const generateRandomNumbers = () => {
	let code = `${Math.floor(1000 + Math.random() * 9000)}`;
	return code;
};

export { generateRandomCode, generateRandomNumbers };
