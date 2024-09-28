import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import './assets/css/main.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext.jsx';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 2 * 60 * 1000,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthContextProvider>
					<Toaster />
					<App />
				</AuthContextProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);
