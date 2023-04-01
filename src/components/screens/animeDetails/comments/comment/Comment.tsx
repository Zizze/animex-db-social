import { ICommentFirebase, IUserFirebase } from "@/types/types";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
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
import { useGetDoc } from "@/hooks/firebase/useGetDoc";
import { changeGrade } from "@/services/firebase/changeGrade";
import { popMessage } from "@/utils/popMessage/popMessage";

interface IProps {
	comment: ICommentFirebase;
	setCommentTxt: Dispatch<SetStateAction<string>>;
	animeId: number;
}

const Comment: FC<IProps> = ({ comment, setCommentTxt, animeId }) => {
	const { user } = useAuthContext();
	const { popError, ctxMessage } = popMessage();
	const { message, id, timestamp, docId, likes, dislikes } = comment;
	const chekDate = checkCreateData(timestamp.seconds);
	const [isDelete, setIsDelete] = useState(false);
	const [isShowSpoiler, setIsShowSpoiler] = useState(false);

	const { data: author } = useGetDoc<IUserFirebase>(`users/${id}`);

	const onDeleteHandler = async () => {
		if (!docId) return;
		await deleteDoc(doc(db, `comments/${animeId}/dataAnime/${docId}`));
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
		try {
			await changeGrade(`comments/${animeId}/dataAnime/${docId}`, {
				userId: user.uid,
				gradeSelect: grade,
				likesArray: likes,
				dislikedArray: dislikes,
			});
		} catch {
			popError("Error changing grade.");
		}
	};

	return (
		<>
			{!isDelete && (
				<li className={classes.comment}>
					{ctxMessage}
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
