import { ISupportAnswerFirebase, ISupportFirebase, IUserFirebase } from "@/types/types";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { db } from "@Project/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { FC, FormEvent, useEffect, useState } from "react";
import { TbLock, TbLockOpen } from "react-icons/tb";
import classes from "./Message.module.scss";

import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import cn from "classnames";
import AdminResponse from "./adminResponse/AdminResponse";
import Link from "next/link";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import { useAuthContext } from "@/context/useAuthContext";
import { checkCreateData } from "@/utils/checkCreateData";
import { sendEmail } from "@/services/emailJS";
import { popMessage } from "@/utils/popMessage/popMessage";
import Loading from "@Components/UI/loading/Loading";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import BigImage from "./bigImage/BigImage";

interface UserWithSupportMess {
	info: IUserFirebase;
	comment: ISupportAnswerFirebase;
}

const Message: FC<{ message: ISupportFirebase }> = ({ message }) => {
	const { user, userStorage } = useAuthContext();

	const supportRef = doc(db, `support/${message.docId}`);

	const { data: mess } = useRealtimeDoc<ISupportFirebase>(`support/${message.docId}`);
	const { data: authorProfile } = useRealtimeDoc<IUserFirebase>(`users/${message.userId}`);
	const [adminsFullInfo, setAdminsFullInfo] = useState<UserWithSupportMess[]>([]);

	const [text, setText] = useState("");
	const [showInfo, setShowInfo] = useState(false);
	const { popError, popSuccess, ctxMessage } = popMessage();
	const [isLoading, setIsLoading] = useState(true);
	const [hideMess, setHideMess] = useState(false);

	const [showFullImage, setShowFullImage] = useState({ url: "", visible: false });

	useEffect(() => {
		const getAdminProfileWithMessage = async () => {
			setIsLoading(true);

			if (mess && mess.answers) {
				const admProfiles: UserWithSupportMess[] = [];
				const adminRefs = mess.answers.map((adminMess) => doc(db, `users/${adminMess.adminId}`));
				const adminDocs = await Promise.all(adminRefs.map(getDoc));
				adminDocs.forEach((doc, index) => {
					if (doc.exists() && mess.answers) {
						const adminMess = mess.answers[index];
						admProfiles.push({ info: doc.data(), comment: adminMess } as UserWithSupportMess);
					}
				});
				setAdminsFullInfo(admProfiles);
			}
		};
		getAdminProfileWithMessage();
		setIsLoading(false);
	}, [mess]);

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (text.trim().length < 10) return;
		if (user && (userStorage?.access || 0) > 0 && authorProfile) {
			setIsLoading(true);

			const supportDoc = await getDoc(supportRef);

			if (supportDoc.exists()) {
				const currentAnswers: ISupportAnswerFirebase[] = supportDoc.data().answers;
				const newAnswer = {
					adminId: user.uid,
					message: text,
					timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
				};
				const updatedAnswers = currentAnswers ? [newAnswer, ...currentAnswers] : [newAnswer];
				await updateDoc(supportRef, { answers: updatedAnswers });

				setText("");
				try {
					sendEmail({
						admin_name: user.displayName || "",
						user_name: authorProfile.name || "",
						answer: text,
						user_message: message.message,
						user_email: message.email,
					});
					popSuccess("The answer was successfully sent to the mail.");
				} catch {
					popError("Failed to send reply email.");
				} finally {
					setIsLoading(false);
				}
			}
		}
	};

	const changeThemeStatus = async () => {
		if (!user && (userStorage || 0) === 0) return;

		await updateDoc(supportRef, { closed: !message.closed });
		setHideMess(true);
	};

	const imageFullScreen = (imageUrl: string) => {
		setShowFullImage({ url: imageUrl, visible: true });
	};

	return (
		<>
			{ctxMessage}
			{isLoading && <Loading />}
			{showFullImage.visible && (
				<ModalWrapper
					onClickHandler={() => setShowFullImage((prev) => ({ ...prev, visible: false }))}
				>
					<BigImage imageUrl={showFullImage.url} />
				</ModalWrapper>
			)}

			{!hideMess && (
				<li className={cn(classes.message, showInfo && classes.visible)}>
					<div className={classes.theme}>
						<DefaultBtn
							className={classes.lock}
							classMode={mess && mess.closed ? "decline" : "clear"}
							onClickHandler={changeThemeStatus}
							title={mess && mess.closed ? "Open theme" : "Close theme"}
						>
							{mess && mess.closed ? <TbLock /> : <TbLockOpen />}
						</DefaultBtn>
						<p>{message.title}</p>
					</div>
					<div className={classes.mainInfo}>
						<Link className={classes.userLink} href={`profile/${authorProfile?.name}`}>
							<Image
								src={authorProfile?.photoURL || defaultImage}
								height={150}
								width={150}
								alt={`${authorProfile?.name} ava`}
							/>
							<span>{authorProfile?.name}</span>
						</Link>
						<div className={classes.flex}>
							<button onClick={() => setShowInfo((prev) => !prev)}>
								{showInfo ? "hide info" : "show more info"}
							</button>
							<p className={classes.createDate}>{checkCreateData(message.timestamp.seconds)}</p>
						</div>
					</div>
					<div className={classes.main}>
						<p className={classes.userText}>{message.message}</p>

						{mess?.files && mess?.files.length && (
							<ul className={classes.imagesList}>
								{mess.files.map((file) => {
									return (
										<li key={file.downloadURL}>
											<button onClick={() => imageFullScreen(file.downloadURL)}>
												<Image src={file.downloadURL} width={500} height={300} alt="" />
											</button>
										</li>
									);
								})}
							</ul>
						)}

						{!message.closed && (
							<TextAreaForm
								classes={{ cnForm: classes.textAreaForm, cnEmoji: classes.emojiWindow }}
								setText={setText}
								text={text}
								placeholder="Enter answer..."
								onSubmitHandler={onSubmitHandler}
								minLenght={10}
							/>
						)}
						{message.answers && message.answers?.length > 0 && (
							<div className={classes.responses}>
								<p>Admins responses</p>
								<ul className={classes.adminMessages}>
									{adminsFullInfo.map((admin, i) => (
										<AdminResponse key={admin.info.id + i} admin={admin} docId={message.docId} />
									))}
								</ul>
							</div>
						)}
					</div>
				</li>
			)}
		</>
	);
};

export default Message;
