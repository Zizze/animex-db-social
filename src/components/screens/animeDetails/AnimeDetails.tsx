import { FC, useState, useEffect } from "react";
import classes from "./AnimeDetails.module.scss";
import Layout from "@Components/layout/Layout";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "@/context/useAuthContext";
import { db } from "@Project/firebase";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { IAnimeFirebase } from "@/types/types";
import Comments from "./comments/Comments";
import LeftDetails from "./leftDetails/LeftDetails";
import RightDetails from "./rightDetails/RightDetails";
import { useGetByIdAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { useRouter } from "next/router";
import Loading from "@Components/UI/loading/Loading";
import { popMessage } from "@/utils/popMessage/popMessage";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";

const animeUserCategories = ["Completed", "Watching", "Postponed", "Dropped"];

const AnimeDetails: FC<{ animeId: number }> = ({ animeId }) => {
	const router = useRouter();
	const { user } = useAuthContext();
	const { popError, popSuccess, ctxMessage } = popMessage();
	const [commentsIsVisible, setCommentsIsVisible] = useState(false);

	const animeinUserDbPath = `users/${user?.uid}/anime/${animeId}`;

	const {
		data: animeFetch,
		isError: animeFetchErr,
		isLoading: animeFetchLoading,
	} = useGetByIdAnimeJikanQuery(animeId);
	const anime = animeFetch?.data;

	const {
		data: animeInUserDb,
		loading: animeInUserDbLoading,
		error: animeInUserDbErr,
	} = useRealtimeDoc<IAnimeFirebase>(animeinUserDbPath, !user);

	const onClickHandler = async (category: string) => {
		if (!user || !anime) return;
		try {
			if (animeInUserDb) {
				await updateDoc(doc(db, animeinUserDbPath), { animeState: category.toLowerCase() });
			} else {
				await setDoc(doc(db, animeinUserDbPath), {
					mal_id: anime.mal_id,
					title: anime.title,
					score: anime.score,
					episodes: anime.episodes,
					images: anime.images,
					animeState: category.toLowerCase(),
					personalRate: null,
				});
			}
		} catch {
			popError("Error change category.");
		}
	};

	const onClickClearHandler = async () => {
		if (!user || !anime) return;
		try {
			await deleteDoc(doc(db, animeinUserDbPath));
			popSuccess("Anime deleted.");
		} catch {
			popError("Error deleting.");
		}
	};

	useEffect(() => {
		if (animeFetchErr || animeInUserDbErr) router.push("/404");
	}, [animeFetchErr, animeInUserDbErr]);

	if (animeFetchLoading || animeInUserDbLoading) return <Loading />;
	return (
		<>
			{ctxMessage}
			{anime && (
				<div className={classes.container}>
					<ul className={classes.category}>
						<span className={classes.addTo}>ADD TO:</span>
						{animeUserCategories.map((category) => (
							<li key={category}>
								<CategoryBtn
									isActive={
										category.toLowerCase() === animeInUserDb?.animeState.toLowerCase() && true
									}
									onClickHandler={() => onClickHandler(category)}
								>
									{category}
								</CategoryBtn>
							</li>
						))}
						<DefaultBtn classMode="clear" onClickHandler={onClickClearHandler}>
							Clear
						</DefaultBtn>
					</ul>

					<div className={classes.mainInfo}>
						<LeftDetails anime={anime} animeInUserDb={animeInUserDb} />
						<RightDetails anime={anime} />
					</div>

					<DefaultBtn
						classMode="clear"
						className={classes.commentsBtn}
						onClickHandler={() => setCommentsIsVisible((prev) => !prev)}
					>
						{commentsIsVisible ? "Hide comments" : "Show comments"}
					</DefaultBtn>
					{commentsIsVisible && <Comments animeId={anime.mal_id} />}
				</div>
			)}
		</>
	);
};

export default AnimeDetails;
