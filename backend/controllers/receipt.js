import Receipt from '../models/Receipt.js';
import dotenv from 'dotenv';
import pkg from 'twilio';
const { twiml } = pkg;
const { MessagingResponse } = twiml;
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const to = process.env.TWILIO_TO_PHONE;
const from = process.env.TWILIO_FROM_PHONE;
const client = twilio(accountSid, authToken);


import {
	sendMessage,
	getTextMessageInput,
	processMessage,
} from '../utils/messageHelper.js';
import twilio from 'twilio';
export const getDashboardStats = async (req, res) => {
	try {
		const receipt = await Receipt.find();
		res.status(200).json(receipt);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error.' });
	}
};

export const getReceipt = async (req, res) => {
	try {
		const receipt = await Receipt.find();
		console.log('receipt');
		res.status(200).json(receipt);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const receiveMessage = async (req, res) => {
	try {
		console.log('Received message:', req.body);
		const processedMessage = processMessage(req.body);
		// console.log('Received processed Message:', processedMessage);
		const twiml = new MessagingResponse();

		twiml.message(
			'Message received! Hello again from the Twilio Sandbox for WhatsApp.'
		);

		console.log(twiml.toString());

		// const receipt = await Receipt.findOne();
		// res.status(200).json(receipt);
		res.type('text/xml').send(twiml.toString());
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const sendReceipt = async (req, res) => {
	try {
		// Log the entire incoming request body to see what you receive
		console.log('Incoming webhook:', JSON.stringify(req.body, null, 2));
		// Extract the text message sent by the user
		// const { message } = req.body;
		// console.log('Received message:', message);

		// // Prepare WhatsApp message payload (implement this helper to build API format)
		// const data = getTextMessageInput(process.env.RECIPIENT_WAID, message);

		// // Send the message with WhatsApp API (sendMessage would call the WhatsApp Business API)
		// const response = await sendMessage(data);
		const message = await client.messages.create({
			contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
			contentVariables: JSON.stringify({ 1: '22 July 2026', 2: '3:15pm' }),
			from: `whatsapp:${from}`,
			to: `whatsapp:${to}`,
		});

		console.log(message.body);
		// Send success response back to client
		res
			.status(200)
			.json({ message: 'Message sent successfully', data: message.body });
	} catch (error) {
		// Log error details for debugging and respond with server error status
		console.error(
			'Error sending message:',
			error.response?.data || error.message || error
		);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
