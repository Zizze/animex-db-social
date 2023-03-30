import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
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
	const dataRef = `users/${user?.uid}/messages/${userProfile?.id}/data`;

	const getNewMessCounter = useCollectionSize(dataRef, false, {
		where: [["checked", "==", false]],
		limit: 30,
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

		try {
			await batchWrite(`users/${user.uid}/messages/${userProfile.id}/data`, {
				dataAction: { checked: true },
				type: "update",
				queryOptions: { where: [["checked", "==", false]] },
			});
			setUserContextMenu("");
			setSelectedUser(userProfile.id);
		} catch (err) {
			popError("Error messages: notification swap status.");
		}
	}, [userProfile?.id, user?.uid]);

	const onContextMenu = useCallback(
		(e: MouseEvent) => {
			if (!userProfile) return;
			e.preventDefault();

			setUserContextMenu(userProfile.id);
			// setSelectedUser(userProfile.id);
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
								<p>
									{latestMessage[0].message.length > 10
										? `${latestMessage[0].message.slice(0, 6)}...`
										: latestMessage[0].message}
								</p>
							)}
							{newMessCounter && <span>{newMessCounter}</span>}
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
