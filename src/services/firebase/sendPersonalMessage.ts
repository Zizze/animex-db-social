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
	files: { name: string; type: string; id: string }[];
}

export const sendPersonalMessage = async ({
	senderId,
	receiverId,
	message,
	files,
}: IPersonalMessage) => {
	await sendBuilder({ senderId, receiverId, message, senderStatus: true, files });
	await sendBuilder({ senderId, receiverId, message, senderStatus: false, files });
};

interface ISendBuilder extends IPersonalMessage {
	senderStatus: boolean;
}

async function sendBuilder({ senderId, receiverId, message, senderStatus, files }: ISendBuilder) {
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
		files,
	});
}
