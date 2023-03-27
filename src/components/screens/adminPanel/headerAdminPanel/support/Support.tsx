import { useAuthContext } from "@/context/useAuthContext";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { ISupportFirebase } from "@/types/types";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { db } from "@Project/firebase";
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
	where,
} from "firebase/firestore";
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Message from "./message/Message";
import classes from "./Support.module.scss";

interface IProps {
	setIsVisibleSupport: Dispatch<SetStateAction<boolean>>;
}
const categories = ["open", "closed"];

const Support: FC<IProps> = ({ setIsVisibleSupport }) => {
	const [selectedCategory, setSelectedCategory] = useState(categories[0]);

	// const [messages, setMessages] = useState<ISupportFirebase[]>([]);
	// const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData>>();
	// const [isLastDocs, setIsLastDoc] = useState(true);
	// const [reload, setReload] = useState(true);

	const {
		data: messages,
		onReload,
		isLastDocs,
		isLoading,
		loadMoreData,
	} = useCollectionRealtime<ISupportFirebase>("support", {
		where: [["closed", "==", selectedCategory !== "open"]],
		orderBy: ["timestamp", "desc"],
		limit: 10,
	});

	// useEffect(() => {
	// 	const messageStatus = selectedCategory !== "open";

	// 	const suppMessQuery = query(
	// 		collection(db, "support"),
	// 		where("closed", "==", messageStatus),
	// 		orderBy("timestamp", "desc"),
	// 		limit(10)
	// 	);
	// 	const unsubscribe = onSnapshot(suppMessQuery, (querySnapshot) => {
	// 		setLastVisibleDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
	// 		setIsLastDoc(querySnapshot.size < 10);

	// 		const suppMess: ISupportFirebase[] = [];
	// 		querySnapshot.forEach((doc) => {
	// 			suppMess.push({ ...(doc.data() as ISupportFirebase), docId: doc.id });
	// 		});
	// 		setMessages(suppMess);
	// 	});
	// 	return () => unsubscribe();
	// }, [selectedCategory, reload]);

	// const onLoadMore = async () => {
	// 	const messageStatus = selectedCategory !== "open";

	// 	const suppMessQuery = query(
	// 		collection(db, "support"),
	// 		where("closed", "==", messageStatus),
	// 		orderBy("timestamp", "desc"),
	// 		startAfter(lastVisibleDoc),
	// 		limit(10)
	// 	);

	// 	const getSuppMessDocs = await getDocs(suppMessQuery);
	// 	const suppMess = getSuppMessDocs.docs.map((doc) => {
	// 		return { ...(doc.data() as ISupportFirebase), docId: doc.id };
	// 	});

	// 	setMessages((prev) => [...prev, ...suppMess]);
	// 	setLastVisibleDoc(getSuppMessDocs.docs[getSuppMessDocs.docs.length - 1]);
	// 	setIsLastDoc(getSuppMessDocs.size < 10);
	// };
	if (!messages) return <></>;
	return (
		<ModalWrapper onClickHandler={() => setIsVisibleSupport(false)}>
			<div className={classes.wrapper}>
				<h6>Users in need of help</h6>

				<ul className={classes.categories}>
					{categories.map((category) => (
						<li key={category}>
							<CategoryBtn
								isActive={selectedCategory === category}
								onClickHandler={() => setSelectedCategory(category)}
							>
								{category}
							</CategoryBtn>
						</li>
					))}
				</ul>
				{messages.length === 0 && <p className={classes.empty}>List is empty.</p>}
				<ul className={classes.messages}>
					{messages.map((message) => (
						<Message message={message} key={message.docId} />
					))}
				</ul>
				<div className={classes.btns}>
					{!isLastDocs && (
						<DefaultBtn classMode="clear" onClickHandler={loadMoreData}>
							More
						</DefaultBtn>
					)}
					{messages.length > 10 && (
						<DefaultBtn classMode="clear" onClickHandler={onReload}>
							Hide
						</DefaultBtn>
					)}
				</div>
			</div>
		</ModalWrapper>
	);
};

export default Support;
