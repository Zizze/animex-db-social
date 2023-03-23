import { IFriendFirebase, IUserFirebase } from "@/types/types";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import classes from "./User.module.scss";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { MdPersonAdd, MdPersonAddDisabled } from "react-icons/md";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import defaulImage from "@Public/testava.jpg";
import { dataSettFriend } from "../../../layout/header/userSettings/userSettings.data";
import Link from "next/link";

interface IProps {
	currUser: IUserFirebase;
	requestsPage?: boolean;
	nameCategory?: string;
}

const User: FC<IProps> = ({ currUser, requestsPage = false, nameCategory }) => {
	const [isHideUser, setIsHideUser] = useState(false);
	const [friendStatus, setFriendStatus] = useState<boolean | string>();
	const { user } = useAuthContext();

	const { name, photoURL, id, settings } = currUser;

	const onClickSent = async () => {
		if (!user) return;
		const sendingUserRef = doc(db, `users/${user?.uid}/friends`, `${id}`);
		await setDoc(sendingUserRef, {
			friend: false,
			confirmator: false,
		});

		const сonfirmUserRef = doc(db, `users/${id}/friends`, `${user?.uid}`);
		await setDoc(сonfirmUserRef, {
			friend: false,
			confirmator: true,
		});
	};

	const onClickRemove = async () => {
		await deleteDoc(doc(db, `users/${user?.uid}/friends`, `${id}`));
		await deleteDoc(doc(db, `users/${id}/friends`, `${user?.uid}`));

		if (requestsPage || nameCategory) setIsHideUser(true);
	};

	useEffect(() => {
		if (!requestsPage) {
			const unsub = onSnapshot(doc(db, `users/${user?.uid}/friends`, `${id}`), (doc) => {
				if (doc.exists()) {
					const getData: IFriendFirebase = doc.data() as IFriendFirebase;
					setFriendStatus(getData.friend);
				} else {
					setFriendStatus("empty");
				}
			});
			return () => unsub();
		}
	}, [user]);

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
							{friendStatus === "empty" && (
								<DefaultBtn
									disabled={settings?.friends ? settings?.friends !== dataSettFriend[0] : false}
									classMode="clear"
									title={
										settings?.friends && settings?.friends !== dataSettFriend[0]
											? "The user has blocked adding to friends."
											: "Add to friends"
									}
									onClickHandler={onClickSent}
								>
									<AiOutlineUserAdd />
								</DefaultBtn>
							)}
							{friendStatus === false && <p>Under review</p>}
							{friendStatus === true && (
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
