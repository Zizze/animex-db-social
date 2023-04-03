import { db } from "@Project/firebase";
import { DocumentData, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export const getMessagesNotification = (
	userId: string,
	setNewMessages: Dispatch<SetStateAction<number>>
) => {
	const messCollectionQuery = query(collection(db, `users/${userId}/messages`));
	const unsubscribeMess = onSnapshot(messCollectionQuery, (messSnapshot) => {
		let promises: Promise<DocumentData>[] = [];
		messSnapshot.forEach((messDoc) => {
			const dataCollection = query(collection(messDoc.ref, "data"), where("checked", "==", false));
			const uncheckedMessDocs = getDocs(dataCollection);
			promises.push(uncheckedMessDocs);
		});

		Promise.all(promises).then((snapshots) => {
			let count = 0;
			snapshots.forEach((uncheckMessSnapshot) => {
				count += uncheckMessSnapshot.size;
			});
			setNewMessages(count);
		});
	});

	return () => unsubscribeMess();
};
