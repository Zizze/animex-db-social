import { FC } from "react";
import classes from "./FriendsCategory.module.scss";
import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useCollectionRealtimeWithUsersData } from "@/hooks/firebase/useCollectionRealtimeWithUsersData";

const FriendsCategory: FC<{ nameCategory: string }> = ({ nameCategory }) => {
	const { user } = useAuthContext();

	const {
		data: friends,
		onReload,
		isLoading,
		isLastDocs,
		loadMoreData,
	} = useCollectionRealtimeWithUsersData<IUserFirebase>(`users/${user?.uid}/friends`, {
		where: [["friend", "==", true]],
		limit: 10,
	});

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<>
					{!friends ? (
						<h6>Error.</h6>
					) : (
						<div className={classes.wrapper}>
							<ul className={classes.users}>
								{friends.length > 0 ? (
									friends.map((user) => {
										return <User currUser={user} key={user.id} nameCategory={nameCategory} />;
									})
								) : (
									<h5 className={classes.emptyFriend}>Friends list is empty.</h5>
								)}
							</ul>

							<div className={classes.btns}>
								{!isLastDocs && (
									<DefaultBtn onClickHandler={loadMoreData} classMode="clear">
										More
									</DefaultBtn>
								)}
								{friends.length > 10 && (
									<DefaultBtn onClickHandler={onReload} classMode="clear">
										More
									</DefaultBtn>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default FriendsCategory;
