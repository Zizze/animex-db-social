import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import Checkbox from "../checkbox/Checkbox";
import ModalWrapper from "../modal/ModalWrapper";
import TextAreaForm from "../textareaForm/TextAreaForm";
import classes from "./SupportForm.module.scss";
import cn from "classnames";
import { useAuthContext } from "@/context/useAuthContext";
import { useTextField } from "@/hooks/useTextField";
import { popMessage } from "@/utils/popMessage/popMessage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@Project/firebase";

interface ISupportForm {
	setIsActiveSupport: Dispatch<SetStateAction<boolean>>;
	isActiveSupport: boolean;
}

const SupportForm: FC<ISupportForm> = ({ setIsActiveSupport, isActiveSupport }) => {
	const { user } = useAuthContext();
	const { popSuccess, popError, ctxMessage } = popMessage();
	const [emailChekbox, setEmailChekbox] = useState<string | boolean>(false);
	const [message, setMessage] = useState("");

	const {
		value: title,
		setValue: setTitle,
		onChange: titleChange,
		error: titleError,
		setFirstChange: setFirstChangeTitle,
	} = useTextField({ maxLength: 40, minLength: 10, allowWhitespace: true });

	const {
		value: email,
		setValue: setEmail,
		onChange: emailChange,
		error: emailError,
		setFirstChange: setFirstChangeEmail,
	} = useTextField({ minLength: 5, allowEmail: true });

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;

		if ((emailError === "" || emailChekbox) && titleError === "" && message.length >= 20) {
			try {
				await addDoc(collection(db, "support"), {
					email: emailChekbox ? user.email : email,
					title,
					message,
					userId: user.uid,
					closed: false,
					answer: [],
					timestamp: serverTimestamp(),
				});
				popSuccess("Message sent successfully.");

				setFirstChangeEmail(false);
				setFirstChangeTitle(false);
				setMessage("");
				setEmail("");
				setTitle("");
				setIsActiveSupport(false);
				setEmailChekbox(false);
			} catch {
				popError("Sent error.");
			}
		}
	};

	const onChangeCheckbox = (name: string) => {
		setEmailChekbox((prev) => (name === prev ? false : name));
	};

	return (
		<>
			{ctxMessage}
			{isActiveSupport && (
				<ModalWrapper onClickHandler={() => setIsActiveSupport(false)}>
					<div className={classes.container}>
						<p className={classes.descr}>
							If you encounter a problem, write to us and we will answer you by
							<span style={{ whiteSpace: "nowrap" }}>e-mail</span> convenient for you.
						</p>
						<TextAreaForm
							text={message}
							setText={setMessage}
							classes={{ cnForm: classes.supportForm }}
							placeholder="Enter message..."
							onSubmitHandler={onSubmitHandler}
							minLenght={20}
						>
							<div className={classes.titleWrapper}>
								<p className={classes.textField}>{titleError}</p>
								<input
									type="text"
									value={title}
									onChange={titleChange}
									placeholder="Briefly state the reason for the request"
								/>
							</div>

							<div className={classes.emailWrapper}>
								{!emailChekbox && <p className={classes.textField}>{emailError}</p>}
								<div className={classes.email}>
									<input
										type="text"
										value={email}
										onChange={emailChange}
										placeholder="Enter email address for replies"
										className={cn(emailChekbox && classes.disabled)}
									/>

									{user && (
										<Checkbox
											classnames={classes.checkbox}
											name="Use account email"
											onChangeHandler={onChangeCheckbox}
											id="test"
										/>
									)}
								</div>
							</div>
						</TextAreaForm>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default SupportForm;
