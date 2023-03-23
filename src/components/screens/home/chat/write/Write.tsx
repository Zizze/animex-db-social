import { useAuthContext } from "@/context/useAuthContext";
import { db } from "@Project/firebase";
import {
	addDoc,
	collection,
	DocumentData,
	QueryDocumentSnapshot,
	serverTimestamp,
} from "firebase/firestore";
import { FC, FormEvent, useState, Dispatch, SetStateAction } from "react";
import classes from "./Write.module.scss";
import { TbSend } from "react-icons/tb";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";

interface IProps {
	answerToUser: string[];
	setAnswerToUser: Dispatch<SetStateAction<string[]>>;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	isLoading: boolean;
	setLastVisibleDoc: Dispatch<SetStateAction<QueryDocumentSnapshot<DocumentData> | null>>;
}

const Write: FC<IProps> = ({
	answerToUser,
	setAnswerToUser,
	setIsLoading,
	isLoading,
	setLastVisibleDoc,
}) => {
	const { user } = useAuthContext();
	const [chatWrite, setChatWrite] = useState("");

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		const answerNames: string =
			answerToUser
				.map?.((author: string) => {
					return `@${author}`;
				})
				.join(", ") || "";

		if (user && chatWrite.length > 0) {
			setIsLoading(true);
			await addDoc(collection(db, "chat"), {
				id: user.uid,
				message: `${answerNames} ${chatWrite}`,
				timestamp: serverTimestamp(),
				answer: answerToUser,
			});
			setChatWrite("");
			setAnswerToUser([]);
			setIsLoading(false);
			setLastVisibleDoc(null);
		}
	};

	return (
		<TextAreaForm
			classes={{ cnForm: classes.formChat, cnTextArea: classes.textArea, cnEmoji: classes.emoji }}
			text={chatWrite}
			setText={setChatWrite}
			onSubmitHandler={onSubmitHandler}
			placeholder={isLoading ? "Waiting" : "Enter message..."}
		/>
	);
};

export default Write;
