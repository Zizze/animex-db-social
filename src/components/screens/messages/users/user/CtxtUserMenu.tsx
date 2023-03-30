import { useAuthContext } from "@/context/useAuthContext";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import { batchWrite } from "@/services/firebase/writeBatch";
import ContextMenu from "@Components/UI/contextMenu/ContextMenu";
import { db } from "@Project/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Dispatch, FC, SetStateAction, useCallback } from "react";

interface IProps {
	onReloadLatestMess: () => void;
	setUserContextMenu: Dispatch<SetStateAction<string>>;
	userContextMenu: string;
	includesMessages: boolean;
	userName: string;
	popMessage: {
		popError: (mess: string, duration?: number) => void;
		popSuccess: (mess: string, duration?: number) => void;
	};
}

const CtxtUserMenu: FC<IProps> = ({
	setUserContextMenu,
	userContextMenu,
	includesMessages,
	userName,
	popMessage,
	onReloadLatestMess,
}) => {
	const { user } = useAuthContext();
	const { data: userInList } = useRealtimeDoc<{ id: string }>(
		`users/${user?.uid}/messages/${userContextMenu}`
	);

	const clearChat = useCallback(async () => {
		if (!user || !userContextMenu.length) return;
		try {
			await batchWrite(`users/${user.uid}/messages/${userContextMenu}/data`, { type: "delete" });
			popMessage.popSuccess(`Chat with ${userName} cleared.`);
			setUserContextMenu("");
			onReloadLatestMess();
		} catch {
			popMessage.popError("Error clearing chat.");
		}
	}, [user?.uid, userContextMenu]);

	const onDeleteChat = useCallback(async () => {
		if (!user || !userContextMenu.length) return;
		try {
			await clearChat();
			await deleteDoc(doc(db, `users/${user.uid}/messages/${userContextMenu}`));
			popMessage.popSuccess(`Chat with ${userName} deleted.`);
			setUserContextMenu("");
		} catch (error) {
			popMessage.popError("Error deleting chat.");
		}
	}, [user?.uid, userContextMenu]);

	const checkMailMass =
		userName !== "AnimeX"
			? { key: "visit", title: "Visit", href: `/profile/${userName}` }
			: { key: "visit", title: "Visit", disabled: true };

	const menuItems = [
		checkMailMass,
		{
			key: "clear chat",
			title: "Clear chat",
			disabled: includesMessages,
			onClick: clearChat,
		},
		{ key: "delete chat", title: "Delete chat", onClick: onDeleteChat, disabled: !userInList },
	];

	return <ContextMenu menuItems={menuItems} closeCtxtMenu={() => setUserContextMenu("")} />;
};

export default CtxtUserMenu;
