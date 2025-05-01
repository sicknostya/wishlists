import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FriendsPage.css';
import BackButton from '../../components/BackButton/BackButton';
import UserService from '../../api/user/UserService';
import { IFriend } from '../../interfaces';
import Header from '../../components/Header/Header';

export default function FriendsPage() {
	const [friends, setFriends] = useState<IFriend[] | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const res = await UserService.getUserFriends();
				console.log('res', res);

				setFriends(res);
			} catch (err) {
				console.error('Ошибка загрузки друзей:', err);
			}
		};

		fetchFriends();
	}, []);

	return (
		<>
			<Header />
			<BackButton />
			<div className='friends-page'>
				<h1 className='friends-title'>Мои друзья</h1>
				<div className='friends-list'>
					{friends?.length &&
						friends.map(friend => (
							<div
								key={friend.id}
								className='friend-card'
								onClick={() => navigate(`/user/${friend.username}`)}
							>
								<span className='friend-name'>{friend.username}</span>
							</div>
						))}
				</div>
			</div>
		</>
	);
}
