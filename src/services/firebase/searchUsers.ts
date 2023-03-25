import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";
import { db } from "@Project/firebase";
import { collection, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore";

export const searchUsers = (
	searchTxt: string,
	func: (searchData: IUserFirebase[]) => void,
	userId: string
) => {
	const q = query(
		collection(db, "users"),
		where("name_lowercase", ">=", searchTxt.toLowerCase()),
		where("name_lowercase", "<=", searchTxt.toLowerCase() + "\uf8ff"),
		orderBy("name_lowercase"),
		startAt(searchTxt.toLowerCase()),
		endAt(searchTxt.toLowerCase() + "\uf8ff")
	);

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const searchData: IUserFirebase[] = [];
		querySnapshot.forEach((doc) => {
			if (doc.id === userId) return;
			searchData.push(doc.data() as IUserFirebase);
		});

		func(searchData);
	});

	return () => unsubscribe();
};
