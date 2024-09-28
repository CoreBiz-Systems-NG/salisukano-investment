import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './hooks/ProtectedRoutes';
import NotFound from './NotFound';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import EditTransaction from './pages/EditTransaction';
import TransactionDetail from './pages/TransactionDetail';
import AddSupply from './pages/AddSupply';
import Payment from './pages/Payment';
import EditPayment from './pages/EditPayment';
import ChangePassword from './pages/ChangePassword';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import Customers from './pages/Customers';
import CustomerAddPayment from './pages/CustomerPayment';
import CustomerAddSupply from './pages/CustomerSupply';
import Loader from './components/Loader';
import { useState, useEffect } from 'react';
import Debtors from './pages/Debtors';
import Debtor from './pages/Debtor';
import Creditors from './pages/Creditors';
import Creditor from './pages/Creditor';
import NewCredit from './pages/NewCredit';
import CreditDetails from './pages/CreditDetails';
// import Report from './pages/Report';
function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000);
	}, []);

	return loading ? (
		<Loader />
	) : (
		<>
			<Routes>
				<Route path="/">
					<Route path="/login" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ChangePassword />} />
					<Route element={<ProtectedRoutes />}>
						<Route exact path="/" element={<DashboardLayout />}>
							<Route path="/" element={<Dashboard />} />
							<Route path="/companies" element={<Customers />} />
							<Route
								path="/companies/payment/:customerId"
								element={<CustomerAddPayment />}
							/>
							<Route
								path="/companies/supply/:customerId"
								element={<CustomerAddSupply />}
							/>
							<Route path="/companies/:id" element={<Accounts />} />
							{/* <Route path="/accounts" element={< />} /> */}
							<Route path="/accounts/:id" element={<AccountDetail />} />
							<Route path="/add-supply/:id" element={<AddSupply />} />
							<Route path="/transactions" element={<Transactions />} />
							<Route path="/payment/:id" element={<Payment />} />
							<Route path="/payment/edit/:id" element={<EditPayment />} />
							<Route
								path="/transactions/edit/:id"
								element={<EditTransaction />}
							/>
							<Route path="/transactions/:id" element={<TransactionDetail />} />
							<Route path="/suppliers/:id" element={<Suppliers />} />
							<Route path="/debtors" element={<Debtors />} />
							<Route path="/debtors/:id" element={<Debtor />} />
							<Route path="/creditors" element={<Creditors />} />
							<Route
								path="/creditors/:id/credit/:creditId"
								element={<CreditDetails />}
							/>
							<Route path="/creditors/:id/new-credit" element={<NewCredit />} />
							<Route path="/creditors/:id" element={<Creditor />} />
							<Route path="/settings" element={<Settings />} />
						</Route>
					</Route>
				</Route>
				<Route path="/*" element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
