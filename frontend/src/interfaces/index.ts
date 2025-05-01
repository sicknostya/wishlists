export interface Wishlist {
	id: string;
	title: string;
	description: string;
	image: any;
	comments: IWishlistComment[];
	items?: WishlistItem[] | any;
	items_data?: any;
	access_level: AccessLevel;
	user: string;
	is_favorite: boolean;
}

export interface IFriend {
	id: string;
	username: string;
}

export interface IMyUserData {
	username: string;
	email: string;
}

export type AccessLevel = 'public' | 'private' | 'link';

export interface IWishlistComment {
	author: string;
	text: string;
	date: string;
}

export interface WishlistItem {
	name: string;
	description: string;
	link: string;
	image: any;
}
