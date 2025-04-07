import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './WishlistCreate.css';

const WidgetCreate: React.FC = () => {
	const [text, setText] = useState<string>('');
	const [image, setImage] = useState<File | null>(null);
	const [link, setLink] = useState<string>('');
	const token = localStorage.getItem('token');
	const navigate = useNavigate();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!image) {
			alert('Пожалуйста, выберите изображение');
			return;
		}

		const formData = new FormData();
		formData.append('text', text);
		formData.append('image', image);
		formData.append('link', link);

		try {
			await axios.post('http://localhost:8000/api/wishlists/', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			alert('Элемент вишлиста создан');
			navigate('/wishlists');
		} catch (error: any) {
			console.error('Ошибка:', error.response?.data || error.message);
			alert('Ошибка при создании элемента');
		}
	};

	return (
		<div className='widget-create-container'>
			<div className='widget-create-block'>
				<h2>Создать элемент вишлиста</h2>
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='text'>Описание</label>
						<textarea
							id='text'
							placeholder='Описание подарка'
							value={text}
							onChange={e => setText(e.target.value)}
							required
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='image'>Изображение</label>
						<input
							type='file'
							id='image'
							accept='image/*'
							onChange={handleImageChange}
							required
						/>
					</div>
					{image && (
						<img
							src={URL.createObjectURL(image)}
							alt='Предпросмотр'
							className='image-preview'
						/>
					)}
					<div className='form-group'>
						<label htmlFor='link'>Ссылка на интернет-магазин</label>
						<input
							type='url'
							id='link'
							placeholder='URL магазина'
							value={link}
							onChange={e => setLink(e.target.value)}
							required
						/>
					</div>
					<button type='submit'>Создать</button>
				</form>
				<button
					type='button'
					onClick={() => navigate('/wishlists')}
					className='back-button'
				>
					Назад
				</button>
			</div>
		</div>
	);
};

export default WidgetCreate;
