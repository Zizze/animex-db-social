import { db } from "@Project/firebase";
import { collection, where, getDocs, query } from "firebase/firestore";

export const checkExistingUser = async (name: string, email: string): Promise<string | null> => {
	const usersRef = collection(db, "users");
	const usersNameQuery = query(usersRef, where("name_lowercase", "==", name.toLowerCase()));
	const usersEmailQuery = query(usersRef, where("email", "==", email.toLowerCase()));

	const emailSnap = await getDocs(usersEmailQuery);
	const nameSnap = await getDocs(usersNameQuery);

	if (!emailSnap.empty && !nameSnap.empty) {
		return "The name and email address already exists";
	}
	if (!emailSnap.empty) {
		return "The email address already exists";
	}
	if (!nameSnap.empty) {
		return "The name already exists";
	}
	return null;
};
