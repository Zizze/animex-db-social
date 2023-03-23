import { FC, useState, useEffect } from "react";
import classes from "./AllComments.module.scss";

import { useAuthContext } from "@/context/useAuthContext";
import {
	collectionGroup,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { onSnapshot } from "firebase/firestore";
import { ICommentFirebase } from "@/types/types";
import Comment from "./comment/Comment";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";

const AllComments: FC = () => {
	const [lastVisibleData, setLastVisibleData] =
		useState<QueryDocumentSnapshot<DocumentData> | null>();
	const [isLastData, setIsLastData] = useState<boolean>();
	const [comments, setComments] = useState<ICommentFirebase[]>([]);

	const { user } = useAuthContext();
	const [pressHide, setPressHide] = useState(false);

	useEffect(() => {
		const commentsRef = collectionGroup(db, "dataAnime");
		const q = query(commentsRef, orderBy("timestamp", "desc"), limit(10));

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const comments = snapshot.docs.map((doc) => {
				const timestamp = doc.data().timestamp && doc.data().timestamp.seconds;
				return {
					...(doc.data() as ICommentFirebase),
					commentId: doc.id,
					timestamp,
					docRef: doc.ref,
				};
			});

			setLastVisibleData(snapshot.docs[snapshot.docs.length - 1]);
			setComments(comments);
			setIsLastData(comments.length < 10);
		});

		return unsubscribe;
	}, [user, pressHide]);

	const loadMoreComments = async () => {
		if (!user) return;

		const commentsQ = query(
			collectionGroup(db, "dataAnime"),
			orderBy("timestamp", "desc"),
			startAfter(lastVisibleData),
			limit(10)
		);
		const getCommentsDocs = await getDocs(commentsQ);

		const comments = getCommentsDocs.docs.map((doc) => {
			const timestamp = doc.data().timestamp && doc.data().timestamp.seconds;
			return { ...(doc.data() as ICommentFirebase), commentId: doc.id, timestamp, docRef: doc.ref };
		});

		setLastVisibleData(getCommentsDocs.docs[getCommentsDocs.docs.length - 1]);
		setComments((prev) => [...prev, ...comments]);
		setIsLastData(comments.length < 10);
	};

	return (
		<div className={classes.wrapper}>
			<h6 className={classes.title}>All anime coments</h6>
			<ul className={classes.comments}>
				{comments.map((comment) => (
					<Comment comment={comment} key={comment.id + comment.commentId} />
				))}
			</ul>
			<div className={classes.btns}>
				{!isLastData && (
					<DefaultBtn
						classMode="clear"
						title="More comments"
						className={classes.moreBtn}
						onClickHandler={loadMoreComments}
					>
						More comments
					</DefaultBtn>
				)}
				{comments.length > 10 && (
					<DefaultBtn
						classMode="clear"
						title="Hide comments"
						className={classes.hideBtn}
						onClickHandler={() => setPressHide((prev) => !prev)}
					>
						Hide comments
					</DefaultBtn>
				)}
			</div>
		</div>
	);
};

export default AllComments;
