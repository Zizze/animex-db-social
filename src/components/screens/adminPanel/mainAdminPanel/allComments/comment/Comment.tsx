import { ICommentFirebase, IUserFirebase } from "@/types/types";
import React, { FC, useState } from "react";

import { useEffect } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@Project/firebase";
import classes from "./Comment.module.scss";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import Highlighter from "react-highlight-words";
import { useAuthContext } from "@/context/useAuthContext";
import { MdDelete, MdLink } from "react-icons/md";
import { checkCreateData } from "@/utils/checkCreateData";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import cn from "classnames";
import Link from "next/link";

interface IProps {
	comment: ICommentFirebase;
}

const Comment: FC<IProps> = ({ comment }) => {
	const { user, userStorage } = useAuthContext();
	const [author, setAuthor] = useState<IUserFirebase>();
	const { message, id, timestamp, docRef, animeId } = comment;
	const chekDate = checkCreateData(+timestamp);
	const [isDelete, setIsDelete] = useState(false);
	const [isShowSpoiler, setIsShowSpoiler] = useState(false);

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

	const onDeleteHandler = async () => {
		if (!docRef || !user) return;
		const getCommentDoc = await getDoc(docRef);
		const removeComment = getCommentDoc.data() as ICommentFirebase;

		if (getCommentDoc.exists()) {
			try {
				await deleteDoc(docRef);
				setIsDelete(true);

				if (user.uid !== author?.id) {
					await addDoc(collection(db, "adminsAction"), {
						type: "delete",
						adminId: user.uid,
						userId: removeComment.id,
						message: removeComment.message,
						timestamp: serverTimestamp(),
					});
				}
			} catch (error) {
				console.log("Admin panel: comment deletion error.");
			}
		}
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
							{user && animeId && (
								<Link href={`/anime/${animeId}`} title="Anime link">
									<MdLink />
								</Link>
							)}

							{(user?.uid === author?.id || (userStorage?.access || 0) > (author?.access || 0)) && (
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
				</li>
			)}
		</>
	);
};

export default Comment;
