import { FC, FormEvent, useState, useEffect } from "react";
import classes from "./Comments.module.scss";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import { useAuthContext } from "@/context/useAuthContext";
import {
	addDoc,
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	serverTimestamp,
	setDoc,
	startAfter,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { onSnapshot } from "firebase/firestore";
import { ICommentFirebase } from "@/types/types";
import Comment from "./comment/Comment";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Checkbox from "@Components/UI/checkbox/Checkbox";

interface IProps {
	animeId: number;
}

const Comments: FC<IProps> = ({ animeId }) => {
	const [lastVisibleData, setLastVisibleData] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [isLastData, setIsLastData] = useState<boolean>();
	const [comments, setComments] = useState<ICommentFirebase[]>([]);
	const [commentTxt, setCommentTxt] = useState("");
	const { user } = useAuthContext();
	const [spoiler, setSpoiler] = useState<boolean | string>(false);

	const [pressHide, setPressHide] = useState(true);

	useEffect(() => {
		if (!pressHide) return;
		const q = query(
			collection(db, `comments/${animeId}/dataAnime`),
			orderBy("timestamp", "desc"),
			limit(10)
		);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const comm: ICommentFirebase[] = [];

			querySnapshot.forEach((doc) => {
				const timestamp = doc.data().timestamp && doc.data().timestamp.seconds;
				comm.push({
					...(doc.data() as ICommentFirebase),
					commentId: doc.id,
					timestamp,
				});
			});
			setComments(comm);
			setLastVisibleData(querySnapshot.docs[querySnapshot.docs.length - 1]);
			setIsLastData(comm.length < 10);
		});

		return () => unsubscribe();
	}, [user, pressHide]);

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!user || commentTxt.trim() === "") return;

		await addDoc(collection(db, `comments/${animeId}/dataAnime`), {
			id: user.uid,
			timestamp: serverTimestamp(),
			message: commentTxt.trim(),
			spoiler: !!spoiler,
			animeId,
			likes: [],
			dislikes: [],
		});

		const docRef = doc(db, `comments/${animeId}`);
		const snapshot = await getDoc(docRef);
		if (!snapshot.exists()) {
			await setDoc(docRef, {
				id: animeId,
			});
		}

		setSpoiler(false);
		setPressHide(true);
		setCommentTxt("");
	};

	const onClickMore = async () => {
		if (!lastVisibleData) return;
		if (!lastVisibleData) return;
		const q = query(
			collection(db, `comments/${animeId}/dataAnime`),
			orderBy("timestamp", "desc"),
			startAfter(lastVisibleData),
			limit(10)
		);
		const querySnapshot = await getDocs(q);
		const comm: ICommentFirebase[] = [];
		querySnapshot.forEach((doc) => {
			const timestamp = doc.data().timestamp && doc.data().timestamp.seconds;
			comm.push({
				...(doc.data() as ICommentFirebase),
				commentId: doc.id,
				timestamp,
			});
		});
		setComments((prev) => [...prev, ...comm]);
		setLastVisibleData(querySnapshot.docs[querySnapshot.docs.length - 1]);
		setIsLastData(comm.length < 10);
		setPressHide(false);
	};

	const onChangeSpoilerCheckbox = (name: string) => {
		spoiler === name ? setSpoiler(false) : setSpoiler(name);
	};

	return (
		<div className={classes.wrapper}>
			<TextAreaForm
				onSubmitHandler={onSubmitHandler}
				text={commentTxt}
				setText={setCommentTxt}
				placeholder="Your comment..."
				classes={{ cnForm: classes.textForm }}
			/>
			{commentTxt.length > 0 && (
				<Checkbox
					name="Is your comment a spoiler?"
					onChangeHandler={onChangeSpoilerCheckbox}
					id="SpoilerChekbox"
					clear={!spoiler ? "clear" : ""}
					classnames={classes.spoilerCheckbox}
				/>
			)}
			<ul className={classes.comments}>
				{comments.map((comment) => (
					<Comment
						comment={comment}
						key={comment.id + comment.commentId}
						setCommentTxt={setCommentTxt}
						animeId={animeId}
					/>
				))}
			</ul>
			<div className={classes.btns}>
				{!isLastData && (
					<DefaultBtn
						classMode="clear"
						title="More comments"
						className={classes.moreBtn}
						onClickHandler={() => onClickMore()}
					>
						More comments
					</DefaultBtn>
				)}
				{comments.length > 10 && (
					<DefaultBtn
						classMode="clear"
						title="Hide comments"
						className={classes.hideBtn}
						onClickHandler={() => setPressHide(true)}
					>
						Hide comments
					</DefaultBtn>
				)}
			</div>
		</div>
	);
};

export default Comments;
