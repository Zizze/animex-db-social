import { IFriendFirebase, IUserFirebase } from "@/types/types";
import Image from "next/image";
import { FC, useState } from "react";
import classes from "./User.module.scss";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { MdPersonAdd, MdPersonAddDisabled } from "react-icons/md";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import defaulImage from "@Public/testava.jpg";
import Link from "next/link";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import { friendsSettingsOptions } from "@Components/layout/header/userSettings/settingsOptions.data";

interface IProps {
	currUser: IUserFirebase;
	requestsPage?: boolean;
	nameCategory?: string;
}

const User: FC<IProps> = ({ currUser, requestsPage = false, nameCategory }) => {
	const [isHideUser, setIsHideUser] = useState(false);
	const { user } = useAuthContext();
	const { name, photoURL, id, settings } = currUser;

	const { data: friendInfo } = !requestsPage
		? useRealtimeDoc<IFriendFirebase>(`users/${user?.uid}/friends/${id}`)
		: { data: null };

	const onClickSent = async () => {
		if (!user) return;
		const sendingUserRef = doc(db, `users/${user?.uid}/friends/${id}`);
		await setDoc(sendingUserRef, {
			friend: false,
			confirmator: false,
		});

		const сonfirmUserRef = doc(db, `users/${id}/friends/${user?.uid}`);
		await setDoc(сonfirmUserRef, {
			friend: false,
			confirmator: true,
		});
	};

	const onClickRemove = async () => {
		await deleteDoc(doc(db, `users/${user?.uid}/friends/${id}`));
		await deleteDoc(doc(db, `users/${id}/friends/${user?.uid}`));

		if (requestsPage || nameCategory) setIsHideUser(true);
	};

	const onClickAccept = async () => {
		if (!user) return;
		const confirmUserRef = doc(db, `users/${user?.uid}/friends`, `${id}`);
		await setDoc(confirmUserRef, {
			friend: true,
		});

		const sentUserRef = doc(db, `users/${id}/friends`, `${user?.uid}`);
		await setDoc(sentUserRef, {
			friend: true,
		});

		setIsHideUser(true);
	};

	if (currUser.name_lowercase === "animex") return <></>;
	return (
		<>
			{!isHideUser && (
				<li className={classes.user}>
					<div className={classes.info}>
						<Link href={`/profile/${name}`}>
							<div className={classes.image}>
								<Image
									src={photoURL ? photoURL : defaulImage}
									alt={`${name} photo`}
									width={150}
									height={150}
								/>
							</div>

							<h5 className={classes.name}>{name}</h5>
						</Link>
					</div>
					{!requestsPage && (
						<div className={classes.btns}>
							{friendInfo === null && (
								<DefaultBtn
									disabled={
										settings?.friends ? settings?.friends !== friendsSettingsOptions[0] : false
									}
									classMode="clear"
									title={
										settings?.friends && settings?.friends !== friendsSettingsOptions[0]
											? "The user has blocked adding to friends."
											: "Add to friends"
									}
									onClickHandler={onClickSent}
								>
									<AiOutlineUserAdd />
								</DefaultBtn>
							)}
							{friendInfo?.friend === false && <p>Under review</p>}
							{friendInfo?.friend === true && (
								<DefaultBtn
									classMode="decline"
									title="Remove friend"
									onClickHandler={onClickRemove}
								>
									<AiOutlineUserDelete />
								</DefaultBtn>
							)}
						</div>
					)}
					{requestsPage && (
						<div className={classes.btns}>
							<DefaultBtn classMode="clear" title="Accept" onClickHandler={onClickAccept}>
								<MdPersonAdd />
							</DefaultBtn>
							<DefaultBtn classMode="decline" title="Decline" onClickHandler={onClickRemove}>
								<MdPersonAddDisabled />
							</DefaultBtn>
						</div>
					)}
				</li>
			)}
		</>
	);
};

export default User;
