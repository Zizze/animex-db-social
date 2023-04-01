import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

export interface IAnimeFirebase {
	personalRate?: number;
	mal_id: string | number;
	title: string;
	score: string | number;
	episodes: string | number;
	animeState: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
	};
}

export interface IUserFirebase {
	id: string;
	name: string;
	photoURL: string;
	name_lowercase: string;
	settings?: IUserSettingsFirebase;
	access?: number;
	blocked?: IUserBannedFirebase;
}
export interface IUserSettingsFirebase {
	messages: string | boolean;
	friends: string | boolean;
	profile: string | boolean;
}

export interface IUserBannedFirebase {
	startBan: Timestamp;
	endBan: Timestamp;
	adminId: string;
	message: string;
}

export interface IFriendFirebase {
	confirmator: boolean;
	friend: boolean;
	id?: number | string;
}

export interface IMainChatFirebase {
	message: string;
	docId: string;
	id: string;
	timestamp: number | string;
	author?: IUserFirebase;
	answer?: string[];
}

export interface IMessageFirebase {
	checked: boolean;
	timestamp: Timestamp;
	message: string;
	sender: boolean;
	messageId?: string;
}

export interface ICommentFirebase {
	id: string;
	message: null;
	timestamp: Timestamp;
	commentId?: number | string;
	spoiler: boolean;
	docRef?: DocumentReference<DocumentData>;
	animeId: string | number;
	likes: string[];
	dislikes: string[];
	docId: string;
}

export interface IAdminActionFirebase {
	type: "anonce" | "block" | "unblock" | "delete" | "access";
	adminId: string;
	userId?: string;
	message?: string;
	timestamp: Timestamp;
	timestampEnd?: Timestamp;
	access?: number;
	page?: string;
}

export interface ISupportFirebase {
	title: string;
	userId: string;
	message: string;
	timestamp: Timestamp;
	email: string;
	closed: boolean;
	answers?: ISupportAnswerFirebase[];
	docId: string;
}

export interface ISupportAnswerFirebase {
	adminId: string;
	message: string;
	timestamp: Timestamp;
}
