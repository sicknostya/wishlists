import api from '../api';

const UserService = {
	async getUserInfo(username: string) {
		const res = await api.get(`/user/${username}/`);
		return res.data;
	},

	async getUserFriends() {
		const res = await api.get('/friends/');
		return res.data;
	},

	async isFriend(userId: number) {
		const res = await api.get(`/friends/${userId}/is_friend/`);
		return res.data;
	},

	async addFriend(userId: number) {
		return await api.post(`/friends/${userId}/add/`);
	},

	async removeFriend(userId: number) {
		return await api.post(`/friends/${userId}/remove/`);
	},
};

export default UserService;
