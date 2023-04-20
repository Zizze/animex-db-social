import { storage } from "@Project/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

export const uploadFilesInStorage = async (file: File, fileName: string) => {
	if (!file) return;

	const storageRef = ref?.(storage, `files/${fileName}`);
	const uploadTask = uploadBytesResumable(storageRef, file);
	uploadTask.on(
		"state_changed",
		(snapshot) => {
			switch (snapshot.state) {
				case "paused":
					// setIsLoading(false);
					break;
				case "running":
					// setIsLoading(true);
					break;
			}
		},
		(error) => {
			// popError("Error upload files.");
		}
	);
};
