import { useAtom } from 'jotai';
import { searchQueryAtom } from '../../state/searchFilter';
import Header from '../../components/Header/Header';
import WishlistCard from '../../components/WishlistCard/WishlistCard';
import { Wishlist } from '../../interfaces';
import './WishlistPage.css';
import { useEffect, useState } from 'react';
import WishlistService from '../../api/wishlists/WishlistService';

export default function WishlistPage() {
	const [publicWishlists, setPublicWishlists] = useState<Wishlist[]>([]);
	const [myWishlists, setMyWishlists] = useState<Wishlist[]>([]);
	const [searchQuery] = useAtom(searchQueryAtom);

	useEffect(() => {
		const fetchWishlists = async () => {
			const [publicData, myData] = await Promise.all([
				WishlistService.getAllWishlists(), // /wishlists/
				WishlistService.getMyWishlists(), // /wishlists/my/
			]);
			setPublicWishlists(publicData);
			setMyWishlists(myData);
		};
		fetchWishlists();
	}, []);

	const filter = (wishlists: Wishlist[]) =>
		wishlists.filter(w =>
			w.title.toLowerCase().includes(searchQuery.toLowerCase())
		);

	return (
		<>
			<Header />
			<div className='wishlist-page'>
				<h1 className='wishlist-title'>Мои вишлисты</h1>
				<div className='wishlist-grid'>
					{filter(myWishlists).map(w => (
						<WishlistCard key={w.id} wishlist={w} />
					))}
				</div>

				<h1 className='wishlist-title'>Все вишлисты</h1>
				<div className='wishlist-grid'>
					{filter(publicWishlists).map(w => (
						<WishlistCard key={w.id} wishlist={w} />
					))}
				</div>
			</div>
		</>
	);
}
