import { FC, FormEvent, useState, useMemo, useCallback, SetStateAction, Dispatch } from "react";
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
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import Link from "next/link";
import { uploadFilesInStorage } from "@/services/firebase/uploadFilesInStorage";
import Message from "./message/Message";

const MESSAGES_LIMIT = 15;

interface IProps {
	selectedUser: string;
	setSelectedUser: Dispatch<SetStateAction<string>>;
}

const PersonalChat: FC<IProps> = ({ selectedUser, setSelectedUser }) => {
	const { user } = useAuthContext();
	const [messTxt, setMessTxt] = useState("");
	const { popError, ctxMessage } = popMessage();
	const [isSending, setIsSending] = useState(false);
	const [files, setFiles] = useState<File[]>([]);

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
			if (!messTxt.trim().length && files.length < 1) return;

			if (user && userProfile) {
				try {
					setIsSending(true);
					await sendPersonalMessage({
						senderId: user.uid,
						receiverId: userProfile.id,
						message: messTxt,
						files: files.map((file) => ({
							id: user.uid + file.size + file.name,
							type: file.type,
							name: file.name,
						})),
					});
					if (files.length) {
						for (const file of files) {
							uploadFilesInStorage(file, user.uid + file.size + file.name);
						}
						setFiles([]);
					}
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
		<div className={cn(classes.wrapper, !selectedUser.length && classes.none)}>
			{ctxMessage}
			{(isSending || isLoading) && <Loading />}

			{userProfile && !!selectedUser.length && (
				<div className={classes.chatHeader}>
					<button onClick={() => setSelectedUser("")}>Back</button>
					<Link href={`/profile/${userProfile.name}`}>{userProfile.name}</Link>
					<Link href={`/profile/${userProfile.name}`}>
						<Image
							src={userProfile.photoURL || defaultImage}
							width={50}
							height={50}
							alt={`${userProfile.name} ava`}
						/>
					</Link>
				</div>
			)}
			{!!selectedUser.length && (
				<ul className={classes.chatList}>
					{messages?.map((message, index) => (
						<Message messageObj={message} key={message.timestamp?.toString() + index} />
					))}

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
			)}
			{selectedUser.length ? (
				selectedUserSettings?.messages === messagesSettingsOptions[0] ||
				(selectedUserSettings?.messages === messagesSettingsOptions[2] && friendStatus) ||
				!selectedUserSettings ? (
					<TextAreaForm
						onSubmitHandler={onSubmitHandler}
						text={messTxt}
						setText={setMessTxt}
						placeholder="Your message..."
						uploadFisible={true}
						files={files}
						setFiles={setFiles}
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
