import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './WishlistDetailsPage.css';
import wishlistService from '../../api/wishlists/WishlistService';
import { Wishlist } from '../../interfaces';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';

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

	useEffect(() => {
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

	const handleAddComment = async () => {
		try {
			if (wishlist) {
				await wishlistService.addComment(wishlist.id, commentText);
				setCommentText('');
				await fetchWishlist();
			}
		} catch (error) {
			console.error('Ошибка при добавлении комментария', error);
		}
	};

	const handleFavoriteToggle = async () => {
		if (!wishlist || !id) return;

		try {
			if (wishlist.is_favorite) {
				await wishlistService.removeFromFavorite(id);
			} else {
				await wishlistService.addToFavorite(id);
			}

			setWishlist(prev => ({
				...(prev as Wishlist),
				is_favorite: !(prev as Wishlist).is_favorite,
			}));
		} catch (error) {
			console.error(error);
		}
	};

	const handleToUserPage = (user: string) => {
		navigate(`/user/${user}`);
	};

	if (!wishlist) return <p>Загрузка...</p>;

	return (
		<>
			<Header />
			<BackButton />
			<div className='wishlist-detail'>
				<div className='mainDetailBlock'>
					<div className='left'>
						<h2>{wishlist.title}</h2>
						<h4>
							Автор:{' '}
							<span
								className='author-link'
								onClick={() => handleToUserPage(wishlist.user)}
								style={{
									cursor: 'pointer',
									color: 'blue',
									textDecoration: 'underline',
								}}
							>
								{wishlist.user}
							</span>
						</h4>
						<img
							src={wishlist.image}
							alt={wishlist.title}
							className='wishlist-main-image'
						/>
					</div>
					<div className='right'>
						<p>{wishlist.description}</p>
						<button onClick={handleFavoriteToggle} className='favorite-button'>
							{wishlist.is_favorite
								? 'Удалить из избранного'
								: 'Добавить в избранное'}
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

				{wishlist.items.length ? (
					<>
						<h3>Товары:</h3>
						<div className='product-list'>
							{(wishlist.items as any).map((item: any) => (
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
					</>
				) : (
					<></>
				)}

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
					<button onClick={handleAddComment}>Добавить комментарий</button>
				</div>
			</div>
		</>
	);
}
