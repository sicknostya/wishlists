import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WishlistPage from './pages/WishlistsListPage/WishlistPage';
import WishlistCreate from './pages/WishlistCreatePage/WishlistCreate';
import Auth from './pages/AuthPage/Auth';
import WishlistDetailsPage from './pages/WishlistDetailsPage/WishlistDetailsPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ForbiddenPage from './pages/ForbiddenPage/ForbiddenPage';
import WishlistEdit from './pages/WishlistEditPage/WishlistEdit';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import MyProfilePage from './pages/MyProfilePage/MyProfilePage';

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

				<Route
					path='/user/:username'
					element={
						<ProtectedRoute>
							<UserProfilePage />
						</ProtectedRoute>
					}
				/>

				<Route
					path='/friends'
					element={
						<ProtectedRoute>
							<FriendsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path='/profile'
					element={
						<ProtectedRoute>
							<MyProfilePage />
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
