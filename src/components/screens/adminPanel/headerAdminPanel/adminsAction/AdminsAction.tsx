import { IAdminActionFirebase } from "@/types/types";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Action from "./action/Action";
import classes from "./AdminsAction.module.scss";
import {
	collection,
	DocumentData,
	limit,
	onSnapshot,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";

interface IProps {
	isVisibleActions: boolean;
	setIsVisibleActions: Dispatch<SetStateAction<boolean>>;
}

const AdminsAction: FC<IProps> = ({ isVisibleActions, setIsVisibleActions }) => {
	const { user } = useAuthContext();
	const [actions, setActions] = useState<IAdminActionFirebase[]>([]);

	const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData>>();
	const [isLastActions, setIsLastActions] = useState<boolean>();
	const [updater, setUpdater] = useState(false);

	useEffect(() => {
		const actionsQuery = query(
			collection(db, "adminsAction"),
			orderBy("timestamp", "desc"),
			limit(10)
		);
		const unsubscribeActions = onSnapshot(actionsQuery, (actionsSnapshot) => {
			const adminsActionData: IAdminActionFirebase[] = [];
			actionsSnapshot.forEach((doc) => {
				adminsActionData.push(doc.data() as IAdminActionFirebase);
			});
			setActions(adminsActionData);
			setLastVisibleDoc(actionsSnapshot.docs[actionsSnapshot.docs.length - 1]);
			setIsLastActions(adminsActionData.length < 10);
		});

		return () => unsubscribeActions();
	}, [user, updater]);

	const onLoadMore = () => {
		const actionsQuery = query(
			collection(db, "adminsAction"),
			orderBy("timestamp", "desc"),
			startAfter(lastVisibleDoc),
			limit(10)
		);
		const unsubscribeActions = onSnapshot(actionsQuery, (actionsSnapshot) => {
			const adminsActionData: IAdminActionFirebase[] = [];
			actionsSnapshot.forEach((doc) => {
				adminsActionData.push(doc.data() as IAdminActionFirebase);
			});
			setActions((prev) => [...prev, ...adminsActionData]);
			setLastVisibleDoc(actionsSnapshot.docs[actionsSnapshot.docs.length - 1]);
			setIsLastActions(adminsActionData.length < 10);
		});

		return () => unsubscribeActions();
	};

	return (
		<>
			{isVisibleActions && (
				<ModalWrapper onClickHandler={() => setIsVisibleActions(false)}>
					<div className={classes.wrapper}>
						<h6>Admins action</h6>
						<ul>
							{actions.map((action) => (
								<Action action={action} key={action.adminId + action.timestamp.toDate()} />
							))}
						</ul>
						<div className={classes.btns}>
							{!isLastActions && (
								<DefaultBtn classMode="clear" onClickHandler={onLoadMore}>
									More
								</DefaultBtn>
							)}
							{actions.length > 10 && (
								<DefaultBtn classMode="clear" onClickHandler={() => setUpdater((prev) => !prev)}>
									Hide
								</DefaultBtn>
							)}
						</div>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default AdminsAction;
