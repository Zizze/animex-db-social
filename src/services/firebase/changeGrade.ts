import { db } from "@Project/firebase";
import { doc, runTransaction } from "firebase/firestore";

interface IChangeGrade {
	userId: string;
	gradeSelect: string;
	likesArray: string[];
	dislikedArray: string[];
}

export const changeGrade = async (
	path: string,
	{ userId, gradeSelect, likesArray, dislikedArray }: IChangeGrade
) => {
	if (!userId) return;
	const commentRef = doc(db, path);

	await runTransaction(db, async (transaction) => {
		const hasLiked = likesArray.includes(userId);
		const hasDisliked = dislikedArray.includes(userId);

		if (gradeSelect === "like") {
			if (!hasLiked) {
				transaction.update(commentRef, { likes: [...likesArray, userId] });
				if (hasDisliked) {
					transaction.update(commentRef, {
						dislikes: dislikedArray.filter((userId: string) => userId !== userId),
					});
				}
			} else {
				transaction.update(commentRef, {
					likes: likesArray.filter((userId: string) => userId !== userId),
				});
			}
		} else if (gradeSelect === "dislike") {
			if (!hasDisliked) {
				transaction.update(commentRef, { dislikes: [...dislikedArray, userId] });
				if (hasLiked) {
					transaction.update(commentRef, {
						likes: likesArray.filter((userId: string) => userId !== userId),
					});
				}
			} else {
				transaction.update(commentRef, {
					dislikes: dislikedArray.filter((userId: string) => userId !== userId),
				});
			}
		}
	});
};
