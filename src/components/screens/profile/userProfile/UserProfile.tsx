import { IFriendFirebase, IUserFirebase } from "@/types/types";
import Layout from "@Components/layout/Layout";
import { db } from "@Project/firebase";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineSend } from "react-icons/ai";
import { TiEdit } from "react-icons/ti";
import { BsClock } from "react-icons/bs";

import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";
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
import { userBanChecker } from "@/utils/userBanChecker";
import { convertTimestamp } from "@/utils/convertTimestamp";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import Loading from "@Components/UI/loading/Loading";
import { popMessage } from "@/utils/popMessage/popMessage";

const UserProfile: FC = () => {
	const router = useRouter();
	const { name } = router.query;
	const { user } = useAuthContext();

	const [isActiveMess, setIsActiveMess] = useState(false);
	const { popError, popSuccess, ctxMessage } = popMessage();

	const { data: userProfile, isLoading } = useCollectionRealtime<IUserFirebase>(`users`, {
		where: [["name_lowercase", "==", `${name}`.toLowerCase()]],
		limit: 1,
	});

	const { data: friendData } = useRealtimeDoc<IFriendFirebase>(
		`users/${user?.uid}/friends/${userProfile && userProfile[0] && userProfile[0].id}`
	);

	const onClickSend = async () => {
		if (!user || !userProfile) return;
		try {
			const sendingUserRef = doc(db, `users/${user.uid}/friends/${userProfile[0].id}`);
			await setDoc(sendingUserRef, {
				friend: false,
				confirmator: false,
			});

			const сonfirmUserRef = doc(db, `users/${userProfile[0].id}/friends/${user.uid}`);
			await setDoc(сonfirmUserRef, {
				friend: false,
				confirmator: true,
			});
			popSuccess("Success!");
		} catch {
			popError("Error");
		}
	};

	const onClickRemove = async () => {
		if (!user || !userProfile) return;
		try {
			await deleteDoc(doc(db, `users/${user.uid}/friends/${userProfile[0].id}`));
			await deleteDoc(doc(db, `users/${userProfile[0].id}/friends/${user.uid}`));
			popSuccess("Friend removed!");
		} catch {
			popError("Error remove!");
		}
	};

	const accessUserSettings = useMemo(() => {
		if (!userProfile || !userProfile[0]) return;
		const notConfigured = !userProfile[0].settings?.profile;
		const openProfile = userProfile[0].settings?.profile === dataSettProfileVisible[0];
		const myProfile = user?.uid === userProfile[0].id;
		const onlyFriends =
			friendData?.friend && userProfile[0].settings?.profile === dataSettProfileVisible[2];

		return notConfigured || myProfile || openProfile || onlyFriends;
	}, [userProfile, user?.uid]);
	const isBanned =
		userProfile && userProfile[0]?.blocked && userBanChecker(userProfile[0].blocked.endBan);

	useEffect(() => {
		if ((userProfile && userProfile[0]) || isLoading) return;
		router.push("/404");
	}, [isLoading, userProfile]);

	if (!userProfile || !userProfile[0]) return <></>;

	return (
		<Layout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					{ctxMessage}
					<div className={classes.profile}>
						<span className={classes.role}>{userAccessInString(userProfile[0].access || 0)}</span>
						{isBanned && (
							<span className={classes.hasBan}>
								{`User was banned until ${convertTimestamp(
									userProfile[0].blocked?.endBan || null
								)}`}
							</span>
						)}
						<div className={classes.left}>
							<p className={classes.name}>{userProfile[0]?.name}</p>
							<div className={classes.ava}>
								<Image
									priority={true}
									src={userProfile[0]?.photoURL || defaultImage}
									width={500}
									height={500}
									alt={`avatar ${userProfile[0]?.name}`}
								/>
							</div>
						</div>
						<div className={classes.right}>
							{accessUserSettings ? (
								<Statistics userId={userProfile[0].id || ""} />
							) : (
								<p className={classes.accessFail}>
									{userProfile[0].settings?.profile === dataSettProfileVisible[1] &&
										"The user has closed access to all users."}
									{userProfile[0].settings?.profile === dataSettProfileVisible[2] &&
										"Viewing the profile is available only to the user's friends."}
								</p>
							)}
						</div>

						<div className={classes.btns}>
							{userProfile[0].id === user?.uid ? (
								<DefaultBtn
									classMode="clear"
									title="Edit profile"
									onClickHandler={() => router.push("/profile-edit")}
								>
									<TiEdit />
								</DefaultBtn>
							) : (
								<>
									{!friendData && (
										<DefaultBtn
											disabled={
												userProfile[0].settings?.friends
													? userProfile[0]?.settings?.friends !== dataSettFriend[0]
													: false
											}
											classMode="clear"
											title={
												userProfile[0].settings?.friends &&
												userProfile[0].settings?.friends !== dataSettFriend[0]
													? "The user has blocked adding to friends."
													: "Add to friends"
											}
											onClickHandler={onClickSend}
										>
											<AiOutlineUserAdd />
										</DefaultBtn>
									)}
									{friendData?.friend === false && (
										<p className={classes.sendReq} title="Under review">
											<BsClock />
										</p>
									)}
									{friendData?.friend && (
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
											userProfile[0].settings?.messages === dataSettMess[0]
												? "Send message"
												: userProfile[0].settings?.messages === dataSettMess[1]
												? "The user has disabled sending messages."
												: "Send messages only to friends"
										}
										onClickHandler={() => setIsActiveMess(true)}
										disabled={
											userProfile[0].settings?.messages === dataSettMess[1] ||
											(userProfile[0].settings?.messages === dataSettMess[2] && !friendData?.friend)
										}
									>
										<AiOutlineSend />
									</DefaultBtn>
								</>
							)}
						</div>
					</div>
					{(!userProfile[0].settings?.messages ||
						userProfile[0].settings?.messages === dataSettMess[0] ||
						(friendData?.friend && userProfile[0].settings?.messages === dataSettMess[2])) && (
						<Messages
							isActiveMess={isActiveMess}
							setIsActiveMess={setIsActiveMess}
							currUserId={userProfile[0].id}
						/>
					)}
				</>
			)}
		</Layout>
	);
};

export default UserProfile;
