import { FC, useState, useEffect, useCallback } from "react";
import classes from "./MainChat.module.scss";
import Message from "./message/Message";
import { IMainChatFirebase } from "@/types/types";

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
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { useCollectionSize } from "@/hooks/firebase/useCollectionSize";
import { batchWrite } from "@/services/firebase/writeBatch";
import { popMessage } from "@/utils/popMessage/popMessage";

const CHAT_LIMIT = 10;

const MainChat: FC = () => {
	const { user } = useAuthContext();
	const { popError, popSuccess, ctxMessage } = popMessage();
	const [fullscreenActive, setFullscreenActive] = useState(false);
	const { isShow, setIsShow, ref } = useOutside(false);

	const [answerToUser, setAnswerToUser] = useState<string[]>([]);

	const {
		data: messages,
		loadMoreData,
		isLoading,
		isLastDocs,
		onReload,
		error,
	} = useCollectionRealtime<IMainChatFirebase>("chat", {
		orderBy: ["timestamp", "desc"],
		limit: CHAT_LIMIT,
	});

	const notifCount = useCollectionSize("chat", false, {
		where: [["answer", "array-contains", user?.displayName || "*"]],
		limit: 1,
	});

	const onRemoveAnswer = (userName: string) => {
		const filtered = answerToUser.filter((user) => user !== userName);
		setAnswerToUser(filtered);
	};

	const openChat = useCallback(async () => {
		setIsShow(true);
		if (!user?.displayName || !notifCount) return;

		try {
			await batchWrite("chat", {
				queryOptions: { where: [["answer", "array-contains", user.displayName]] },
				type: "update",
				filterData: {
					name: "answer",
					docKey: "answer",
					notEqual: user.displayName,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}, [user?.displayName, notifCount]);

	useEffect(() => {
		if (!error) return;
		popError("Error loading chat messages.");
	}, [error]);

	return (
		<>
			{!isShow && (
				<DefaultBtn
					classMode="clear"
					className={classes.mainBtn}
					title="Open chat"
					onClickHandler={openChat}
				>
					<BsChatDotsFill />
					{notifCount > 0 && <span>new</span>}
				</DefaultBtn>
			)}
			{isShow && (
				<>
					{ctxMessage}
					<ModalWrapper>
						<div className={cn(classes.wrapper, fullscreenActive && classes.full)} ref={ref}>
							<div className={classes.headerChat}>
								<div className={classes.menu}>
									<div className={classes.answerTo}>
										{!!answerToUser.length && (
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
										<button
											onClick={() => setFullscreenActive((prev) => !prev)}
											title={!fullscreenActive ? "Maximize" : "Restore Down"}
										>
											{!fullscreenActive ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
										</button>

										<button onClick={() => setIsShow(false)} title="Close chat">
											<AiOutlineClose />
										</button>
									</div>
								</div>
								{user && <Write answerToUser={answerToUser} setAnswerToUser={setAnswerToUser} />}
							</div>

							{isLoading && <Loading className={classes.loading} />}

							{messages && (
								<ul className={classes.chatList}>
									{messages.map((mess) => (
										<Message
											popError={popError}
											popSuccess={popSuccess}
											message={mess}
											key={mess.docId}
											setAnswerToUser={setAnswerToUser}
										/>
									))}
								</ul>
							)}

							<div className={classes.footerBtns}>
								{!isLastDocs && (
									<DefaultBtn
										classMode="clear"
										className={classes.Morebtn}
										title="Load more"
										onClickHandler={loadMoreData}
									>
										<TfiMoreAlt className={classes.svg} />
									</DefaultBtn>
								)}
								{messages && messages.length > CHAT_LIMIT && (
									<DefaultBtn
										classMode="clear"
										className={classes.Hidebtn}
										onClickHandler={onReload}
										title="Hide all more"
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

export default MainChat;
