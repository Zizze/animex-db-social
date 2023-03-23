import { FC, useState, useEffect } from "react";
import classes from "./MainInfoItem.module.scss";
import Layout from "@Components/layout/Layout";
import LeftInfo from "./leftInfo/LeftInfo";
import RightInfo from "./rightInfo/RightInfo";
import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuthContext } from "@/context/useAuthContext";
import { db } from "@Project/firebase";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { IAnimeFirebase } from "@/types/types";
import Comments from "./comments/Comments";

interface IProps {
	anime: IDataAnime;
	isError?: boolean;
	isLoading?: boolean;
}

const animeUserCategories = ["Completed", "Watching", "Postponed", "Dropped"];

const MainInfoAnime: FC<IProps> = ({ anime, isError, isLoading }) => {
	const [activeCategory, setActiveCategory] = useState("");
	const { user } = useAuthContext();
	const [commentsIsVisible, setCommentsIsVisible] = useState(false);

	const onClickHandler = async (category: string) => {
		if (!user) return;
		setActiveCategory(category);

		const userDb = doc(db, `users/${user.uid}/anime`, `${anime.mal_id}`);
		await setDoc(userDb, {
			mal_id: anime.mal_id,
			title: anime.title,
			score: anime.score,
			episodes: anime.episodes,
			images: anime.images,
			animeState: category.toLowerCase(),
			personalRate: null,
		});
	};

	const onClickClearHandler = async () => {
		if (!user) return;
		await deleteDoc(doc(db, `users/${user.uid}/anime`, `${anime.mal_id}`));
		setActiveCategory("");
	};

	useEffect(() => {
		const getDefaultState = async () => {
			if (!user) return;
			const userDb = doc(db, `users/${user.uid}/anime`, `${anime.mal_id}`);
			const getUserData = await getDoc(userDb);

			if (getUserData.exists()) {
				const userAnimeData = getUserData.data() as IAnimeFirebase;
				setActiveCategory(userAnimeData.animeState);
			} else {
				console.log("MainInfo: NO DATA");
				setActiveCategory("");
			}
		};
		getDefaultState();
	}, [user]);

	return (
		<Layout>
			<div className={classes.container}>
				<ul className={classes.category}>
					<span className={classes.addTo}>ADD TO:</span>
					{animeUserCategories.map((category) => (
						<li key={category}>
							<CategoryBtn
								isActive={category.toLowerCase() === activeCategory.toLowerCase() && true}
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
					<LeftInfo
						anime={anime}
						setActiveCategory={setActiveCategory}
						activeCategory={activeCategory}
					/>
					<RightInfo anime={anime} />
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
		</Layout>
	);
};

export default MainInfoAnime;
