import { ISupportAnswerFirebase, IUserFirebase } from "@/types/types";
import { checkCreateData } from "@/utils/checkCreateData";
import { FC } from "react";
import classes from "./AdminResponse.module.scss";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import { MdDelete } from "react-icons/md";
import { useAuthContext } from "@/context/useAuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@Project/firebase";

interface UserWithSupportMess {
	info: IUserFirebase;
	comment: ISupportAnswerFirebase;
}

const AdminsResponse: FC<{ admin: UserWithSupportMess; docId: string }> = ({ admin, docId }) => {
	const { user, userStorage } = useAuthContext();
	const { photoURL, name, access } = admin.info;
	const { message, timestamp, adminId } = admin.comment;
	const chekDate = checkCreateData(timestamp.seconds);

	const onDeleteHandler = async () => {
		if (!user && (userStorage || 0) === 0) return;
		const supportRef = doc(db, `support/${docId}`);
		const supportDoc = await getDoc(supportRef);

		if (supportDoc.exists()) {
			const currentAnswers = supportDoc.data().answers as ISupportAnswerFirebase[];
			const filteredComments = currentAnswers.filter(
				(comment) =>
					comment.adminId !== adminId ||
					comment.message !== message ||
					comment.timestamp.nanoseconds !== timestamp.nanoseconds ||
					comment.timestamp.seconds !== timestamp.seconds
			);
			const updatedAnswers = [...filteredComments];
			await updateDoc(supportRef, { answers: updatedAnswers });
		}
	};

	const checkAcces = (userStorage?.access || 0) > (access || 0);

	return (
		<>
			<li className={classes.comment}>
				<div className={classes.user}>
					<div className={classes.info}>
						<Link href={`/profile/${name}`}>
							<Image src={photoURL || defaultImage} height={200} width={200} alt={`${name} ava`} />
							<p>{name}</p>
						</Link>
					</div>
					{(user?.uid === adminId || checkAcces) && (
						<div className={classes.btns}>
							<button title="delete" onClick={onDeleteHandler}>
								<MdDelete />
							</button>
						</div>
					)}
				</div>
				<div className={classes.message}>
					<p className={classes.text}>{message}</p>
					<p className={classes.date}>{chekDate}</p>
				</div>
			</li>
		</>
	);
};

export default AdminsResponse;
