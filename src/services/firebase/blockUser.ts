import { db } from "@Project/firebase";
import { doc, serverTimestamp, updateDoc, addDoc, collection, Timestamp } from "firebase/firestore";

interface IBlockUser {
	currUserId: string;
	endBan: Timestamp;
	message: string;
	adminId: string;
}

export const blockUser = async ({ currUserId, endBan, message, adminId }: IBlockUser) => {
	try {
		await updateDoc(doc(db, `users/${currUserId}`), {
			blocked: {
				startBan: serverTimestamp(),
				endBan,
				adminId: adminId,
				message: message,
			},
		});
		await addDoc(collection(db, "adminsAction"), {
			type: "block",
			adminId: adminId,
			userId: currUserId,
			message: message,
			timestamp: serverTimestamp(),
			timestampEnd: endBan,
		});

		return true;
	} catch (err) {
		return false;
	}
};
