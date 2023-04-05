import { FC, FormEvent, useState, useMemo, useCallback } from "react";
import classes from "./PersonalChat.module.scss";
import cn from "classnames";
import { useAuthContext } from "@/context/useAuthContext";
import { IMessageFirebase, IUserFirebase, IFriendFirebase } from "@/types/types";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import { messagesSettingsOptions } from "@Components/layout/header/userSettings/settingsOptions.data";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import { sendPersonalMessage } from "@/services/firebase/sendPersonalMessage";
import { popMessage } from "@/utils/popMessage/popMessage";
import Loading from "@Components/UI/loading/Loading";

const MESSAGES_LIMIT = 15;

const PersonalChat: FC<{ selectedUser: string }> = ({ selectedUser }) => {
	const { user } = useAuthContext();
	const [messTxt, setMessTxt] = useState("");
	const { popError, ctxMessage } = popMessage();
	const [isSending, setIsSending] = useState(false);

	const {
		data: messages,
		loadMoreData,
		isLoading,
		isLastDocs,
	} = useCollectionRealtime<IMessageFirebase>(
		`users/${user?.uid}/messages/${selectedUser}/data`,
		{ orderBy: ["timestamp", "desc"], limit: MESSAGES_LIMIT },
		!selectedUser.length
	);

	const { data: userProfile } = useRealtimeDoc<IUserFirebase>(
		`users/${selectedUser}`,
		!selectedUser.length
	);
	const selectedUserSettings = userProfile?.settings || null;

	const { data: userInFriends } = useRealtimeDoc<IFriendFirebase>(
		`users/${user?.uid}/friends/${selectedUser}`,
		!selectedUser.length
	);

	const onSubmitHandler = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			if (user && userProfile && messTxt.trim().length > 1) {
				try {
					setIsSending(true);
					await sendPersonalMessage({
						senderId: user.uid,
						receiverId: userProfile.id,
						message: messTxt,
					});
					setMessTxt("");
				} catch {
					popError("Error sending message.");
				} finally {
					setIsSending(false);
				}
			}
		},
		[user?.uid, userProfile?.id, messTxt]
	);

	const friendStatus = useMemo(() => userInFriends?.friend || null, [userInFriends]);
	return (
		<div className={classes.wrapper}>
			{ctxMessage}
			{(isSending || isLoading) && <Loading />}
			<ul className={classes.chatList}>
				{messages?.map(({ sender, message, timestamp }, index) => {
					return (
						<li className={cn(sender && classes.currUser)} key={timestamp?.toString() + index}>
							<p>{message}</p>
						</li>
					);
				})}
				{!isLastDocs && selectedUser.length && (
					<DefaultBtn
						classMode="clear"
						className={classes.btnMore}
						title="Load more"
						onClickHandler={loadMoreData}
					>
						Load more...
					</DefaultBtn>
				)}
			</ul>
			{selectedUser.length ? (
				selectedUserSettings?.messages === messagesSettingsOptions[0] ||
				(selectedUserSettings?.messages === messagesSettingsOptions[2] && friendStatus) ||
				!selectedUserSettings ? (
					<TextAreaForm
						onSubmitHandler={onSubmitHandler}
						text={messTxt}
						setText={setMessTxt}
						placeholder="Your message..."
					/>
				) : (
					selectedUser !== "AnimeX" && (
						<p className={classes.notSelected}>
							{selectedUserSettings?.messages === messagesSettingsOptions[2]
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

export default PersonalChat;
