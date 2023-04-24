import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { FormEvent, useState, useEffect } from "react";
import classes from "./SignUp.module.scss";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@Project/firebase";
import { useTextField } from "@/hooks/useTextField";
import { checkExistingUser } from "@/services/firebase/checkExistingUser";
import cn from "classnames";
import Meta from "@Components/seo/Meta";

const SignUp = () => {
	const [userExist, setUserExist] = useState<string | null>(null);
	const [passMiss, setPassMiss] = useState(false);

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

	const {
		value: confPassword,
		onChange: confPasswordOnChange,
		error: errorConfPassword,
	} = useTextField({ minLength: 6, numLettOnly: true });

	const router = useRouter();

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const checkEmailLogin = await checkExistingUser(name, email);
		if (checkEmailLogin) return setUserExist(checkEmailLogin);
		if (!email || !password || !confPassword || !name || passMiss) return;

		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);
			if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: name });

			await setDoc(doc(db, "users", user.uid), {
				id: user.uid,
				name: user.displayName,
				name_lowercase: user.displayName?.toLowerCase(),
				email: email.toLowerCase(),
			});

			setUserExist(null);
			location.reload();
		} catch {}
	};

	useEffect(() => {
		password !== confPassword ? setPassMiss(true) : setPassMiss(false);
	}, [password, confPassword]);

	const onClickHandler = () => {
		router.push("/");
	};

	return (
		<>
			<Meta title="Sign up" description={`Sign up | AnimeX`} />
			<div className={classes.wrapper}>
				<form onSubmit={submitHandler} autoComplete="off">
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
					<p className={cn(classes.inputValid, errorConfPassword && classes.on)}>
						{errorConfPassword}
					</p>
					<p className={cn(classes.inputValid, passMiss && classes.on)}>
						{passMiss && "Password mismatch!"}
					</p>
					<input
						autoComplete="new-password"
						type="password"
						placeholder="Confirm password"
						value={confPassword}
						onChange={confPasswordOnChange}
					/>

					<div className={classes.btns}>
						<DefaultBtn classMode="main" type="submit">
							Sign Up
						</DefaultBtn>
						<DefaultBtn onClickHandler={onClickHandler}>Home</DefaultBtn>
					</div>
					<p>
						Do you already have? <Link href={"/auth/signin"}>Sign in</Link>
					</p>
				</form>
			</div>
		</>
	);
};

export default SignUp;
