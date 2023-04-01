import { useAuthContext } from "@/context/useAuthContext";
import { db } from "@Project/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FC, FormEvent, useState, Dispatch, SetStateAction } from "react";
import classes from "./Write.module.scss";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import { popMessage } from "@/utils/popMessage/popMessage";
import { Loading } from "@nextui-org/react";

interface IProps {
	answerToUser: string[];
	setAnswerToUser: Dispatch<SetStateAction<string[]>>;
}

const Write: FC<IProps> = ({ answerToUser, setAnswerToUser }) => {
	const { user } = useAuthContext();
	const [chatWrite, setChatWrite] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { popError, popSuccess, ctxMessage } = popMessage();

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (user && chatWrite.length > 0) {
			setIsLoading(true);

			const answerNames: string =
				answerToUser
					.map?.((author: string) => {
						return `@${author}`;
					})
					.join(", ") || "";

			try {
				await addDoc(collection(db, "chat"), {
					id: user.uid,
					message: `${answerNames} ${chatWrite}`,
					timestamp: serverTimestamp(),
					answer: answerToUser,
				});
				setChatWrite("");
				popSuccess("Message sent.");
				setAnswerToUser([]);
			} catch {
				popError("Error send message.");
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className={classes.wrapper}>
			{ctxMessage}
			{isLoading && <Loading className={classes.loading} />}
			<TextAreaForm
				classes={{ cnForm: classes.formChat, cnTextArea: classes.textArea, cnEmoji: classes.emoji }}
				text={chatWrite}
				setText={setChatWrite}
				onSubmitHandler={onSubmitHandler}
				placeholder={isLoading ? "Waiting" : "Enter message..."}
			/>
		</div>
	);
};

export default Write;
