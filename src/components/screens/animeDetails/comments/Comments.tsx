import { FC, FormEvent, useState, useEffect } from "react";
import classes from "./Comments.module.scss";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import { useAuthContext } from "@/context/useAuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@Project/firebase";

import { ICommentFirebase } from "@/types/types";
import Comment from "./comment/Comment";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Checkbox from "@Components/UI/checkbox/Checkbox";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import Loading from "@Components/UI/loading/Loading";
import { popMessage } from "@/utils/popMessage/popMessage";

const COMMENTS_LIMIT = 10;

const Comments: FC<{ animeId: number }> = ({ animeId }) => {
	const { popError, popSuccess, ctxMessage } = popMessage();
	const [commentTxt, setCommentTxt] = useState("");
	const { user } = useAuthContext();
	const [spoiler, setSpoiler] = useState<boolean | string>(false);

	const {
		data: comments,
		isLastDocs,
		isLoading,
		error,
		loadMoreData,
		onReload,
	} = useCollectionRealtime<ICommentFirebase>(`comments/${animeId}/dataAnime`, {
		orderBy: ["timestamp", "desc"],
		limit: COMMENTS_LIMIT,
	});

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!user || !commentTxt.trim().length) return;
		try {
			await addDoc(collection(db, `comments/${animeId}/dataAnime`), {
				id: user.uid,
				timestamp: serverTimestamp(),
				message: commentTxt.trim(),
				spoiler: !!spoiler,
				animeId,
				likes: [],
				dislikes: [],
			});

			setCommentTxt("");
			spoiler && setSpoiler(false);
			popSuccess("Comment added.");
		} catch {
			popError("Error adding comment.");
		}
	};

	const onChangeSpoilerCheckbox = (name: string) => {
		spoiler === name ? setSpoiler(false) : setSpoiler(name);
	};

	useEffect(() => {
		if (error) {
			popError("Error loading comments.");
		}
	}, [error]);

	return (
		<div className={classes.wrapper}>
			{ctxMessage}
			{isLoading && <Loading />}
			{user && (
				<TextAreaForm
					onSubmitHandler={onSubmitHandler}
					text={commentTxt}
					setText={setCommentTxt}
					placeholder="Your comment..."
					classes={{ cnForm: classes.textForm }}
				/>
			)}
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
				{comments?.map((comment) => (
					<Comment
						comment={comment}
						key={comment.docId}
						setCommentTxt={setCommentTxt}
						animeId={animeId}
					/>
				))}
			</ul>
			<div className={classes.btns}>
				{!isLastDocs && (
					<DefaultBtn
						classMode="clear"
						title="More comments"
						className={classes.moreBtn}
						onClickHandler={loadMoreData}
					>
						More comments
					</DefaultBtn>
				)}
				{comments && comments.length > COMMENTS_LIMIT && (
					<DefaultBtn
						classMode="clear"
						title="Hide comments"
						className={classes.hideBtn}
						onClickHandler={onReload}
					>
						Hide comments
					</DefaultBtn>
				)}
			</div>
		</div>
	);
};

export default Comments;
