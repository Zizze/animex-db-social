import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FormEvent, useState, FC, Dispatch, SetStateAction } from "react";
import classes from "./AddAccount.module.scss";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@Project/firebase";
import { useTextField } from "@/hooks/useTextField";
import { checkExistingUser } from "@/services/firebase/checkExistingUser";
import cn from "classnames";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";

interface IProps {
	setIsActiveModal: Dispatch<SetStateAction<boolean>>;
}

const AddAccount: FC<IProps> = ({ setIsActiveModal }) => {
	const [userExist, setUserExist] = useState<string | null>(null);

	const {
		value: name,
		onChange: nameOnChange,
		error: errorName,
	} = useTextField({ minLength: 4, maxLength: 10, numLettOnly: true });

	const {
		value: email,
		onChange: emailOnChange,
		error: errorEmail,
	} = useTextField({ allowEmail: true });

	const {
		value: password,
		onChange: passwordOnChange,
		error: errorPassword,
	} = useTextField({ minLength: 6, numLettOnly: true });

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const checkEmailLogin = await checkExistingUser(name, email);
		if (checkEmailLogin) return setUserExist(checkEmailLogin);
		if (errorPassword !== "" || errorEmail !== "" || errorName !== "") return;
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);
			if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: name });

			await setDoc(doc(db, "users", user.uid), {
				id: user.uid,
				name: user.displayName,
				name_lowercase: user.displayName?.toLowerCase(),
				email: email.toLowerCase(),
			});

			setIsActiveModal(false);
			setUserExist(null);
		} catch {
			console.log("error");
		}
	};

	return (
		<ModalWrapper onClickHandler={() => setIsActiveModal(false)}>
			<form className={classes.form} onSubmit={submitHandler} autoComplete="off">
				<p className={cn(classes.userExist, userExist && classes.active)}>{userExist}</p>
				<p className={cn(classes.inputValid, errorName && classes.on)}>{errorName}</p>

				<input
					autoComplete="off"
					className={classes.input}
					type="text"
					placeholder="Display name"
					value={name}
					onChange={nameOnChange}
				/>
				<p className={cn(classes.inputValid, errorEmail && classes.on)}>{errorEmail}</p>
				<input
					type="text"
					placeholder="Email"
					value={email}
					onChange={emailOnChange}
					autoComplete="off"
				/>
				<p className={cn(classes.inputValid, errorPassword && classes.on)}>{errorPassword}</p>
				<input
					autoComplete="new-password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={passwordOnChange}
				/>

				<div className={classes.btns}>
					<DefaultBtn classMode="main" type="submit">
						Sign Up
					</DefaultBtn>
					<DefaultBtn onClickHandler={() => setIsActiveModal(false)}>Close</DefaultBtn>
				</div>
			</form>
		</ModalWrapper>
	);
};

export default AddAccount;
