import React, {
	Dispatch,
	FC,
	MouseEvent,
	MouseEventHandler,
	SetStateAction,
	useState,
} from "react";
import { IUserFirebase, IMessageFirebase } from "../../../../../types/types";
import classes from "./User.module.scss";
import defaultImage from "@Public/testava.jpg";
import Image from "next/image";
import cn from "classnames";
import { useEffect } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import {
	collection,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	where,
	writeBatch,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import UserCtxtMenu from "./UserCtxtMenu";
import { checkCreateData } from "@/utils/checkCreateData";

interface IProps {
	user: IUserFirebase;
	setSelectedUser: Dispatch<SetStateAction<string>>;
	selectedUser: string;

	setUserContextMenu: Dispatch<SetStateAction<string>>;
	userContextMenu: string;
}

const User: FC<IProps> = ({
	user,
	setSelectedUser,
	selectedUser,
	setUserContextMenu,
	userContextMenu,
}) => {
	const auth = useAuthContext();
	const [latestMessage, setLatestMessage] = useState<IMessageFirebase | null>(null);
	const [lastSentDate, setLastSentDate] = useState<string | null>(null);
	const [newMessCounter, setNewMessCounter] = useState<number | null>(null);

	useEffect(() => {
		if (!auth.user) return;

		const collectionRef = collection(db, `users/${auth.user.uid}/messages/${user.id}/data`);
		const lastMessQuery = query(collectionRef, orderBy("timestamp", "desc"), limit(1));
		const newMessCounterQ = query(collectionRef, where("checked", "==", false), limit(30));

		const unsubscribeLastMess = onSnapshot(lastMessQuery, (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if (doc.exists()) {
					const latestMess = doc.data() as IMessageFirebase;
					const timestamp = doc.data().timestamp && doc.data().timestamp.seconds;

					setLatestMessage({ ...latestMess, timestamp });
				} else {
					setLatestMessage(null);
				}
			});
		});

		const unsubscribeNewMessCount = onSnapshot(newMessCounterQ, (querySnapshot) => {
			const count = querySnapshot.size;
			setNewMessCounter(count === 0 ? null : count);
		});

		return () => {
			unsubscribeNewMessCount();
			unsubscribeLastMess();
		};
	}, [auth.user]);

	const onSelectUser = async () => {
		if (user.id === "") return;
		if (!auth.user) return;
		setUserContextMenu("");
		setSelectedUser(user.id);
		const collectionRef = collection(db, `users/${auth.user.uid}/messages/${user.id}/data`);
		const newMess = query(collectionRef, where("checked", "==", false));

		const querySnapshot = await getDocs(newMess);
		const batch = writeBatch(db);

		querySnapshot.forEach((doc) => {
			const docRef = doc.ref;
			batch.update(docRef, { checked: true });
		});

		await batch.commit();
	};

	useEffect(() => {
		if (latestMessage) {
			const dateCheck = checkCreateData(+latestMessage.timestamp);
			if (dateCheck) setLastSentDate(dateCheck);
		}
	}, [latestMessage]);

	const classnames = cn(classes.list, selectedUser === user.id && classes.active);

	const onContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setUserContextMenu(user.id);
	};

	return (
		<li className={classnames}>
			<button className={classes.userBtn} onClick={onSelectUser} onContextMenu={onContextMenu}>
				<div className={classes.avaBlock}>
					<Image src={user.photoURL || defaultImage} height={150} width={150} alt="User ava" />
				</div>
				<div className={classes.infoBlock}>
					<div className={classes.mainInfo}>
						<h5>{user.name}</h5>
						{latestMessage && latestMessage?.timestamp && <span>{lastSentDate}</span>}
					</div>
					<div className={classes.complement}>
						{latestMessage && (
							<p>
								{latestMessage.message.length > 10
									? `${latestMessage.message.slice(0, 6)}...`
									: latestMessage.message}
							</p>
						)}
						{newMessCounter && <span>{newMessCounter}</span>}
					</div>
				</div>
			</button>
			{userContextMenu === user.id && (
				<UserCtxtMenu
					setUserContextMenu={setUserContextMenu}
					userContextMenu={userContextMenu}
					setLatestMessage={setLatestMessage}
					latestMessage={latestMessage}
					userName={user.name}
				/>
			)}
		</li>
	);
};

export default User;
