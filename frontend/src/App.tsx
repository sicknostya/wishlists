import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WishlistList from './WishlistList';
import WishlistCreate from './WishlistCreate';
import Auth from './Auth';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path='/login' element={<Auth />} />
				<Route path='/wishlists' element={<WishlistList />} />
				<Route path='/create-wishlist' element={<WishlistCreate />} />
				<Route path='/' element={<Auth />} />
			</Routes>
		</Router>
	);
};

export default App;
