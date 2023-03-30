import { db } from "@Project/firebase";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";

interface IPersonalMessage {
	senderId: string;
	receiverId: string;
	message: string;
}

export const sendPersonalMessage = async ({ senderId, receiverId, message }: IPersonalMessage) => {
	await sendBuilder({ senderId, receiverId, message, senderStatus: true });
	await sendBuilder({ senderId, receiverId, message, senderStatus: false });
	// const senderRef = doc(db, `users/${senderId}/messages/${receiverId}`);
	// const snapSender = await getDoc(senderRef);
	// if (!snapSender.exists()) {
	// 	await setDoc(senderRef, { lastUpdate: serverTimestamp(), id: receiverId });
	// } else {
	// 	await updateDoc(senderRef, {
	// 		lastUpdate: serverTimestamp(),
	// 	});
	// }
	// await addDoc(collection(db, `users/${senderId}/messages/${receiverId}/data`), {
	// 	checked: true,
	// 	timestamp: serverTimestamp(),
	// 	message: message.trim(),
	// 	sender: true,
	// });

	// const receiverRef = doc(db, `users/${receiverId}/messages/${senderId}`);
	// const snapReceiver = await getDoc(receiverRef);
	// if (!snapReceiver.exists()) {
	// 	await setDoc(receiverRef, { lastUpdate: serverTimestamp(), id: senderId });
	// } else {
	// 	await updateDoc(receiverRef, {
	// 		lastUpdate: serverTimestamp(),
	// 	});
	// }
	// await addDoc(collection(db, `users/${receiverId}/messages/${senderId}/data`), {
	// 	checked: false,
	// 	timestamp: serverTimestamp(),
	// 	message: message.trim(),
	// 	sender: false,
	// });
};

interface ISendBuilder extends IPersonalMessage {
	senderStatus: boolean;
}

async function sendBuilder({ senderId, receiverId, message, senderStatus }: ISendBuilder) {
	const sender = senderStatus ? senderId : receiverId;
	const receiver = senderStatus ? receiverId : senderId;

	const userRef = doc(db, `users/${sender}/messages/${receiver}`);
	const snapUser = await getDoc(userRef);
	if (!snapUser.exists()) {
		await setDoc(userRef, { lastUpdate: serverTimestamp(), id: receiver });
	} else {
		await updateDoc(userRef, {
			lastUpdate: serverTimestamp(),
		});
	}
	const collectionRef = collection(db, `users/${sender}/messages/${receiver}/data`);
	await addDoc(collectionRef, {
		checked: senderStatus ? true : false,
		timestamp: serverTimestamp(),
		message: message.trim(),
		sender: senderStatus ? true : false,
	});
}
