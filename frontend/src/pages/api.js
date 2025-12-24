// const API_URL = import.meta.env.VITE_API_URL ||'http://localhost:9000';
const API_URL = 'http://localhost:9000';

export const createReceipt = (text) => {
	return fetch(`${API_URL}/invoices`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text }),
	});
};

export const getReceipts = () => {
	return fetch(`${API_URL}/invoices`).then((res) => res.json());
};

export const deleteReceipt = (id) => {
	return fetch(`${API_URL}/invoices/${id}`, {
		method: 'DELETE',
	});
};

import axios from 'axios';

const API = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const invoiceAPI = {
	createInvoice: (text) => API.post('/invoices/create', { text }),
	getInvoices: () => API.get('/invoices/all'),
	getInvoiceById: (id) => API.get(`/invoices/${id}`),
	updateInvoice: (id, data) => API.put(`/invoices/${id}`, data),
	deleteInvoice: (id) => API.delete(`/invoices/${id}`),
	downloadPDF: (id) => API.get(`/invoices/pdf/${id}`, { responseType: 'blob' }),
	getStats: () => API.get('/invoices/stats'),

	// New: Validate text before submission
	validateText: (text) => API.post('/invoices/validate', { text }),
};
