import Layout from "@Components/layout/Layout";
import { ChangeEvent, FC, FormEvent, useState, useEffect } from "react";
import classes from "./EditProfile.module.scss";
import Image from "next/image";
import defaulImage from "@Public/testava.jpg";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useRouter } from "next/router";
import { getAuth, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useAuthContext } from "@/context/useAuthContext";
import Loading from "@Components/UI/loading/Loading";
import { auth, db, storage } from "@Project/firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditProfile: FC = ({}) => {
	const { user } = useAuthContext();

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [newName, setNewName] = useState(user?.displayName);
	const [newEmail, setNewEmail] = useState(user?.email);
	const [pass, setPass] = useState("");
	const [confirmPass, setConfirmPass] = useState("");

	const [file, setFile] = useState<File | null>(null);

	const photoPrewie = file ? URL.createObjectURL(file) : user?.photoURL || defaulImage;

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (user) {
			const userDataRef = doc(db, "users", `${user.uid}`);

			if (file) {
				const storageRef = ref?.(storage, `avatars/${user.uid}`);
				const uploadTask = uploadBytesResumable(storageRef, file);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						switch (snapshot.state) {
							case "paused":
								setLoading(false);
								break;
							case "running":
								setLoading(true);
								break;
						}
					},
					(error) => {
						alert("Profile: Error upload");
						console.log(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
							if (auth.currentUser)
								await updateProfile(auth.currentUser, { photoURL: downloadURL });
							await updateDoc(userDataRef, { photoURL: downloadURL });

							setFile(null);
							setLoading(false);
						});
					}
				);
			}

			try {
				if (auth.currentUser) {
					if (newName !== user.displayName) {
						await updateProfile(auth.currentUser, { displayName: newName });
						await updateDoc(userDataRef, { name: newName, name_lowercase: newName?.toLowerCase() });
					}
					if (newEmail !== user.email && newEmail) {
						await updateEmail(auth.currentUser, newEmail);
					}
					if (pass === confirmPass && pass.trim() !== "")
						await updatePassword(auth.currentUser, pass);
				}
			} catch (err) {
				alert("Profile: change info err");
				console.log(err);
			}
		}
	};

	const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	useEffect(() => {
		if (!user) router.push("/");
	}, [user]);

	return (
		<>
			{loading && <Loading />}
			<Layout>
				{user && (
					<form className={classes.form} onSubmit={submitHandler}>
						<div className={classes.left}>
							<input
								className={classes.name}
								maxLength={10}
								type="text"
								value={newName || ""}
								onChange={(e) => setNewName(e.target.value)}
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
									<input accept="image/*" type="file" name="ava" onChange={(e) => imageChange(e)} />
								</label>
							</div>
						</div>
						<div className={classes.right}>
							<input
								type="email"
								onChange={(e) => setNewEmail(e.target.value)}
								value={newEmail || ""}
							/>
							<input
								type="password"
								onChange={(e) => setPass(e.target.value)}
								value={pass}
								placeholder="New password"
								autoComplete="new-password"
							/>
							<input
								type="password"
								onChange={(e) => setConfirmPass(e.target.value)}
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
				)}
			</Layout>
		</>
	);
};

export default EditProfile;
