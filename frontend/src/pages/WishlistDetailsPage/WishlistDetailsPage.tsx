import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './WishlistDetailsPage.css';
import wishlistService from '../../api/wishlists/WishlistService';
import { Wishlist } from '../../interfaces';
import Header from '../../components/Header/Header';

// const handleAddComment = async () => {
// 	if (!commentText.trim()) return;

// 	try {
// 		await axios.post(
// 			`http://localhost:8000/wishlists/${id}/comments/`,
// 			{ text: commentText },
// 			{ headers: { Authorization: `Bearer ${token}` } }
// 		);
// 		setCommentText('');
// 		// Перезагрузим комментарии
// 		const res = await axios.get<Wishlist>(
// 			`http://localhost:8000/api/wishlists/${id}/`,
// 			{
// 				headers: { Authorization: `Bearer ${token}` },
// 			}
// 		);
// 		setWishlist(res.data);
// 	} catch (error) {
// 		console.error('Ошибка при добавлении комментария', error);
// 	}
// };

export default function WishlistDetailsPage() {
	const { id } = useParams();
	const [wishlist, setWishlist] = useState<Wishlist | null>(null);
	const [commentText, setCommentText] = useState('');
	const [currentUser, setCurrentUser] = useState('');
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	useEffect(() => {
		setCurrentUser(localStorage.getItem('user') || '');
	}, []);

	useEffect(() => {
		const fetchWishlist = async () => {
			if (!id) return;
			try {
				const res = await wishlistService.getWishlist(id);
				console.log('res', res);

				setWishlist(res);
			} catch (error: any) {
				console.error('Ошибка загрузки вишлиста', error);
				if (error.response && error.response.status === 403) {
					navigate('/forbidden');
				}
			}
		};
		fetchWishlist();
	}, [id, token]);

	const handleDelete = async () => {
		if (!id) return;
		if (window.confirm('Точно удалить вишлист?')) {
			try {
				await wishlistService.deleteWishlist(id);
				navigate('/wishlists');
			} catch (error) {
				console.error('Ошибка при удалении вишлиста:', error);
			}
		}
	};

	const handleToEditPage = () => {
		navigate(`/wishlists/${id}/edit`);
	};

	const handleAddFavorite = () => {
		// TODO: реализовать добавление в избранное
		alert('Добавлено в избранное!');
	};

	if (!wishlist) return <p>Загрузка...</p>;

	return (
		<>
			<Header />
			<div className='wishlist-detail'>
				<div className='mainDetailBlock'>
					<div className='left'>
						<h2>{wishlist.title}</h2>
						<h4>Автор: {wishlist.user}</h4>
						<img
							src={wishlist.image}
							alt={wishlist.title}
							className='wishlist-main-image'
						/>
					</div>
					<div className='right'>
						<p>{wishlist.description}</p>
						<button onClick={handleAddFavorite} className='favorite-button'>
							Добавить в избранное
						</button>
						{wishlist.user === currentUser && (
							<button onClick={handleToEditPage} className='edit-button'>
								Редактировать
							</button>
						)}
						{wishlist.user === currentUser && (
							<button onClick={handleDelete} className='delete-button'>
								Удалить
							</button>
						)}
					</div>
				</div>

				<h3>Товары:</h3>
				<div className='product-list'>
					{wishlist.items &&
						(wishlist.items as any).map((item: any) => (
							<div key={item.link} className='product-card'>
								<img
									src={`http://localhost:8000${item.image}`}
									alt={item.name}
								/>
								<h4>{item.name}</h4>
								<p>{item.description}</p>
								<a href={item.link} target='_blank' rel='noopener noreferrer'>
									Перейти в магазин
								</a>
							</div>
						))}
				</div>

				<h3>Комментарии:</h3>
				<ul className='comment-list'>
					{wishlist.comments.map(comment => (
						<li key={comment.date}>
							<strong>{comment.author}</strong> (
							{new Date(comment.date).toLocaleString()}): {comment.text}
						</li>
					))}
				</ul>

				<div className='add-comment-form'>
					<textarea
						value={commentText}
						onChange={e => setCommentText(e.target.value)}
						placeholder='Напишите комментарий...'
					/>
					<button>Добавить комментарий</button>
				</div>
			</div>
		</>
	);
}
