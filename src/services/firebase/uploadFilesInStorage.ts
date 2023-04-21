import { IFileFirebase } from "@/types/types";
import { storage } from "@Project/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const uploadFilesInStorage = async (
	file: File,
	fileName: string
): Promise<IFileFirebase | undefined> => {
	if (!file) return;

	const storageRef = ref?.(storage, `files/${fileName}`);
	const uploadTask = uploadBytesResumable(storageRef, file);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				// switch (snapshot.state) {
				// case "paused":
				// 	break;
				// case "running":
				// }
			},
			(error) => {
				reject("Error upload files.");
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref)
					.then((downloadURL) => {
						resolve({ downloadURL, name: file.name, type: file.type });
					})
					.catch((error) => {
						reject("Error getting download URL.");
					});
			}
		);
	});
};
