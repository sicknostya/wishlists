import api from '../api';

class WishlistService {
	async getAllWishlists() {
		const response = await api.get('/wishlists/');
		return response.data;
	}

	async getMyWishlists() {
		const response = await api.get('/wishlists/my');
		return response.data;
	}

	async getFavoriteWishlists() {
		const response = await api.get('/wishlists/favorites');
		return response.data;
	}

	async getWishlist(id: string) {
		const response = await api.get(`/wishlists/${id}/`);
		return response.data;
	}

	async createWishlist(data: any) {
		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('description', data.description);
		formData.append('access_level', data.access_level);
		formData.append('image', data.image);

		const itemsClean = data.items.map((item: any, index: any) => {
			if (item.image) {
				formData.append(`item_images_${index}`, item.image);
			}
			return {
				name: item.name,
				description: item.description,
				link: item.link,
			};
		});

		formData.append('items', JSON.stringify(itemsClean));

		const response = await api.post('/wishlists/create/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return response.data;
	}

	async updateWishlist(id: string, data: any) {
		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('description', data.description);
		formData.append('access_level', data.access_level);
		if (data.image) formData.append('image', data.image);

		const serializedItems = data.items.map((item: any, index: any) => {
			const { name, description, link } = item;
			const newItem: any = { name, description, link };

			if (item.image) {
				formData.append(`item_images_${index}`, item.image);
				newItem.image_key = `item_images_${index}`;
			}

			return newItem;
		});

		formData.append('items', JSON.stringify(serializedItems));

		return api.put(`/wishlists/${id}/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	async getWishlistsByUser(username: string) {
		const res = await api.get(`/wishlists/user/${username}/`);
		return res.data;
	}

	async deleteWishlist(id: string) {
		return await api.delete(`/wishlists/${id}/`);
	}

	async addComment(wishlistId: string, text: string) {
		return api.post(`/wishlists/${wishlistId}/add_comment/`, { text });
	}

	async addToFavorite(wishlistId: string) {
		return api.post(`/wishlists/${wishlistId}/add_to_favorites/`);
	}

	async removeFromFavorite(wishlistId: string) {
		return api.post(`/wishlists/${wishlistId}/remove_from_favorites/`);
	}
}

const wishlistService = new WishlistService();

export default wishlistService;
