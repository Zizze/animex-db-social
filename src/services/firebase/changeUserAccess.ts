import { db } from "@Project/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

interface IChangeUserAccess {
	adminId: string;
	userId: string;
	accessSelected: number;
}

export const changeUserAccess = async ({ adminId, userId, accessSelected }: IChangeUserAccess) => {
	try {
		await updateDoc(doc(db, `users/${userId}`), { access: accessSelected });
		await addDoc(collection(db, "adminsAction"), {
			type: "access",
			adminId,
			userId,
			timestamp: serverTimestamp(),
			access: accessSelected,
		});

		return true;
	} catch {
		return false;
	}
};
