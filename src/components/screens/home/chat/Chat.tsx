import { FC, useState, useEffect, MouseEvent } from "react";
import classes from "./Chat.module.scss";
import Message from "./message/Message";
import { IMainChatFirebase, IUserFirebase } from "@/types/types";
import {
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
	where,
	writeBatch,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import Write from "./write/Write";
import { TfiMoreAlt } from "react-icons/tfi";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { BsChatDotsFill } from "react-icons/bs";
import { useOutside } from "@/hooks/useOutside";
import Loading from "@Components/UI/loading/Loading";
import cn from "classnames";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineClose } from "react-icons/ai";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";

const Chat: FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [fullscreenActive, setFullscreenActive] = useState(false);
	const { user } = useAuthContext();
	const { isShow, setIsShow, ref } = useOutside(false);
	const [isLastDataMess, setIsLastDataMess] = useState<boolean>();
	const [messages, setMessages] = useState<IMainChatFirebase[]>([]);
	const [answerToUser, setAnswerToUser] = useState<string[]>([]);
	const [lastVisibleMessage, setLastVisibleMessage] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);

	const [notifCount, setNotifCount] = useState(0);

	useEffect(() => {
		if (lastVisibleMessage) return;
		const q = query(collection(db, "chat"), orderBy("timestamp", "desc"), limit(10));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			setLastVisibleMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);

			const messagesFull: IMainChatFirebase[] = [];
			querySnapshot.forEach((mess) => {
				const getMessage: IMainChatFirebase = mess.data() as IMainChatFirebase;

				onSnapshot(doc(db, "users", getMessage.id), (author) => {
					const getUser: IUserFirebase = author.data() as IUserFirebase;

					messagesFull.push({
						...getMessage,
						messageId: mess.id,
						author: getUser,
					} as IMainChatFirebase);

					setMessages(messagesFull);
					setIsLastDataMess(messagesFull.length > 9);
					setIsLoading(false);
				});
			});
		});

		return () => unsubscribe();
	}, [lastVisibleMessage]);

	const onLoadMore = async () => {
		setIsLoading(true);

		const moreData = query(
			collection(db, "chat"),
			orderBy("timestamp", "desc"),
			startAfter(lastVisibleMessage),
			limit(10)
		);
		const docsSnapshot = await getDocs(moreData);
		const dataMess: IMainChatFirebase[] = [];

		for (const mess of docsSnapshot.docs) {
			const messDoc = mess.data() as IMainChatFirebase;
			const docRef = doc(db, "users", messDoc.id);
			const docSnap = await getDoc(docRef);

			dataMess.push({
				...messDoc,
				messageId: mess.id,
				author: docSnap.data(),
			} as IMainChatFirebase);
		}

		setMessages((prev) => [...prev, ...dataMess]);
		setIsLastDataMess(dataMess.length > 9);
		setIsLoading(false);
	};

	const onToggleChat = (action: string) => {
		switch (action) {
			case "close":
				setIsShow(false);
				return;
			case "open":
				setIsShow(true);
				return;
		}
	};

	useEffect(() => {
		if (!user) return;
		const q = query(collection(db, "chat"), where("answer", "array-contains", user?.displayName));
		const unsubscribe = onSnapshot(q, (qSnapshot) => {
			setNotifCount(qSnapshot.size);
		});

		const checkNotifications = async () => {
			const querySnapshot = await getDocs(q);
			const batch = writeBatch(db);

			querySnapshot.forEach((doc) => {
				const docRef = doc.ref;
				batch.update(docRef, {
					answer: doc.data().answer.filter((userName: string) => userName !== user?.displayName),
				});
			});

			await batch.commit();
		};

		isShow && checkNotifications();

		return () => unsubscribe();
	}, [user, isShow, messages]);

	const onRemoveAnswer = (userName: string) => {
		const filtered = answerToUser.filter((user) => user !== userName);
		setAnswerToUser(filtered);
	};

	return (
		<>
			{!isShow && (
				<DefaultBtn
					classMode="clear"
					className={classes.mainBtn}
					title="Open chat"
					onClickHandler={() => onToggleChat("open")}
				>
					<BsChatDotsFill />
					{notifCount > 0 && <span>new</span>}
				</DefaultBtn>
			)}
			{isShow && (
				<>
					<ModalWrapper>
						<div className={cn(classes.wrapper, fullscreenActive && classes.full)} ref={ref}>
							<div className={classes.headerChat}>
								<div className={classes.menu}>
									<div className={classes.answerTo}>
										{answerToUser.length > 0 && (
											<>
												<p>Answer to:</p>
												{answerToUser.map((userName) => (
													<button key={userName} onClick={() => onRemoveAnswer(userName)}>
														{userName}
														<AiOutlineClose />
													</button>
												))}
											</>
										)}
									</div>

									<div className={classes.btns}>
										{!fullscreenActive ? (
											<button onClick={() => setFullscreenActive(true)} title="Maximize">
												<AiOutlineFullscreen />
											</button>
										) : (
											<button onClick={() => setFullscreenActive(false)} title="Restore Down">
												<AiOutlineFullscreenExit />
											</button>
										)}
										<button onClick={() => onToggleChat("close")} title="Close chat">
											<AiOutlineClose />
										</button>
									</div>
								</div>
								{user && (
									<Write
										answerToUser={answerToUser}
										setAnswerToUser={setAnswerToUser}
										setIsLoading={setIsLoading}
										isLoading={isLoading}
										setLastVisibleDoc={setLastVisibleMessage}
									/>
								)}
							</div>

							{!isLoading && messages ? (
								<ul className={classes.chatList}>
									{messages.map((mess) => (
										<Message
											message={mess}
											key={mess.messageId + mess.id}
											setAnswerToUser={setAnswerToUser}
										/>
									))}
								</ul>
							) : (
								<Loading className={classes.loading} />
							)}
							<div className={classes.footerBtns}>
								{isLastDataMess && (
									<DefaultBtn
										classMode="clear"
										className={classes.Morebtn}
										title="Load more"
										onClickHandler={onLoadMore}
									>
										<TfiMoreAlt className={classes.svg} />
									</DefaultBtn>
								)}
								{messages.length > 10 && (
									<DefaultBtn
										classMode="clear"
										className={classes.Hidebtn}
										title="Hide all more"
										onClickHandler={() => setLastVisibleMessage(null)}
									>
										<TfiMoreAlt className={classes.svg} />
									</DefaultBtn>
								)}
							</div>
						</div>
					</ModalWrapper>
				</>
			)}
		</>
	);
};

export default Chat;
