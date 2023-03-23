import { Dispatch, FC, SetStateAction, useState } from "react";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import { MdDelete, MdRecordVoiceOver } from "react-icons/md";
import classes from "./Message.module.scss";
import { IMainChatFirebase } from "@/types/types";
import { deleteDoc, doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import Highlighter from "react-highlight-words";
import Link from "next/link";

interface IProps {
	message: IMainChatFirebase;
	setAnswerToUser: Dispatch<SetStateAction<string[]>>;
}

const Message: FC<IProps> = ({ message, setAnswerToUser }) => {
	const { user, userStorage } = useAuthContext();
	const { author, messageId, message: mess, answer } = message;
	const [isDeleted, setIsDeleted] = useState(false);

	const onDeleteHandler = async () => {
		if (!messageId || !user || !author) return;
		await deleteDoc(doc(db, "chat", messageId));
		if (user.uid !== author.id) {
			await addDoc(collection(db, "adminsAction"), {
				adminId: user.uid,
				message: mess,
				timestamp: serverTimestamp(),
				type: "delete",
				userId: author.id,
				page: "chat",
			});
		}
		setIsDeleted(true);
	};

	const onAnswerHandler = () => {
		if (!author) return;
		setAnswerToUser((prev) => [...prev.filter((user) => user.trim() !== author.name), author.name]);
	};

	return (
		<>
			{!isDeleted && (
				<li className={classes.list}>
					<div className={classes.info}>
						<div className={classes.main}>
							<Link href={`profile/${author?.name}`}>
								<Image
									src={author?.photoURL ? author.photoURL : defaultImage}
									height={100}
									width={100}
									alt="User photo"
								/>
								<h5>{author?.name}</h5>
							</Link>
						</div>
						<div className={classes.btns}>
							{user && (
								<button title="answer" onClick={onAnswerHandler}>
									<MdRecordVoiceOver />
								</button>
							)}

							{(user?.uid === author?.id ||
								(userStorage?.access || 0) >= (author?.access || 0)) && (
								<button title="delete" onClick={onDeleteHandler}>
									<MdDelete />
								</button>
							)}
						</div>
					</div>
					<div className={classes.content}>
						<p>
							<Highlighter
								highlightClassName={classes.highlight}
								searchWords={[`@${user?.displayName}`]}
								autoEscape={true}
								textToHighlight={mess}
							/>
						</p>
					</div>
				</li>
			)}
		</>
	);
};

export default Message;
