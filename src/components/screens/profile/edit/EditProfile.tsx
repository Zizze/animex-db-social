import Layout from "@Components/layout/Layout";
import { ChangeEvent, FC, FormEvent, useState, useEffect } from "react";
import classes from "./EditProfile.module.scss";
import Image from "next/image";
import defaulImage from "@Public/testava.jpg";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useRouter } from "next/router";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { useAuthContext } from "@/context/useAuthContext";
import Loading from "@Components/UI/loading/Loading";
import { auth, db } from "@Project/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { popMessage } from "@/utils/popMessage/popMessage";
import { changeProfilePhoto } from "@/services/firebase/changePhoto";
import { useTextField } from "@/hooks/useTextField";
import { checkExistingUser } from "@/services/firebase/checkExistingUser";

const EditProfile: FC = () => {
	const router = useRouter();
	const { user, userStorage } = useAuthContext();
	const { popError, popSuccess, ctxMessage } = popMessage();
	const [loading, setLoading] = useState(false);
	const [errEqualPass, setErrEqualPass] = useState<string | null>(null);
	const [existEmailName, setExistEmailName] = useState<string | null>(null);

	const {
		value: newName,
		setValue: setNewName,
		setFirstChange: setFirstChangeName,
		onChange: onChangeName,
		error: nameErr,
	} = useTextField({
		maxLength: 10,
		minLength: 3,
		numLettOnly: true,
	});

	const {
		value: newEmail,
		setValue: setNewEmail,
		setFirstChange: setFirstChangeEmail,
		onChange: onChangeEmail,
		error: emailErr,
	} = useTextField({ allowEmail: true });

	const {
		value: pass,
		setFirstChange: setFirstChangePass,
		onChange: onChangePass,
		error: passErr,
	} = useTextField({ minLength: 6, numLettOnly: true, maxLength: 16 });

	const {
		value: confirmPass,
		setFirstChange: setFirstChangeConfPass,
		onChange: onChangeConfPass,
		error: passConfErr,
	} = useTextField({ minLength: 6, numLettOnly: true, maxLength: 16 });

	const [file, setFile] = useState<File | null>(null);
	const photoPrewie = file ? URL.createObjectURL(file) : user?.photoURL || defaulImage;

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user) return;
		const userDataRef = doc(db, `users/${user.uid}`);

		if (file) {
			// Update photo
			changeProfilePhoto({ userId: user.uid, setFile, setLoading, popError, popSuccess, file });
		}

		try {
			//Update other info
			if (auth.currentUser) {
				const nameValid = newName !== user.displayName && !nameErr;
				const emailValid = newEmail !== user.email && !emailErr;
				const passEqual = pass === confirmPass;
				const passwordsValid = passEqual && !passConfErr && !passErr && pass.length;
				setErrEqualPass(null);

				if (nameValid) {
					const existName = await checkExistingUser(newName, "_");
					setExistEmailName(existName);
					if (!existName) {
						await updateProfile(auth.currentUser, { displayName: newName });
						await updateDoc(userDataRef, { name: newName, name_lowercase: newName?.toLowerCase() });
					}
				}

				if (emailValid) {
					const existEmail = await checkExistingUser("_", newEmail);
					setExistEmailName(existEmail);
					if (!existEmail) {
						await updateEmail(auth.currentUser, newEmail);
					}
				}
				if (passwordsValid) {
					await updatePassword(auth.currentUser, pass);
				}
				if (nameValid || emailValid || passwordsValid) popSuccess("The change is saved.");

				if (!passEqual) setErrEqualPass(" Password mismatch.");
			}
			setFirstChangePass(false);
			setFirstChangeName(false);
			setFirstChangeEmail(false);
			setFirstChangeConfPass(false);
		} catch (err) {
			popError("Change info error.");
		} finally {
			setLoading(false);
		}
	};

	const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	useEffect(() => {
		if (user?.displayName) setNewName(user.displayName);
		if (user?.email) setNewEmail(user.email);
	}, [user, userStorage]);

	return (
		<>
			{ctxMessage}
			<Layout>
				{user && (
					<>
						{existEmailName && <p className={classes.notValid}>{existEmailName}</p>}
						<form className={classes.form} onSubmit={submitHandler}>
							{loading && <Loading />}

							<div className={classes.left}>
								<p className={classes.notValid}>{nameErr}</p>
								<input
									className={classes.name}
									maxLength={10}
									type="text"
									value={newName}
									onChange={onChangeName}
								/>
								<div className={classes.ava}>
									<Image
										priority={true}
										src={photoPrewie}
										width={500}
										height={500}
										alt={`avatar ${newName}`}
									/>

									<label>
										<BsFillCloudArrowUpFill className={classes.fileIco} />
										<input
											accept="image/*"
											type="file"
											name="ava"
											onChange={(e) => imageChange(e)}
										/>
									</label>
								</div>
							</div>
							<div className={classes.right}>
								<p className={classes.notValid}>{emailErr}</p>
								<input type="text" onChange={onChangeEmail} value={newEmail} />
								<p className={classes.notValid}>{`${passErr || ""}${errEqualPass || ""}`}</p>
								<input
									type="text"
									onChange={onChangePass}
									value={pass}
									placeholder="New password"
									autoComplete="new-password"
								/>
								<p className={classes.notValid}>{passConfErr}</p>
								<input
									type="text"
									onChange={onChangeConfPass}
									value={confirmPass}
									placeholder="Confirm pass"
									autoComplete="new-password"
								/>
								<div className={classes.btns}>
									<DefaultBtn type="submit" classMode="main">
										Change
									</DefaultBtn>
									<DefaultBtn onClickHandler={() => router.push("/")}>Home</DefaultBtn>
								</div>
							</div>
						</form>
					</>
				)}
			</Layout>
		</>
	);
};

export default EditProfile;
