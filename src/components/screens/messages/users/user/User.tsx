import { Dispatch, FC, MouseEvent, SetStateAction, useState, useEffect } from "react";
import classes from "./User.module.scss";
import defaultImage from "@Public/testava.jpg";
import Image from "next/image";
import cn from "classnames";
import { useMemo, useCallback } from "react";
import { useAuthContext } from "@/context/useAuthContext";
import CtxtUserMenu from "./CtxtUserMenu";
import { checkCreateData } from "@/utils/checkCreateData";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import { useCollectionSize } from "@/hooks/firebase/useCollectionSize";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { IMessageFirebase, IUserFirebase } from "@/types/types";
import { batchWrite } from "@/services/firebase/writeBatch";
import { popMessage } from "@/utils/popMessage/popMessage";

interface IProps {
	userId: string;
	setSelectedUser: Dispatch<SetStateAction<string>>;
	selectedUser: string;
	setUserContextMenu: Dispatch<SetStateAction<string>>;
	userContextMenu: string;
}

const MESS_COUNTER_LIMIT = 30;

const User: FC<IProps> = ({
	userId,
	setSelectedUser,
	selectedUser,
	setUserContextMenu,
	userContextMenu,
}) => {
	const { user } = useAuthContext();
	const [lastSentDate, setLastSentDate] = useState<string | null>(null);
	const { popError, popSuccess, ctxMessage } = popMessage();

	const { data: userProfile } = useRealtimeDoc<IUserFirebase>(`users/${userId}`);
	const dataRef = `users/${user?.uid}/messages/${userId}/data`;

	const getNewMessCounter = useCollectionSize(dataRef, false, {
		where: [["checked", "==", false]],
		limit: MESS_COUNTER_LIMIT,
	});
	const newMessCounter = useMemo(
		() => (getNewMessCounter === 0 ? null : getNewMessCounter),
		[getNewMessCounter]
	);

	const { data: latestMessage, onReload: onReloadLatestMess } =
		useCollectionRealtime<IMessageFirebase>(dataRef, {
			orderBy: ["timestamp", "desc"],
			limit: 1,
		});

	const onSelectUser = useCallback(async () => {
		if (!userProfile?.id || !user) return;

		setUserContextMenu("");
		setSelectedUser(userProfile.id);
	}, [userProfile?.id, user?.uid]);

	const onContextMenu = useCallback(
		(e: MouseEvent) => {
			if (!userProfile) return;
			e.preventDefault();

			setUserContextMenu(userProfile.id);
		},
		[userProfile]
	);

	useMemo(
		() =>
			latestMessage && latestMessage[0]
				? setLastSentDate(checkCreateData(latestMessage[0].timestamp?.seconds) || null)
				: setLastSentDate(null),
		[latestMessage]
	);

	const classnames = useMemo(
		() => cn(classes.list, selectedUser === userProfile?.id && classes.active),
		[selectedUser, userProfile?.id]
	);

	useEffect(() => {
		if (userProfile) {
			const checkUserSelected =
				selectedUser === userProfile.id || userContextMenu === userProfile.id;
			if (checkUserSelected) {
				try {
					batchWrite(`users/${user?.uid}/messages/${userProfile.id}/data`, {
						dataAction: { checked: true },
						type: "update",
						queryOptions: { where: [["checked", "==", false]] },
					});
				} catch (err) {
					popError("Error messages: notification swap status.");
				}
			}
		}
	}, [selectedUser, userProfile?.id, latestMessage, userContextMenu]);

	return (
		<>
			{ctxMessage}
			<li className={classnames}>
				<button className={classes.userBtn} onClick={onSelectUser} onContextMenu={onContextMenu}>
					<div className={classes.avaBlock}>
						<Image
							src={userProfile?.photoURL || defaultImage}
							height={150}
							width={150}
							alt="User ava"
						/>
					</div>
					<div className={classes.infoBlock}>
						<div className={classes.mainInfo}>
							<h5>{userProfile?.name}</h5>
							{latestMessage && <span>{lastSentDate}</span>}
						</div>
						<div className={classes.complement}>
							{latestMessage && latestMessage[0] && (
								<p>{latestMessage[0].message.length ? latestMessage[0].message : "Files"}</p>
							)}
							{newMessCounter && selectedUser !== userProfile?.id && <span>{newMessCounter}</span>}
						</div>
					</div>
				</button>
				{userContextMenu === userProfile?.id && (
					<CtxtUserMenu
						setUserContextMenu={setUserContextMenu}
						userContextMenu={userContextMenu}
						includesMessages={!latestMessage?.length}
						userName={userProfile.name}
						popMessage={{ popError, popSuccess }}
						onReloadLatestMess={onReloadLatestMess}
					/>
				)}
			</li>
		</>
	);
};

export default User;
