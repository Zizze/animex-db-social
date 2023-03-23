import { ICommentFirebase } from "@/types/types";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { IUserFirebase } from "../../../../../types/types";
import { useEffect } from "react";
import { deleteDoc, doc, getDoc, runTransaction, onSnapshot } from "firebase/firestore";
import { db } from "@Project/firebase";
import classes from "./Comment.module.scss";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import Highlighter from "react-highlight-words";
import { useAuthContext } from "@/context/useAuthContext";
import { MdDelete, MdRecordVoiceOver } from "react-icons/md";
import { checkCreateData } from "@/utils/checkCreateData";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import cn from "classnames";
import Link from "next/link";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

interface IProps {
	comment: ICommentFirebase;
	setCommentTxt: Dispatch<SetStateAction<string>>;
	animeId: number;
}

const Comment: FC<IProps> = ({ comment, setCommentTxt, animeId }) => {
	const { user } = useAuthContext();
	const [author, setAuthor] = useState<IUserFirebase>();
	const { message, id, timestamp, commentId } = comment;
	const chekDate = checkCreateData(+timestamp);
	const [isDelete, setIsDelete] = useState(false);
	const [isShowSpoiler, setIsShowSpoiler] = useState(false);

	const [likes, setLikes] = useState<string[]>([]);
	const [dislikes, setDislikes] = useState<string[]>([]);

	useEffect(() => {
		const getUser = async () => {
			const userRef = doc(db, `users/${id}`);
			const userDoc = await getDoc(userRef);
			if (userDoc.exists()) {
				setAuthor(userDoc.data() as IUserFirebase);
			}
		};

		getUser();
	}, []);

	useEffect(() => {
		const unsub = onSnapshot(doc(db, `comments/${animeId}/dataAnime/${commentId}`), (doc) => {
			const comment = doc.data() as ICommentFirebase;
			if (comment) {
				setLikes(comment.likes);
				setDislikes(comment.dislikes);
			}
		});
		return () => unsub();
	}, []);

	const onDeleteHandler = async () => {
		if (!commentId) return;
		await deleteDoc(doc(db, `comments/${animeId}/dataAnime/${commentId}`));
		setIsDelete(true);
	};

	const onAnswerHandler = () => {
		if (!author) return;
		setCommentTxt((prev) =>
			prev.length > 0 ? `${prev} @${author.name}`.trim() : `@${author.name} `
		);
	};

	const onClickGrade = async (grade: string) => {
		if (!user) return;
		const commentRef = doc(db, `comments/${animeId}/dataAnime/${commentId}`);

		await runTransaction(db, async (transaction) => {
			const hasLiked = likes.includes(user.uid);
			const hasDisliked = dislikes.includes(user.uid);

			if (grade === "like") {
				if (!hasLiked) {
					transaction.update(commentRef, { likes: [...likes, user.uid] });
					if (hasDisliked) {
						transaction.update(commentRef, {
							dislikes: dislikes.filter((userId: string) => userId !== user.uid),
						});
					}
				} else {
					transaction.update(commentRef, {
						likes: likes.filter((userId: string) => userId !== user.uid),
					});
				}
			} else if (grade === "dislike") {
				if (!hasDisliked) {
					transaction.update(commentRef, { dislikes: [...dislikes, user.uid] });
					if (hasLiked) {
						transaction.update(commentRef, {
							likes: likes.filter((userId: string) => userId !== user.uid),
						});
					}
				} else {
					transaction.update(commentRef, {
						dislikes: dislikes.filter((userId: string) => userId !== user.uid),
					});
				}
			}
		});
	};

	return (
		<>
			{!isDelete && (
				<li className={classes.comment}>
					<div className={classes.user}>
						<div className={classes.info}>
							<Link href={`/profile/${author?.name}`}>
								<Image
									src={author?.photoURL || defaultImage}
									height={200}
									width={200}
									alt={`${author?.name} ava`}
								/>
								<p>{author?.name}</p>
							</Link>
						</div>
						{comment.spoiler && (
							<DefaultBtn
								onClickHandler={() => setIsShowSpoiler((prev) => !prev)}
								title={!isShowSpoiler ? "Show spoiler" : "Hide Spoiler"}
								classMode="main-simple"
								className={classes.spoilerBtn}
							>
								{!isShowSpoiler ? "Show spoiler" : "Hide Spoiler"}
							</DefaultBtn>
						)}
						<div className={classes.btns}>
							{user && (
								<button title="answer" onClick={onAnswerHandler}>
									<MdRecordVoiceOver />
								</button>
							)}

							{user?.uid === author?.id && (
								<button title="delete" onClick={onDeleteHandler}>
									<MdDelete />
								</button>
							)}
						</div>
					</div>
					<div className={classes.message}>
						<div>
							<p className={cn(classes.text, comment.spoiler && !isShowSpoiler && classes.spoiler)}>
								<Highlighter
									highlightClassName={classes.highlight}
									searchWords={[`@${author?.name}`]}
									autoEscape={true}
									textToHighlight={`${message}`}
								/>
							</p>
						</div>
						<p className={classes.date}>{chekDate}</p>
					</div>
					<div className={classes.gradeBtns}>
						<button
							onClick={() => onClickGrade("like")}
							className={cn(user && likes.includes(user.uid) && classes.active)}
						>
							<AiFillLike /> <span>{likes.length > 0 && likes.length}</span>
						</button>
						<button
							onClick={() => onClickGrade("dislike")}
							className={cn(user && dislikes.includes(user.uid) && classes.active)}
						>
							<AiFillDislike />
							<span>{dislikes.length > 0 && dislikes.length}</span>
						</button>
					</div>
				</li>
			)}
		</>
	);
};

export default Comment;
