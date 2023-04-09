import { FC, memo, useMemo } from "react";
import classes from "./Categories.module.scss";
import { useAuthContext } from "@/context/useAuthContext";
import { Timestamp } from "firebase/firestore";
import { IUserFirebase } from "@/types/types";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { dataCategories } from "../usersPanel.data";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { WhereQuery } from "@/utils/firebase/buildCollectionRef";

const Categories: FC<{ categorySelected: string }> = ({ categorySelected }) => {
	const { user } = useAuthContext();

	const usersFilter = useMemo(() => {
		const usersBanned = ["blocked.endBan", ">", Timestamp.now()];
		const allUsers = ["id", "!=", user?.uid];
		const admins = ["access", ">", 0];
		const activeCategory = [];
		if (categorySelected === dataCategories[0]) activeCategory.push(allUsers);
		if (categorySelected === dataCategories[1] && user && user.uid) activeCategory.push(admins);
		if (categorySelected === dataCategories[2]) activeCategory.push(usersBanned);
		return activeCategory as WhereQuery[];
	}, [categorySelected, user]);

	const {
		data: users,
		loadMoreData,
		isLastDocs,
		onReload,
		isLoading,
	} = useCollectionRealtime<IUserFirebase>(
		"users",
		(user && {
			where: usersFilter,
			limit: 10,
		}) ||
			{}
	);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={classes.wrapper}>
					<ul className={classes.users}>
						{users && users.length > 0 ? (
							users.map((user) => {
								return <User currUser={user} key={user.id} />;
							})
						) : (
							<h5 className={classes.empty}>Banned list is empty.</h5>
						)}
					</ul>

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

export default memo(Categories);
