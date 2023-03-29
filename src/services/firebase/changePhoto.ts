import { auth, db, storage } from "@Project/firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Dispatch, SetStateAction } from "react";

interface IChangePhoto {
	userId: string;
	file: File;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	popSuccess: (mess: string, duration?: number) => void;
	popError: (mess: string, duration?: number) => void;
	setFile: Dispatch<SetStateAction<File | null>>;
}

export const changeProfilePhoto = ({
	userId,
	setIsLoading,
	popSuccess,
	popError,
	file,
	setFile,
}: IChangePhoto) => {
	const userDataRef = doc(db, `users/${userId}`);

	const storageRef = ref?.(storage, `avatars/${userId}`);
	const uploadTask = uploadBytesResumable(storageRef, file);
	uploadTask.on(
		"state_changed",
		(snapshot) => {
			switch (snapshot.state) {
				case "paused":
					setIsLoading(false);
					break;
				case "running":
					setIsLoading(true);
					break;
			}
		},
		(error) => {
			popError("Error upload image.");
		},
		() => {
			getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
				if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: downloadURL });
				await updateDoc(userDataRef, { photoURL: downloadURL });

				popSuccess("Success upload image.");
				setFile(null);
				setIsLoading(false);
			});
		}
	);
};
