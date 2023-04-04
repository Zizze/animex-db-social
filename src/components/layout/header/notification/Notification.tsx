import { useAuthContext } from "@/context/useAuthContext";
import { useOutside } from "@/hooks/useOutside";
import MiniModal from "@Components/UI/miniModal/MiniModal";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";
import { MdNotifications } from "react-icons/md";
import classes from "./Notification.module.scss";
import { getMessagesNotification } from "@/services/firebase/notifications/getMessages";
import { useCollectionSize } from "@/hooks/firebase/useCollectionSize";

const Notification: FC = () => {
	const { pathname } = useRouter();
	const { user } = useAuthContext();
	const [newMessages, setNewMessages] = useState(0);

	const { isShow, setIsShow, ref } = useOutside(false);

	const friendsRequests = useCollectionSize(`users/${user?.uid}/friends`, false, {
		where: [["confirmator", "==", true]],
	});
	const newChatMess = useCollectionSize("chat", false, {
		where: [["answer", "array-contains", user?.displayName || "*"]],
	});

	useEffect(() => {
		if (!user) return;
		getMessagesNotification(user.uid, setNewMessages);
	}, [user]);

	const disabledStatus = useMemo(() => {
		const totalNotifications = newMessages + friendsRequests + newChatMess;
		return totalNotifications > 0 ? false : true;
	}, [newMessages, friendsRequests, newChatMess]);

	const onClickHandler = () => {
		if (!disabledStatus) setIsShow((prev) => !prev);
	};

	const notifications = [
		{ title: "Friend requests", value: friendsRequests, href: "/friends" },
		{ title: "New messages", value: newMessages, href: "/messages" },
		{ title: "Сhat replies", value: newChatMess, href: "#" },
	];

	return (
		<>
			{user && (
				<div className={classes.notification} ref={ref}>
					<button
						disabled={disabledStatus}
						title="Notifiacation"
						className={classes.btn}
						onClick={onClickHandler}
					>
						<MdNotifications />
						{!disabledStatus && <div className={classes.indicator} />}
					</button>

					<MiniModal addClass={classes.modal} isShow={isShow}>
						{notifications.map(({ title, value, href }) => {
							if (href.includes("messages") && pathname.includes("messages")) return;
							if (!!value) {
								return (
									<li key={title}>
										<Link href={href}>
											{title}: <span className={classes.count}>{value}</span>
										</Link>
									</li>
								);
							}
						})}
					</MiniModal>
				</div>
			)}
		</>
	);
};

export default Notification;
