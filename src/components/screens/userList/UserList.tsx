import { FC, useEffect } from "react";
import Layout from "@Components/layout/Layout";
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

const PAGE_LIMIT = 15;

const UserList: FC = () => {
	const router = useRouter();
	const routerPath = router.query.status;
	const { popError, ctxMessage } = popMessage();
	const { user } = useAuthContext();

	const {
		data: userAnimeData,
		onReload,
		loadMoreData,
		isLoading,
		isLastDocs,
		error,
	} = useCollectionRealtime<IAnimeFirebase>(`users/${user?.uid}/anime`, {
		where: [["animeState", "==", routerPath || "*"]],
		orderBy: ["personalRate", "desc"],
		limit: PAGE_LIMIT,
	});

	useEffect(() => {
		if (error) popError("List loading error.");
	}, [error]);

	return (
		<Layout>
			{ctxMessage}
			{isLoading && <Loading />}
			<Statistics />
			<div className={classes.container}>
				{userAnimeData && userAnimeData.length ? (
					<Items animeFirebase={userAnimeData} />
				) : (
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
		</Layout>
	);
};

export default UserList;
