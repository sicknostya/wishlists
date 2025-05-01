import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { searchQueryAtom } from '../../state/searchFilter';
import './Header.css';

export default function Header() {
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);
	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

	const handleToMain = () => {
		navigate('/wishlists');
	};

	const handleAddGift = () => {
		navigate('/wishlist-create');
	};

	const handleToFriends = () => {
		navigate('/friends');
	};

	const handleToProfile = () => {
		navigate('/profile');
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate('/login');
	};

	return (
		<header className='header'>
			<div className='header-left' onClick={handleToMain}>
				<span role='img' aria-label='logo' className='header-logo'>
					🎁
				</span>
				<span className='header-brand'>Вишлистс</span>
			</div>

			<div className='header-center'>
				<button className='header-add-button' onClick={handleAddGift}>
					Добавить подарок
				</button>
				<button className='header-friends-button' onClick={handleToFriends}>
					Друзья
				</button>
			</div>

			<div className='header-right'>
				<input
					type='text'
					placeholder='Поиск'
					className='header-search'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<div className='profile-icon' onClick={() => setShowMenu(!showMenu)}>
					<span className='header-icon'>👤</span>
					{showMenu && (
						<div className='dropdown-menu'>
							<button onClick={handleToProfile}>Профиль</button>
							<button onClick={handleLogout}>Выйти</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
