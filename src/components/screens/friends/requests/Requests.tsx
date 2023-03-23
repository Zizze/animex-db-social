import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import classes from "./Requests.module.scss";
import { db } from "@Project/firebase";
import {
	collection,
	doc,
	DocumentData,
	getDocs,
	limit,
	onSnapshot,
	query,
	QueryDocumentSnapshot,
	startAfter,
	where,
} from "firebase/firestore";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import CloseModal from "@Components/UI/btn/CloseModal";

interface IProps {
	setIsShow: Dispatch<SetStateAction<boolean>>;
	isShow: boolean;
}

const Requests: FC<IProps> = ({ setIsShow, isShow }) => {
	const [isLoading, setIsLoading] = useState<boolean>();
	const { user } = useAuthContext();
	const [sentList, setSentList] = useState<IUserFirebase[]>([]);
	const [lastVisibleUser, setLastVisibleUser] = useState<QueryDocumentSnapshot<DocumentData>>();
	const [isLastDataUser, setIslastDataUser] = useState<boolean>();

	const onCloseModal = () => {
		setIsShow(false);
	};

	useEffect(() => {
		setIsLoading(true);
		if (user) {
			const q = query(
				collection(db, `users/${user.uid}/friends`),
				where("confirmator", "==", true),
				limit(10)
			);

			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const lastVisibleUser = querySnapshot.docs[querySnapshot.docs.length - 1];

				const allReqList: IUserFirebase[] = [];
				querySnapshot.forEach((docс) => {
					const unsub = onSnapshot(doc(db, `users`, `${docс.id}`), (doc) => {
						allReqList.push(doc.data() as IUserFirebase);
						setSentList(allReqList);
					});
				});
				setLastVisibleUser(lastVisibleUser);
				setIslastDataUser(allReqList.length > 9);
				setIsLoading(false);
			});
		}
	}, [user]);

	const onClickMore = async () => {
		if (user) {
			const moreData = query(
				collection(db, `users/${user.uid}/friends`),
				where("confirmator", "==", true),
				startAfter(lastVisibleUser),
				limit(10)
			);
			const querySnapshot = await getDocs(moreData);
			const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

			const dataUsers = querySnapshot.docs.map((doc) => {
				return { ...(doc.data() as IUserFirebase) };
			});

			setSentList((prev) => [...prev, ...dataUsers]);
			setIslastDataUser(dataUsers.length > 9);
			setLastVisibleUser(lastVisible);
		}
	};

	return (
		<>
			{isShow && (
				<ModalWrapper onClickHandler={onCloseModal}>
					{isLoading ? (
						<Loading />
					) : (
						<div className={classes.wrapper}>
							<h4 className={classes.req}>Requests</h4>
							<CloseModal className={classes.closeBtn} onClickHandler={onCloseModal} />
							<ul className={classes.users}>
								{sentList.map((user) => {
									return <User currUser={user} requestsPage={true} key={user.id} />;
								})}
							</ul>
							<div className={classes.btns}>
								{isLastDataUser && (
									<DefaultBtn onClickHandler={onClickMore} classMode="clear">
										More
									</DefaultBtn>
								)}
							</div>
						</div>
					)}
				</ModalWrapper>
			)}
		</>
	);
};

export default Requests;
