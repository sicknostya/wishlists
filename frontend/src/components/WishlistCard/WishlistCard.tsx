// components/WishlistCard.tsx
import { useNavigate } from 'react-router-dom';
import { Wishlist, WishlistItem } from '../../interfaces';
import './WishlistCard.css';

interface IWishlistCardProps {
	wishlist: Wishlist;
}

export default function WishlistCard({ wishlist }: IWishlistCardProps) {
	const navigate = useNavigate();
	const { id, title, description, image, comments, user } = wishlist;

	const handleClick = () => {
		navigate(`/wishlists/${id}`);
	};

	return (
		<div
			className='wishlist-card'
			onClick={handleClick}
			style={{ cursor: 'pointer' }}
		>
			{image && <img src={image} alt={title} className='wishlist-card-image' />}
			<div className='wishlist-card-content'>
				<h3 className='wishlist-card-title'>{title}</h3>
				<p className='wishlist-card-description'>{description}</p>
				<p className='wishlist-card-author'>Автор: {user}</p>
				<p className='wishlist-card-comments'>
					Комментариев: {comments.length}
				</p>
			</div>
		</div>
	);
}
