import { IMessageFirebase } from "@/types/types";
import ContextMenu from "@Components/UI/contextMenu/ContextMenu";
import { db } from "@Project/firebase";
import {
	collection,
	deleteDoc,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	QuerySnapshot,
	setDoc,
	writeBatch,
} from "firebase/firestore";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAuthContext } from "../../../../../context/useAuthContext";

interface IProps {
	setUserContextMenu: Dispatch<SetStateAction<string>>;
	userContextMenu: string;
	setLatestMessage: Dispatch<SetStateAction<IMessageFirebase | null>>;
	latestMessage: IMessageFirebase | null;
	userName: string;
}

const UserCtxtMenu: FC<IProps> = ({
	setUserContextMenu,
	userContextMenu,
	setLatestMessage,
	latestMessage,
	userName,
}) => {
	const { user } = useAuthContext();
	const [userInList, setUserInList] = useState<boolean>();
	const closeCtxtMenu = () => {
		setUserContextMenu("");
	};

	useEffect(() => {
		if (!user) return;
		const checker = async () => {
			const q = doc(db, `users/${user.uid}/messages/${userContextMenu}`);
			const hasUserInList = await getDoc(q);
			if (hasUserInList.exists()) {
				setUserInList(true);
			} else {
				setUserInList(false);
			}
		};
		checker();
	}, []);

	const clearChat = async () => {
		try {
			if (!user) return;

			const q = query(collection(db, `users/${user.uid}/messages/${userContextMenu}/data`));
			const querySnapshot = await getDocs(q);

			const batch = writeBatch(db);

			querySnapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});

			await batch.commit();

			setLatestMessage(null);
		} catch (error) {
			console.error("Error clearing chat:", error);
		}
		setUserContextMenu("");
	};

	const onDeleteChat = async () => {
		try {
			if (!user) return;
			clearChat();
			await deleteDoc(doc(db, `users/${user.uid}/messages/${userContextMenu}`));

			setLatestMessage(null);
		} catch (error) {
			console.error("Error clearing chat:", error);
		}
		setUserContextMenu("");
	};

	const checkMailMass =
		userName !== "AnimeX"
			? { key: "visit", title: "Visit", href: `/profile/${userName}` }
			: { key: "visit", title: "Visit", disabled: true };

	const menuItems = [
		checkMailMass,
		{
			key: "clear chat",
			title: "Clear chat",
			disabled: !!!latestMessage,
			onClick: clearChat,
		},
		{ key: "delete chat", title: "Delete chat", onClick: onDeleteChat, disabled: !userInList },
	];

	return <ContextMenu menuItems={menuItems} closeCtxtMenu={closeCtxtMenu} />;
};

export default UserCtxtMenu;
