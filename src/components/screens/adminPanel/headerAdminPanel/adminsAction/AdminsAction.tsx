import { IAdminActionFirebase } from "@/types/types";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { Dispatch, FC, SetStateAction } from "react";
import Action from "./action/Action";
import classes from "./AdminsAction.module.scss";

import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";

interface IProps {
	isVisibleActions: boolean;
	setIsVisibleActions: Dispatch<SetStateAction<boolean>>;
}

const AdminsAction: FC<IProps> = ({ isVisibleActions, setIsVisibleActions }) => {
	const {
		data: actions,
		loadMoreData,
		isLastDocs,
		onReload,
	} = useCollectionRealtime<IAdminActionFirebase>("adminsAction", {
		orderBy: ["timestamp", "desc"],
		limit: 10,
	});

	return (
		<>
			{isVisibleActions && actions && (
				<ModalWrapper onClickHandler={() => setIsVisibleActions(false)}>
					<div className={classes.wrapper}>
						<h6>Admins action</h6>
						<ul>
							{actions.map((action) => (
								<Action action={action} key={action.adminId + action.timestamp.toDate()} />
							))}
						</ul>
						<div className={classes.btns}>
							{!isLastDocs && (
								<DefaultBtn classMode="clear" onClickHandler={loadMoreData}>
									More
								</DefaultBtn>
							)}
							{actions.length > 10 && (
								<DefaultBtn classMode="clear" onClickHandler={onReload}>
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
