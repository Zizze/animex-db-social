import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import classes from "./SignIn.module.scss";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import cn from "classnames";
import { auth } from "@Project/firebase";
import { useTextField } from "@/hooks/useTextField";

const SignIn = () => {
	const {
		value: email,
		onChange: emailOnChange,
		error: errorEmail,
	} = useTextField({ allowEmail: true });

	const {
		value: pass,
		onChange: passOnChange,
		error: errorPass,
	} = useTextField({ numLettOnly: true, minLength: 6 });

	const [userError, setUserError] = useState(false);
	const router = useRouter();

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (errorPass !== "" || errorEmail !== "") return;

		try {
			const signIn = await signInWithEmailAndPassword(auth, email, pass);
			onClickHandler();
		} catch {
			setUserError(true);
		}
	};

	useEffect(() => {
		userError && setUserError(false);
	}, [email, pass]);

	const onClickHandler = () => {
		router.push("/");
	};

	return (
		<div className={classes.wrapper}>
			<form onSubmit={submitHandler} autoComplete="off">
				<p className={cn(classes.inputValid, userError && classes.on)}>
					{userError ? "Invalid email address or password." : ""}
				</p>
				<p className={cn(classes.inputValid, errorEmail && classes.on)}>{errorEmail}</p>
				<input
					type="text"
					placeholder="Email"
					value={email}
					onChange={emailOnChange}
					autoComplete="off"
				/>
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
						Sign In
					</DefaultBtn>
					<DefaultBtn onClickHandler={onClickHandler}>Home</DefaultBtn>
				</div>
				<p>
					Not registered ? <Link href={"/auth/signup"}>Sign up</Link>
				</p>
			</form>
		</div>
	);
};

export default SignIn;
