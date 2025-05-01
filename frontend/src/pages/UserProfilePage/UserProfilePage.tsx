import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import wishlistService from '../../api/wishlists/WishlistService';
import UserService from '../../api/user/UserService';
import WishlistCard from '../../components/WishlistCard/WishlistCard';
import { Wishlist } from '../../interfaces';
import './UserProfilePage.css';
import BackButton from '../../components/BackButton/BackButton';

export default function UserProfilePage() {
	const { username } = useParams();
	const [wishlists, setWishlists] = useState<Wishlist[]>([]);
	const [userInfo, setUserInfo] = useState<{
		id: number;
		username: string;
	} | null>(null);
	const [isFriend, setIsFriend] = useState(false);

	useEffect(() => {
		if (!username) return;

		const fetchData = async () => {
			try {
				const user = await UserService.getUserInfo(username);
				setUserInfo(user);

				const wishlistsRes = await wishlistService.getWishlistsByUser(username);
				setWishlists(wishlistsRes);

				const friendStatus = await UserService.isFriend(user.id);
				setIsFriend(friendStatus.is_friend);
			} catch (error) {
				console.error('Ошибка при загрузке профиля:', error);
			}
		};

		fetchData();
	}, [username]);

	const handleFriendToggle = async () => {
		if (!userInfo) return;

		try {
			if (isFriend) {
				await UserService.removeFriend(userInfo.id);
			} else {
				await UserService.addFriend(userInfo.id);
			}
			setIsFriend(!isFriend);
		} catch (error) {
			console.error('Ошибка при смене статуса друга:', error);
		}
	};

	return (
		<>
			<Header />
			<BackButton />
			<div className='user-profile-page'>
				<h1 className='user-profile-title'>Профиль: {username}</h1>

				{userInfo && (
					<button
						onClick={handleFriendToggle}
						className='user-profile-friend-button'
					>
						{isFriend ? 'Удалить из друзей' : 'Добавить в друзья'}
					</button>
				)}

				<h2 className='user-profile-subtitle'>Вишлисты:</h2>
				<div className='user-profile-grid'>
					{wishlists.map(w => (
						<WishlistCard key={w.id} wishlist={w} />
					))}
				</div>
			</div>
		</>
	);
}
