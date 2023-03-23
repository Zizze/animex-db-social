import { useAuthContext } from "@/context/useAuthContext";
import CloseModal from "@Components/UI/btn/CloseModal";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import { db } from "@Project/firebase";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import classes from "./Messages.module.scss";

interface IProps {
	currUserId: string;
	setIsActiveMess: Dispatch<SetStateAction<boolean>>;
}

const Messages: FC<IProps> = ({ currUserId, setIsActiveMess }) => {
	const [text, setText] = useState("");
	const { user } = useAuthContext();

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!user || text.trim() === "") return;

		const updateUserMessages = async (userId: string, currUserId: string, sender: boolean) => {
			const userMessageRef = doc(db, `users/${userId}/messages/${currUserId}`);
			const userMessageSnap = await getDoc(userMessageRef);
			if (!userMessageSnap.exists()) {
				await setDoc(userMessageRef, { lastUpdate: serverTimestamp() });
			} else {
				await updateDoc(userMessageRef, { lastUpdate: serverTimestamp() });
			}

			const userMessageDataRef = collection(db, `users/${userId}/messages/${currUserId}/data`);
			await addDoc(userMessageDataRef, {
				checked: sender ? true : false,
				timestamp: serverTimestamp(),
				message: text.trim(),
				sender: sender,
			});
		};

		setText("");
		await updateUserMessages(user.uid, currUserId, true);
		await updateUserMessages(currUserId, user.uid, false);
		onCloseModal();
	};

	const onCloseModal = () => {
		setIsActiveMess(false);
	};

	return (
		<ModalWrapper onClickHandler={onCloseModal}>
			<div className={classes.message}>
				<CloseModal onClickHandler={onCloseModal} className={classes.close} />
				<TextAreaForm
					text={text}
					setText={setText}
					placeholder="Enter your message..."
					onSubmitHandler={onSubmitHandler}
					classes={{ cnForm: classes.messForm }}
					minRows={1}
					maxRows={10}
				/>
			</div>
		</ModalWrapper>
	);
};

export default Messages;
