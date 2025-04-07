import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WishlistList.css';

interface Wishlist {
	id: number;
	description: string;
	image: string;
	link: string;
}

const WishlistList: React.FC = () => {
	const [wishlists, setWishlists] = useState<Wishlist[]>([]);
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchWishlists = async () => {
			try {
				const response = await axios.get<Wishlist[]>(
					'http://localhost:8000/api/wishlists/',
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setWishlists(response.data);
			} catch (error) {
				// alert('Ошибка при получении вишлистов');
				console.log('Ошибка при получении вишлистов');
			}
		};
		fetchWishlists();
	}, [token]);

	const handleCreate = () => {
		navigate('/create-wishlist');
	};

	return (
		<div className='wishlist-list-container'>
			<div className='wishlist-list-header'>
				<h2>Список вишлистов</h2>
				<button onClick={handleCreate}>Создать новый элемент</button>
			</div>
			<div className='wishlist-list-content'>
				{wishlists.length > 0 ? (
					<ul className='wishlist-list'>
						{wishlists.map(wishlist => (
							<li key={wishlist.id} className='wishlist-item'>
								<div className='wishlist-card'>
									<img
										src={wishlist.image}
										alt={wishlist.description}
										className='wishlist-image'
									/>
									<p className='wishlist-description'>{wishlist.description}</p>
									<a
										href={wishlist.link}
										target='_blank'
										rel='noopener noreferrer'
										className='wishlist-link'
									>
										Перейти в магазин
									</a>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className='empty-message'>Ваш вишлист пока пуст</p>
				)}
			</div>
		</div>
	);
};

export default WishlistList;
