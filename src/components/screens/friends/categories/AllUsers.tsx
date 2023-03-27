import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { FC } from "react";
import classes from "./AllUsers.module.scss";
import { useAuthContext } from "@/context/useAuthContext";

import { IUserFirebase } from "@/types/types";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";

const AllUsers: FC = () => {
	const { user } = useAuthContext();

	const {
		data: users,
		isLastDocs,
		isLoading,
		loadMoreData,
		onReload,
	} = useCollectionRealtime<IUserFirebase>("users", {
		where: [["id", "!=", user?.uid]],
		limit: 10,
	});

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={classes.wrapper}>
					{!users ? (
						<h6>Error.</h6>
					) : (
						<ul className={classes.users}>
							{users.length > 0 ? (
								users.map((user) => {
									return <User currUser={user} key={user.id} />;
								})
							) : (
								<h5 className={classes.emptyFriend}>Friends list is empty.</h5>
							)}
						</ul>
					)}

					<div className={classes.btns}>
						{!isLastDocs && (
							<DefaultBtn onClickHandler={loadMoreData} classMode="clear">
								More
							</DefaultBtn>
						)}
						{users && users.length > 10 && (
							<DefaultBtn onClickHandler={onReload} classMode="clear">
								Hide
							</DefaultBtn>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default AllUsers;
