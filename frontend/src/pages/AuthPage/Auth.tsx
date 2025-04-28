import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { login, register } from '../../api/auth/authService';

const Auth: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между входом и регистрацией
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await login(username, email, password);
		console.log('result', result);

		if (result) {
			navigate('/wishlists');
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await register(username, email, password);
		console.log('result', result);

		if (result) {
			setIsLogin(true);
			await handleLogin(e);
		}
	};

	const toggleForm = () => {
		setIsLogin(!isLogin);
		setUsername('');
		setEmail('');
		setPassword('');
	};

	return (
		<div className='auth-container'>
			<div className='auth-block'>
				<h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
				<form onSubmit={isLogin ? handleLogin : handleRegister}>
					<div className='auth-form-group'>
						<label htmlFor='username'>Username</label>
						<input
							type='text'
							id='username'
							value={username}
							onChange={e => setUsername(e.target.value)}
							placeholder='Введите username'
							required
						/>
					</div>
					<div className='auth-form-group'>
						<label htmlFor='email'>Email</label>
						<input
							type='text'
							id='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder='Введите email'
							required
						/>
					</div>
					<div className='auth-form-group'>
						<label htmlFor='password'>Пароль</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder='Введите пароль'
							required
						/>
					</div>
					<button type='submit'>
						{isLogin ? 'Войти' : 'Зарегистрироваться'}
					</button>
					<p>
						{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
						<a href='#' onClick={toggleForm}>
							{isLogin ? 'Регистрация' : 'Войти'}
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Auth;
