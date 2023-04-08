import { FC, useEffect } from "react";
import Items from "../home/items/Items";
import { useAuthContext } from "@/context/useAuthContext";
import { IAnimeFirebase } from "@/types/types";
import { useRouter } from "next/router";
import classes from "./UserList.module.scss";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Statistics from "./statistics/Statistics";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { popMessage } from "@/utils/popMessage/popMessage";
import { userNavData } from "@Components/layout/sidebar/navigation/navList.data";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";

const PAGE_LIMIT = 15;

const UserList: FC = () => {
	const router = useRouter();
	const listName = router.query.status;
	const { popError, ctxMessage } = popMessage();
	const { user } = useAuthContext();
	const dispatch = useAppDispatch();

	const {
		data: userAnimeData,
		onReload,
		loadMoreData,
		isLoading,
		isLastDocs,
		error,
	} = useCollectionRealtime<IAnimeFirebase>(
		`users/${user?.uid}/anime`,
		{
			where: [["animeState", "==", listName || "*"]],
			orderBy: ["personalRate", "desc"],
			limit: PAGE_LIMIT,
		},
		!user?.uid
	);

	useEffect(() => {
		userNavData.forEach((userItem) => {
			if (listName === userItem.name.toLowerCase()) {
				dispatch(changeHomeMode(userItem.name));
			}
		});
	}, []);

	useEffect(() => {
		if (error) popError("List loading error.");
	}, [error]);

	return (
		<>
			{ctxMessage}
			{isLoading && <Loading />}
			{!isLoading && <Statistics />}
			<div className={classes.container}>
				{userAnimeData && <Items animeFirebase={userAnimeData} />}
				{!isLoading && !userAnimeData?.length && !error && (
					<p className={classes.emptyList}>Nothing's been added yet.</p>
				)}

				<div className={classes.btns}>
					{!isLastDocs && (
						<DefaultBtn classMode="main" onClickHandler={loadMoreData}>
							More
						</DefaultBtn>
					)}
					{userAnimeData && userAnimeData.length > PAGE_LIMIT && (
						<DefaultBtn onClickHandler={onReload}>Hide all</DefaultBtn>
					)}
				</div>
			</div>
		</>
	);
};

export default UserList;
