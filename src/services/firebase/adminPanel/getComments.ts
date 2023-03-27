import { ICommentFirebase } from "@/types/types";
import { db } from "@Project/firebase";
import { useCallback } from "react";
import {
	collectionGroup,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	DocumentData,
	getDocs,
	QueryDocumentSnapshot,
} from "firebase/firestore";

export interface IAdminPanelCommReturn {
	lastDoc: QueryDocumentSnapshot<DocumentData>;
	comments: ICommentFirebase[];
	isLastData: boolean;
}

export const getComments = () => {
	const getAllComments = (func: (data: IAdminPanelCommReturn) => void) => {
		const commentsRef = collectionGroup(db, "dataAnime");
		const q = query(commentsRef, orderBy("timestamp", "desc"), limit(10));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const comments = snapshot.docs.map((doc) => {
				return {
					...(doc.data() as ICommentFirebase),
					commentId: doc.id,
					docRef: doc.ref,
				};
			});

			const finalData = {
				lastDoc: snapshot.docs[snapshot.docs.length - 1],
				comments: comments,
				isLastData: comments.length < 10,
			};
			func(finalData);
		});

		return unsubscribe;
	};

	const loadMoreComments = async (lastDoc: QueryDocumentSnapshot<DocumentData> | null) => {
		if (!lastDoc) return;
		const commentsQ = query(
			collectionGroup(db, "dataAnime"),
			orderBy("timestamp", "desc"),
			startAfter(lastDoc),
			limit(10)
		);
		const getCommentsDocs = await getDocs(commentsQ);

		const comments = getCommentsDocs.docs.map((doc) => {
			return { ...(doc.data() as ICommentFirebase), commentId: doc.id, docRef: doc.ref };
		});

		return {
			lastDoc: getCommentsDocs.docs[getCommentsDocs.docs.length - 1],
			comments: comments,
			isLastData: comments.length < 10,
		};
	};

	return {
		getAllComments,
		loadMoreComments,
	};
};
