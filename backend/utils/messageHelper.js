import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export function sendMessage(data) {
	var config = {
		method: 'post',
		url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
		headers: {
			Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			'Content-Type': 'application/json',
		},
		data: data,
	};

	return axios(config);
}

export function getTextMessageInput(recipient, text) {
	return JSON.stringify({
		messaging_product: 'whatsapp',
		preview_url: false,
		recipient_type: 'individual',
		to: recipient,
		type: 'text',
		text: {
			body: text,
		},
	});
}

// A more robust processMessage function
export function processMessage(messageBody) {
	const from = messageBody.From; // User's WhatsApp number
	const messageType = messageBody.NumMedia > 0 ? 'media' : 'text';
	const messageContent = messageBody.Body;

	console.log(`Received a ${messageType} message from ${from}.`);

	if (messageType === 'text' && messageContent) {
		console.log('Text content:', messageContent);
		// TODO: Call your AI/Parser service here with messageContent
	} else if (messageType === 'media') {
		// For media (image), we need to get the URL from Twilio
		// The media URL is in a field like MediaUrl0, MediaContentType0, etc.
		const mediaUrl = messageBody['MediaUrl0'];
		const contentType = messageBody['MediaContentType0'];

		console.log(`Media URL: ${mediaUrl}`);
		console.log(`Content Type: ${contentType}`);

		if (contentType.startsWith('image/')) {
			// TODO: Call your OCR service here with mediaUrl
		}
	} else {
		console.log('Message type not supported or content is empty.');
	}
}
