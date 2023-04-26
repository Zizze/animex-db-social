import { Dispatch, FC, SetStateAction, useState } from "react";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import { MdDelete, MdRecordVoiceOver } from "react-icons/md";
import classes from "./Message.module.scss";
import { IMainChatFirebase, IUserFirebase } from "@/types/types";
import { deleteDoc, doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";

interface IProps {
	message: IMainChatFirebase;
	setAnswerToUser: Dispatch<SetStateAction<string[]>>;
	popError: (mess: string, duration?: number) => void;
	popSuccess: (mess: string, duration?: number) => void;
}

const Message: FC<IProps> = ({ message, setAnswerToUser, popError, popSuccess }) => {
	const { user, userStorage } = useAuthContext();
	const { id, docId, message: mess } = message;
	const [isDeleted, setIsDeleted] = useState(false);

	const { data: author } = useRealtimeDoc<IUserFirebase>(`users/${id}`);

	const onDeleteHandler = async () => {
		if (!docId || !user || !author) return;
		try {
			await deleteDoc(doc(db, `chat/${docId}`));
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
			popSuccess("Delete success.");
		} catch {
			popError("Error deleting.");
		}
	};

	const onAnswerHandler = () => {
		if (!author) return;
		setAnswerToUser((prev) => [...prev.filter((user) => user.trim() !== author.name), author.name]);
	};

	const checkUserAccess = userStorage?.access && userStorage.access >= (author?.access || 0);

	return (
		<>
			{!isDeleted && (
				<li className={classes.list}>
					<div className={classes.info}>
						<div className={classes.main}>
							<Link href={`profile/${author?.name}`}>
								<Image
									src={author?.photoURL || defaultImage}
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

							{(user?.uid === author?.id || checkUserAccess) && (
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
