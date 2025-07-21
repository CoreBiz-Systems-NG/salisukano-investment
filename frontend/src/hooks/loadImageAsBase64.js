const loadImageAsBase64 = (url) => {
	// console.log('loadImageAsBase64', url);
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		fetch(url)
			.then((res) => res.blob())
			.then((blob) => {
				reader.readAsDataURL(blob);
				reader.onloadend = () => resolve(reader.result);
			})
			.catch((err) => reject(err));
	});
};

export default loadImageAsBase64;


// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Naira Symbol Example</title>
// </head>
// <body>
//     <h1>Displaying the Naira Symbol</h1>
//     <p>The Naira symbol is: </p>
//     <p>Price Example: ₦5,000</p>
// </body>
// </html>
