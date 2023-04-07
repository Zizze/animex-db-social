import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import React, { FormEvent, useEffect, useState, FC, SetStateAction, Dispatch } from "react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import cn from "classnames";
import { auth } from "@Project/firebase";
import { useTextField } from "@/hooks/useTextField";
import classes from "./Reauthorization.module.scss";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { popMessage } from "@/utils/popMessage/popMessage";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/useAuthContext";

interface IReauthorization {
	setIsOpemConfirmModal: Dispatch<SetStateAction<boolean>>;
	isOpemConfirmModal: boolean;
}

const Reauthorization: FC<IReauthorization> = ({ setIsOpemConfirmModal, isOpemConfirmModal }) => {
	const router = useRouter();
	const { user } = useAuthContext();
	const {
		value: pass,
		onChange: passOnChange,
		setFirstChange: setFirstChangePass,
		error: errorPass,
	} = useTextField({ numLettOnly: true, minLength: 6 });

	const [userError, setUserError] = useState(false);
	const { popSuccess, ctxMessage } = popMessage();

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!pass.length) return setFirstChangePass(true);
		if (errorPass && errorPass.length) return;
		try {
			const user = auth.currentUser;
			if (!user) return;
			const credential = EmailAuthProvider.credential(user.email as string, pass);
			await reauthenticateWithCredential(user, credential);
			setIsOpemConfirmModal(false);
			popSuccess("Reauthorization success");
		} catch {
			setUserError(true);
		}
	};

	useEffect(() => {
		userError && setUserError(false);
	}, [pass]);

	return (
		<>
			{ctxMessage}
			{isOpemConfirmModal && (
				<ModalWrapper>
					<div className={classes.wrapper}>
						<h4>Confirm the password</h4>
						<form onSubmit={submitHandler} autoComplete="off">
							<p className={cn(classes.inputValid, userError && classes.on)}>
								{userError ? "Invalid password." : ""}
							</p>

							<p className={cn(classes.inputValid, errorPass && classes.on)}>{errorPass}</p>
							<input
								type="password"
								placeholder="Password"
								value={pass}
								onChange={passOnChange}
								autoComplete="off"
							/>

							<div className={classes.btns}>
								<DefaultBtn classMode="main" type="submit">
									Confirm
								</DefaultBtn>
								<DefaultBtn onClickHandler={() => router.push(`/profile/${user?.displayName}`)}>
									Back
								</DefaultBtn>
							</div>
						</form>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default Reauthorization;
