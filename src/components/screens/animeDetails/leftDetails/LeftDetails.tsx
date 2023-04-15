import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import Image from "next/image";
import { FC, SyntheticEvent } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import classes from "./LeftDetails.module.scss";
import { useRouter } from "next/router";
import { useGetRandomAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import SelectRating from "@Components/UI/selectRating/SelectRating";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import { IAnimeFirebase } from "@/types/types";
import { popMessage } from "@/utils/popMessage/popMessage";

interface IProps {
	anime: IDataAnime;
	animeInUserDb: IAnimeFirebase | null;
}

const LeftDetails: FC<IProps> = ({ anime, animeInUserDb }) => {
	const router = useRouter();
	const { user } = useAuthContext();
	const { refetch } = useGetRandomAnimeJikanQuery();
	const { popError, popSuccess, ctxMessage } = popMessage();

	const { mal_id: id, title: name, title_japanese: nameJP } = anime;

	const onChangeRating = async (event: SyntheticEvent<Element, Event>, value: number | null) => {
		const userAnimeRef = doc(db, `users/${user?.uid}/anime/${id}`);
		try {
			await updateDoc(userAnimeRef, {
				personalRate: value,
			});
			popSuccess("Rating changed.");
		} catch {
			popError("Rating change error.");
		}
	};

	const animeDetails = [
		{ name: "Genres", value: anime.genres.map((g) => g.name).join(", ") },
		{ name: "Themes", value: anime.themes.map((g) => g.name).join(", ") },
		{ name: "Status", value: anime.status },
		{ name: "Episodes", value: anime.episodes },
		{ name: "Duration", value: anime.duration },
		{ name: "Year - season", value: anime.year && `${anime.year} | ${anime.season}` },
	];

	const onClickHandler = () => refetch();
	return (
		<>
			{ctxMessage}
			<div className={classes.left}>
				<h3 className={classes.name}>{name}</h3>
				<h3 className={classes.nameJP}>{nameJP}</h3>
				<p className={classes.age}>{`[${anime.rating}]`}</p>
				{animeInUserDb?.animeState && (
					<SelectRating
						classNames={classes.rating}
						fontSize={"2.5rem"}
						onChangeRating={onChangeRating}
						value={animeInUserDb.personalRate}
					/>
				)}
				<div className={classes.poster}>
					<Image
						priority={true}
						src={anime.images.jpg.large_image_url}
						width={500}
						height={800}
						alt={`${name} poster`}
					/>
				</div>
				<div className={classes.btnContol}>
					{router.asPath === "/random-anime" && (
						<button onClick={onClickHandler}>
							<span>NEXT</span>
							<AiOutlineArrowRight />
						</button>
					)}
				</div>
				<ul className={classes.details}>
					{animeDetails.map(({ name, value }) => {
						if (!value) return;
						return (
							<li key={name}>
								<span>{name}:</span> {value}
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export default LeftDetails;
