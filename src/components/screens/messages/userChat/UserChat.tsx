import { FC, FormEvent, useState, useEffect } from "react";
import classes from "./UserChat.module.scss";
import cn from "classnames";
import { useAuthContext } from "@/context/useAuthContext";
import {
	addDoc,
	collection,
	doc,
	DocumentData,
	getDoc,
	limit,
	onSnapshot,
	orderBy,
	query,
	QueryDocumentSnapshot,
	serverTimestamp,
	setDoc,
	startAfter,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { IMessageFirebase, IUserFirebase, IUserSettingsFirebase } from "@/types/types";
import { updateDoc } from "firebase/firestore";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import {
	dataSettFriend,
	dataSettMess,
} from "../../../layout/header/userSettings/userSettings.data";

const UserChat: FC<{ selectedUser: string }> = ({ selectedUser }) => {
	const { user } = useAuthContext();
	const [messages, setMessages] = useState<IMessageFirebase[]>([]);
	const [messTxt, setMessTxt] = useState("");

	const [userSetting, setUserSetting] = useState<IUserSettingsFirebase | null>();
	const [friendStatus, setFriendStatus] = useState<boolean | null>();

	const [lastVisibleMess, setLastVisibleMess] = useState<QueryDocumentSnapshot<DocumentData>>();
	const [isLastData, setIsLastData] = useState<boolean>();

	useEffect(() => {
		if (!user) return;
		if (selectedUser === "") return setMessages([]);
		const q = query(
			collection(db, `users/${user.uid}/messages/${selectedUser}`, "data"),
			orderBy("timestamp", "desc"),
			limit(15)
		);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const mess: IMessageFirebase[] = [];
			querySnapshot.forEach((doc) => {
				mess.push({ ...doc.data(), messageId: doc.id } as IMessageFirebase);
			});

			setMessages(mess);
			setIsLastData(mess.length > 14);
			setLastVisibleMess(querySnapshot.docs[querySnapshot.docs.length - 1]);
		});

		const getUserSettings = async () => {
			const currUserRef = doc(db, `users/${selectedUser}`);
			const currUserDoc = await getDoc(currUserRef);
			const userData = currUserDoc.data() as IUserFirebase;
			setUserSetting(userData?.settings || null);

			const friendRef = doc(db, `users/${user.uid}/friends/${selectedUser}`);
			const friendDoc = await getDoc(friendRef);
			if (friendDoc.exists()) setFriendStatus(friendDoc.data().friend);
		};
		getUserSettings();
		return () => unsubscribe();
	}, [selectedUser]);

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;
		if (messTxt.trim() === "") return;

		setMessTxt("");

		const senderRef = doc(db, `users/${user.uid}/messages/${selectedUser}`);
		const snapSender = await getDoc(senderRef);
		if (!snapSender.exists()) {
			await setDoc(senderRef, { lastUpdate: serverTimestamp() });
		} else {
			await updateDoc(senderRef, {
				lastUpdate: serverTimestamp(),
			});
		}
		await addDoc(collection(db, `users/${user.uid}/messages/${selectedUser}/data`), {
			checked: true,
			timestamp: serverTimestamp(),
			message: messTxt.trim(),
			sender: true,
		});

		const receiverRef = doc(db, `users/${selectedUser}/messages/${user.uid}`);
		const snapReceiver = await getDoc(receiverRef);
		if (!snapReceiver.exists()) {
			await setDoc(receiverRef, { lastUpdate: serverTimestamp() });
		} else {
			await updateDoc(receiverRef, {
				lastUpdate: serverTimestamp(),
			});
		}
		await addDoc(collection(db, `users/${selectedUser}/messages/${user.uid}/data`), {
			checked: false,
			timestamp: serverTimestamp(),
			message: messTxt.trim(),
			sender: false,
		});
	};

	const onLoadMore = async () => {
		if (!user) return;
		// setIsLoading(true);

		try {
			const moreData = query(
				collection(db, `users/${user.uid}/messages/${selectedUser}`, "data"),
				orderBy("timestamp", "desc"),
				startAfter(lastVisibleMess),
				limit(15)
			);

			const unsubscribe = onSnapshot(moreData, (querySnapshot) => {
				const mess: IMessageFirebase[] = [];
				querySnapshot.forEach((doc) => {
					mess.push({ ...doc.data(), messageId: doc.id } as IMessageFirebase);
				});
				setMessages((prev) => [...prev, ...mess]);
				setIsLastData(mess.length > 14);
				setLastVisibleMess(querySnapshot.docs[querySnapshot.docs.length - 1]);
			});

			return () => unsubscribe();
		} catch (error) {
			console.error("Error fetching users:", error);
		}

		// setIsLoading(false);
	};

	return (
		<div className={classes.wrapper}>
			<ul className={classes.chatList}>
				{messages.map((data) => {
					return (
						<li className={cn(data.sender && classes.currUser)} key={data.messageId}>
							<p>{data.message}</p>
						</li>
					);
				})}
				{isLastData && (
					<DefaultBtn
						classMode="clear"
						className={classes.btnMore}
						title="Load more"
						onClickHandler={onLoadMore}
					>
						Load more...
					</DefaultBtn>
				)}
			</ul>
			{selectedUser !== "" ? (
				(userSetting?.messages === dataSettMess[2] && friendStatus) ||
				userSetting?.messages === dataSettMess[0] ||
				!userSetting ? (
					<TextAreaForm
						onSubmitHandler={onSubmitHandler}
						text={messTxt}
						setText={setMessTxt}
						placeholder="Your message..."
					/>
				) : (
					selectedUser !== "AnimeX" && (
						<p className={classes.notSelected}>
							{userSetting?.messages === dataSettMess[2]
								? "Only friends can write to this user."
								: "This user has closed his mail from everyone."}
						</p>
					)
				)
			) : (
				<p className={classes.notSelected}>User not selected.</p>
			)}
		</div>
	);
};

export default UserChat;
