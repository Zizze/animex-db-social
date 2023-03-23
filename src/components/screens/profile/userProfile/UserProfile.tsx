import { IFriendFirebase, IUserFirebase } from "@/types/types";
import Layout from "@Components/layout/Layout";
import { db } from "@Project/firebase";
import {
	collection,
	doc,
	query,
	where,
	getDocs,
	limit,
	onSnapshot,
	deleteDoc,
	setDoc,
} from "firebase/firestore";
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineSend } from "react-icons/ai";
import { TiEdit } from "react-icons/ti";
import { BsClock } from "react-icons/bs";

import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import classes from "./UserProfile.module.scss";
import defaultImage from "@Public/testava.jpg";
import Image from "next/image";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useAuthContext } from "@/context/useAuthContext";
import {
	dataSettFriend,
	dataSettMess,
	dataSettProfileVisible,
} from "@Components/layout/header/userSettings/userSettings.data";
import Statistics from "./statistics/Statistics";
import Messages from "./message/Messages";
import { userAccessInString } from "@/utils/userAccessInString";

const UserProfile: FC = () => {
	const { user } = useAuthContext();
	const [isActiveMess, setIsActiveMess] = useState(false);
	const [userProfile, setUserProfile] = useState<IUserFirebase | null>(null);
	const [friendStatus, setFriendStatus] = useState<boolean | string>("");
	const router = useRouter();
	const { name } = router.query;

	useEffect(() => {
		if (!name) return;
		const getUser = async () => {
			const userRef = query(
				collection(db, "users"),
				where("name_lowercase", "==", `${name}`.toLowerCase()),
				limit(1)
			);
			const querySnapshot = await getDocs(userRef);
			const doc = querySnapshot.docs[0];
			if (doc) setUserProfile(doc.data() as IUserFirebase);
		};

		getUser();
	}, [name]);

	const onClickSend = async () => {
		if (!user || !userProfile) return;
		const sendingUserRef = doc(db, `users/${user.uid}/friends`, `${userProfile.id}`);
		await setDoc(sendingUserRef, {
			friend: false,
			confirmator: false,
		});

		const сonfirmUserRef = doc(db, `users/${userProfile.id}/friends`, `${user.uid}`);
		await setDoc(сonfirmUserRef, {
			friend: false,
			confirmator: true,
		});
	};

	const onClickRemove = async () => {
		if (!user || !userProfile) return;
		await deleteDoc(doc(db, `users/${user.uid}/friends`, `${userProfile.id}`));
		await deleteDoc(doc(db, `users/${userProfile.id}/friends`, `${user.uid}`));
	};

	useEffect(() => {
		if (!user || !userProfile) return;
		const unsub = onSnapshot(doc(db, `users/${user.uid}/friends`, `${userProfile.id}`), (doc) => {
			if (doc.exists()) {
				const getData: IFriendFirebase = doc.data() as IFriendFirebase;
				setFriendStatus(getData.friend);
			} else {
				setFriendStatus("empty");
			}

			return () => unsub();
		});
	}, [userProfile]);

	return (
		<Layout>
			<>
				<div className={classes.profile}>
					<span className={classes.role}>{userAccessInString(userProfile?.access || 0)}</span>
					<div className={classes.left}>
						<p className={classes.name}>{userProfile?.name}</p>
						<div className={classes.ava}>
							<Image
								priority={true}
								src={userProfile?.photoURL || defaultImage}
								width={500}
								height={500}
								alt={`avatar ${userProfile?.name}`}
							/>
						</div>
					</div>
					<div className={classes.right}>
						{userProfile?.settings?.profile === dataSettProfileVisible[0] ||
						user?.uid === userProfile?.id ||
						(friendStatus === true &&
							userProfile?.settings?.profile === dataSettProfileVisible[2]) ? (
							<Statistics userId={userProfile?.id || ""} />
						) : (
							<p className={classes.accessFail}>
								{userProfile?.settings?.profile === dataSettProfileVisible[1] &&
									"The user has closed access to all users."}
								{userProfile?.settings?.profile === dataSettProfileVisible[2] &&
									"Viewing the profile is available only to the user's friends."}
							</p>
						)}
					</div>

					<div className={classes.btns}>
						{userProfile?.id === user?.uid ? (
							<DefaultBtn
								classMode="clear"
								title="Edit profile"
								onClickHandler={() => router.push("/profile-edit")}
							>
								<TiEdit />
							</DefaultBtn>
						) : (
							<>
								{friendStatus === "empty" && (
									<DefaultBtn
										disabled={
											userProfile?.settings?.friends
												? userProfile?.settings?.friends !== dataSettFriend[0]
												: false
										}
										classMode="clear"
										title={
											userProfile?.settings?.friends &&
											userProfile?.settings?.friends !== dataSettFriend[0]
												? "The user has blocked adding to friends."
												: "Add to friends"
										}
										onClickHandler={onClickSend}
									>
										<AiOutlineUserAdd />
									</DefaultBtn>
								)}
								{friendStatus === false && (
									<p className={classes.sendReq} title="Under review">
										<BsClock />
									</p>
								)}
								{friendStatus === true && (
									<DefaultBtn
										classMode="decline"
										title="Remove friend"
										onClickHandler={onClickRemove}
									>
										<AiOutlineUserDelete />
									</DefaultBtn>
								)}
								<DefaultBtn
									classMode="clear"
									title={
										userProfile?.settings?.messages === dataSettMess[0]
											? "Send message"
											: userProfile?.settings?.messages === dataSettMess[1]
											? "The user has disabled sending messages."
											: "Send messages only to friends"
									}
									onClickHandler={() => setIsActiveMess(true)}
									disabled={
										userProfile?.settings?.messages === dataSettMess[1] ||
										(userProfile?.settings?.messages === dataSettMess[2] && friendStatus !== true)
									}
								>
									<AiOutlineSend />
								</DefaultBtn>
							</>
						)}
					</div>
				</div>
				{isActiveMess &&
					(userProfile?.settings?.messages === dataSettProfileVisible[0] ||
						(friendStatus === true &&
							userProfile?.settings?.profile === dataSettProfileVisible[2])) && (
						<Messages setIsActiveMess={setIsActiveMess} currUserId={userProfile?.id || ""} />
					)}
			</>
		</Layout>
	);
};

export default UserProfile;
