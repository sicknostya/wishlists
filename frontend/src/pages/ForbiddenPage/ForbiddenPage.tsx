import React from 'react';
import { Link } from 'react-router-dom';
import './ForbiddenPage.css';

export default function ForbiddenPage() {
	return (
		<div className='forbidden-container'>
			<h1 className='forbidden-title'>403 – Доступ запрещён</h1>
			<p className='forbidden-message'>
				У вас нет прав для просмотра этой страницы.
			</p>
			<Link to='/wishlists' className='forbidden-link'>
				Вернуться на главную
			</Link>
		</div>
	);
}
