// src/pages/WishlistEdit/WishlistEdit.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './WishlistEdit.css';
import WishlistService from '../../api/wishlists/WishlistService';
import { AccessLevel } from '../../interfaces';
import Header from '../../components/Header/Header';
import { BASE_URL } from '../../api/api';

const WishlistEdit: React.FC = () => {
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [access, setAccess] = useState<AccessLevel>('public');
	const [items, setItems] = useState<
		{
			name: string;
			description: string;
			link: string;
			image: File | null;
			previewImage?: string;
		}[]
	>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const data = await WishlistService.getWishlist(id as string);
				setTitle(data.title);
				setDescription(data.description);
				setAccess(data.access_level);
				setPreviewImage(data.image);

				console.log('ITEMS', data.items);

				setItems(
					data.items.map((item: any) => ({
						name: item.name,
						description: item.description,
						link: item.link,
						image: null,
						previewImage: `${BASE_URL}/${item.image}`,
					}))
				);
			} catch (err) {
				alert('Ошибка при загрузке вишлиста');
				navigate('/wishlists');
			}
		};

		fetchWishlist();
	}, [id, navigate]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
			setPreviewImage(URL.createObjectURL(e.target.files[0]));
		}
	};

	const handleItemChange = (
		index: number,
		field: string,
		value: string | File | null
	) => {
		const updatedItems = [...items];
		if (field === 'image') {
			updatedItems[index].image = value as File;
			updatedItems[index].previewImage = value
				? URL.createObjectURL(value as File)
				: undefined;
		} else {
			updatedItems[index][field as keyof (typeof updatedItems)[number]] =
				value as any;
		}
		setItems(updatedItems);
	};

	const handleAddItem = () => {
		setItems([...items, { name: '', description: '', link: '', image: null }]);
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = items.filter((_, i) => i !== index);
		setItems(updatedItems);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await WishlistService.updateWishlist(id as string, {
				title,
				description,
				access_level: access,
				image,
				items,
			});
			alert('Вишлист обновлён!');
			navigate('/wishlists');
		} catch (error: any) {
			console.error('Ошибка:', error.response?.data || error.message);
			alert('Ошибка при обновлении вишлиста');
		}
	};

	return (
		<>
			<Header />
			<div className='wishlist-create-container'>
				<div className='wishlist-create-block'>
					<h2>Редактировать вишлист</h2>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='title'>Название</label>
							<input
								type='text'
								id='title'
								value={title}
								onChange={e => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='description'>Описание</label>
							<textarea
								id='description'
								value={description}
								onChange={e => setDescription(e.target.value)}
								required
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='access'>Доступ</label>
							<select
								id='access'
								value={access}
								onChange={e => setAccess(e.target.value as AccessLevel)}
							>
								<option value='public'>Публичный</option>
								<option value='private'>Приватный</option>
								<option value='link'>По ссылке</option>
							</select>
						</div>
						<div className='form-group'>
							<label htmlFor='image'>Изображение</label>
							<input
								type='file'
								id='image'
								accept='image/*'
								onChange={handleImageChange}
							/>
						</div>

						{previewImage && (
							<img src={previewImage} alt='Превью' className='image-preview' />
						)}

						<h3>Товары</h3>
						{items.map((item, index) => (
							<div key={index} className='item-block'>
								<input
									type='text'
									placeholder='Название товара'
									value={item.name}
									onChange={e =>
										handleItemChange(index, 'name', e.target.value)
									}
									required
								/>
								<input
									type='text'
									placeholder='Описание товара'
									value={item.description}
									onChange={e =>
										handleItemChange(index, 'description', e.target.value)
									}
									required
								/>
								<input
									type='url'
									placeholder='Ссылка на магазин'
									value={item.link}
									onChange={e =>
										handleItemChange(index, 'link', e.target.value)
									}
									required
								/>
								<div className='item-image-wrapper'>
									{item.previewImage ? (
										<img
											src={item.previewImage}
											alt={`Товар ${index + 1}`}
											className='item-image-preview'
										/>
									) : (
										<div className='item-image-placeholder'>Изображение</div>
									)}
									<input
										type='file'
										accept='image/*'
										className='file-input'
										onChange={e =>
											handleItemChange(
												index,
												'image',
												e.target.files?.[0] || null
											)
										}
									/>
								</div>
								<button
									type='button'
									onClick={() => handleRemoveItem(index)}
									className='remove-btn'
								>
									Удалить
								</button>
							</div>
						))}

						<button type='button' onClick={handleAddItem} className='add-btn'>
							+ Добавить товар
						</button>

						<button type='submit' className='primary-btn'>
							Сохранить
						</button>
					</form>
					<button
						type='button'
						onClick={() => navigate('/wishlists')}
						className='secondary-btn'
					>
						Назад
					</button>
				</div>
			</div>
		</>
	);
};

export default WishlistEdit;
