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
