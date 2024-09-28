function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
function getRandomRGBColor() {
	const getRandomValue = () => Math.floor(Math.random() * 256);
	const red = getRandomValue();
	const green = getRandomValue();
	const blue = getRandomValue();
	return `${red}, ${green}, ${blue}`;
}
export { getRandomColor, getRandomRGBColor };
