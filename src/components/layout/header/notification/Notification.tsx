import { useAuthContext } from "@/context/useAuthContext";
import { useOutside } from "@/hooks/useOutside";
import { IMessageFirebase } from "@/types/types";
import MiniModal from "@Components/UI/miniModal/MiniModal";
import { db } from "@Project/firebase";
import { Unsubscribe } from "firebase/auth";
import { collection, onSnapshot, query, where, getDocs, DocumentData } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";
import { MdNotifications } from "react-icons/md";
import classes from "./Notification.module.scss";

const Notification: FC = () => {
	const { pathname } = useRouter();
	const { user } = useAuthContext();
	const { isShow, setIsShow, ref } = useOutside(false);
	const [friendsRequests, setFriendsRequests] = useState(0);
	const [newMessages, setNewMessages] = useState(0);
	const [newChatMess, setNewChatMess] = useState(0);

	useEffect(() => {
		if (!user) return;

		const qFriends = query(
			collection(db, `users/${user.uid}/friends`),
			where("confirmator", "==", true)
		);
		const unsubscribeFriend = onSnapshot(qFriends, (querySnapshot) => {
			const friendsReqCount = querySnapshot.size;
			setFriendsRequests(friendsReqCount);
		});

		const qMainChat = query(
			collection(db, "chat"),
			where("answer", "array-contains", user.displayName)
		);
		const unsubscribeChat = onSnapshot(qMainChat, (qSnapshot) => {
			const chatMessCount = qSnapshot.size;
			setNewChatMess(chatMessCount);
		});

		const messCollectionQuery = query(collection(db, `users/${user.uid}/messages`));
		const unsubscribeMess = onSnapshot(messCollectionQuery, (messSnapshot) => {
			let promises: Promise<DocumentData>[] = [];
			messSnapshot.forEach((messDoc) => {
				const dataCollection = query(
					collection(messDoc.ref, "data"),
					where("checked", "==", false)
				);
				const uncheckedMessDocs = getDocs(dataCollection);
				promises.push(uncheckedMessDocs);
			});

			Promise.all(promises).then((snapshots) => {
				let count = 0;
				snapshots.forEach((uncheckMessSnapshot) => {
					count += uncheckMessSnapshot.size;
				});
				setNewMessages(count);
			});
		});

		return () => {
			unsubscribeFriend();
			unsubscribeMess();
			unsubscribeChat();
		};
	}, [user]);

	const disabledStatus = useMemo(() => {
		const totalNotifications = newMessages + friendsRequests + newChatMess;
		return totalNotifications > 0 ? false : true;
	}, [newMessages, friendsRequests, newChatMess]);

	const onClickHandler = () => {
		if (!disabledStatus) {
			setIsShow((prev) => !prev);
		}
	};

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
						{friendsRequests > 0 && (
							<li>
								<Link href="/friends">
									Friend requests: <span className={classes.count}>{friendsRequests}</span>
								</Link>
							</li>
						)}
						{newMessages > 0 && !pathname.includes("messages") && (
							<li>
								<Link href="/messages">
									New messages: <span className={classes.count}>{newMessages}</span>
								</Link>
							</li>
						)}
						{newChatMess > 0 && (
							<li>
								<Link href="#">
									Сhat replies: <span className={classes.count}>{newChatMess}</span>
								</Link>
							</li>
						)}
					</MiniModal>
				</div>
			)}
		</>
	);
};

export default Notification;
