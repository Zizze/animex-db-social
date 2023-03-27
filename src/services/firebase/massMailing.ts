import { db } from "@Project/firebase";
import {
	collection,
	doc,
	getDocs,
	getDoc,
	serverTimestamp,
	updateDoc,
	setDoc,
	addDoc,
} from "firebase/firestore";

interface IMassMailing {
	message: string;
	adminId: string;
}

export const massMailing = async ({ message, adminId }: IMassMailing) => {
	const usersRef = collection(db, "users");
	const usersSnapshot = await getDocs(usersRef);

	for (const userDoc of usersSnapshot.docs) {
		const userMessageDataRef = collection(userDoc.ref, "messages/AnimeX/data");
		const userMessageRef = doc(userDoc.ref, "messages/AnimeX");
		const getUserMessageDoc = await getDoc(userMessageRef);

		const data = {
			checked: false,
			message,
			sender: false,
			timestamp: serverTimestamp(),
		};

		try {
			getUserMessageDoc.exists()
				? await updateDoc(userMessageRef, { lastUpdate: serverTimestamp() })
				: await setDoc(userMessageRef, { lastUpdate: serverTimestamp() });

			await addDoc(userMessageDataRef, data);
		} catch (error) {
			console.log(`${userDoc.data().name}: ${error}`);
		}
	}
	await addDoc(collection(db, "adminsAction"), {
		type: "anonce",
		adminId: adminId,
		message,
		timestamp: serverTimestamp(),
	});
};
