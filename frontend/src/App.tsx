import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WishlistPage from './pages/WishlistsListPage/WishlistPage';
import WishlistCreate from './pages/WishlistCreatePage/WishlistCreate';
import Auth from './pages/AuthPage/Auth';
import WishlistDetailsPage from './pages/WishlistDetailsPage/WishlistDetailsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ForbiddenPage from './pages/ForbiddenPage/ForbiddenPage';
import WishlistEdit from './pages/WishlistEditPage/WishlistEdit';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/login' element={<Auth />} />
				<Route
					path='/wishlists'
					element={
						<ProtectedRoute>
							<WishlistPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/wishlists/:id'
					element={
						<ProtectedRoute>
							<WishlistDetailsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/wishlist-create'
					element={
						<ProtectedRoute>
							<WishlistCreate />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/wishlists/:id/edit'
					element={
						<ProtectedRoute>
							<WishlistEdit />
						</ProtectedRoute>
					}
				/>

				<Route path='/' element={<Auth />} />
				<Route path='/forbidden' element={<ForbiddenPage />} />
			</Routes>
		</Router>
	);
};

export default App;
