import { db } from "@Project/firebase";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export const getMessagesNotification = (
	userId: string,
	setNewMessages: Dispatch<SetStateAction<number>>
) => {
	const messCollectionQuery = query(collection(db, `users/${userId}/messages`));
	const unsubscribeMess = onSnapshot(messCollectionQuery, async (messSnapshot) => {
		let count = 0;
		for (const messDoc of messSnapshot.docs) {
			const dataCollection = query(collection(messDoc.ref, "data"), where("checked", "==", false));
			const uncheckedMessDocs = await getDocs(dataCollection);
			count += uncheckedMessDocs.size;
		}
		setNewMessages(count);
	});
	return () => unsubscribeMess();
};
