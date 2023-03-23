import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import Image from "next/image";
import { Dispatch, FC, SetStateAction, SyntheticEvent, useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import classes from "./LeftInfo.module.scss";
import { useRouter } from "next/router";
import { useGetRandomAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import SelectRating from "@Components/UI/selectRating/SelectRating";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";

interface IProps {
	anime: IDataAnime;
	setActiveCategory: Dispatch<SetStateAction<string>>;
	activeCategory: string;
}

const LeftInfo: FC<IProps> = ({ anime, setActiveCategory, activeCategory }) => {
	const [ratingValue, setRatingValue] = useState<number | null>(null);
	const { user } = useAuthContext();

	const router = useRouter();
	const { refetch } = useGetRandomAnimeJikanQuery();

	const {
		mal_id: id,
		synopsis: description,
		rating: ageRating,
		scored_by: scoreBy,
		title: name,
		title_japanese: nameJP,
	} = anime;

	const onClickHandler = () => {
		refetch();
		setActiveCategory("");
	};

	console.log(activeCategory);

	const onChangeRating = async (event: SyntheticEvent<Element, Event>, value: number | null) => {
		const userAnimeRef = doc(db, `users/${user?.uid}/anime/${id}`);
		await updateDoc(userAnimeRef, {
			personalRate: value,
		});
		setRatingValue(value);
	};

	useEffect(() => {
		const getRating = async () => {
			const userAnimeRef = doc(db, `users/${user?.uid}/anime/${id}`);
			const getData = await getDoc(userAnimeRef);
			if (getData.exists()) {
				const getRating = getData.data().personalRate || null;
				setRatingValue(getRating);
			}
		};
		getRating();
	}, []);

	useEffect(() => {
		const swapCategory = async () => {
			if (activeCategory.length > 0 && ratingValue) {
				const userAnimeRef = doc(db, `users/${user?.uid}/anime/${id}`);
				await updateDoc(userAnimeRef, {
					personalRate: ratingValue,
				});
			}
			if (activeCategory.length < 1) {
				setRatingValue(null);
			}
		};
		swapCategory();
	}, [activeCategory]);

	return (
		<div className={classes.left}>
			<h3 className={classes.name}>{name}</h3>
			<h3 className={classes.nameJP}>{nameJP}</h3>
			<p className={classes.age}>{`[${anime.rating}]`}</p>
			{activeCategory.length > 0 && (
				<SelectRating
					classNames={classes.rating}
					fontSize={"2.5rem"}
					onChangeRating={onChangeRating}
					value={ratingValue}
				/>
			)}
			<div className={classes.poster}>
				<Image
					priority={true}
					src={anime.images.jpg.large_image_url}
					width={300}
					height={400}
					alt={`${name} poster`}
				/>
			</div>
			<div className={classes.btnContol}>
				{router.asPath === "/random-anime" && (
					<button onClick={() => onClickHandler()}>
						<span>NEXT</span>
						<AiOutlineArrowRight />
					</button>
				)}
			</div>
			<p className={classes.genres}>
				<span>Genres:</span> {anime.genres.map((g) => g.name).join(", ")}
			</p>
			<p className={classes.themes}>
				<span>Themes:</span> {anime.themes.map((g) => g.name).join(", ")}
			</p>
			<p className={classes.status}>
				<span>Status:</span> {anime.status}
			</p>
			<p className={classes.episodes}>
				<span>Episodes:</span> {anime.episodes}
			</p>
			<p className={classes.duration}>
				<span>Duration:</span> {anime.duration}
			</p>
			{anime.year && anime.season && (
				<p className={classes.year}>
					<span>Year - season:</span> {anime.year} | {anime.season}
				</p>
			)}
		</div>
	);
};

export default LeftInfo;
