import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import classes from "./Requests.module.scss";

import { Dispatch, FC, SetStateAction } from "react";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import CloseModal from "@Components/UI/btn/CloseModal";
import { useCollectionRealtimeWithUsersData } from "@/hooks/firebase/useCollectionRealtimeWithUsersData";

interface IProps {
	setIsShow: Dispatch<SetStateAction<boolean>>;
	isShow: boolean;
}

const Requests: FC<IProps> = ({ setIsShow, isShow }) => {
	const { user } = useAuthContext();

	const onCloseModal = () => {
		setIsShow(false);
	};

	const {
		data: sentList,
		onReload,
		isLoading,
		isLastDocs,
		loadMoreData,
	} = useCollectionRealtimeWithUsersData<IUserFirebase>(`users/${user?.uid}/friends`, {
		where: [["confirmator", "==", true]],
		limit: 10,
	});

	return (
		<>
			{isShow && (
				<ModalWrapper onClickHandler={onCloseModal}>
					{isLoading ? (
						<Loading />
					) : (
						<>
							{sentList ? (
								<div className={classes.wrapper}>
									<h4 className={classes.req}>Requests</h4>
									<CloseModal className={classes.closeBtn} onClickHandler={onCloseModal} />
									<ul className={classes.users}>
										{sentList.map((user) => {
											return <User currUser={user} requestsPage={true} key={user.id} />;
										})}
									</ul>
									<div className={classes.btns}>
										{!isLastDocs && (
											<DefaultBtn onClickHandler={loadMoreData} classMode="clear">
												More
											</DefaultBtn>
										)}
										{sentList.length > 10 && (
											<DefaultBtn onClickHandler={onReload} classMode="clear">
												Hide
											</DefaultBtn>
										)}
									</div>
								</div>
							) : (
								<h4>Error.</h4>
							)}
						</>
					)}
				</ModalWrapper>
			)}
		</>
	);
};

export default Requests;
