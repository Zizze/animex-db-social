import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import React, { FC, SyntheticEvent, useState } from "react";
import classes from "./Item.module.scss";
import Link from "next/link";
import { IAnimeFirebase } from "@/types/types";
import { useRouter } from "next/router";
import SelectRating from "@Components/UI/selectRating/SelectRating";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";

interface IProps {
	anime: IDataAnime | IAnimeFirebase;
	personalRate?: number | undefined;
}

const Item: FC<IProps> = ({ anime, personalRate }) => {
	const [ratingValue, setRatingValue] = useState<null | number>(personalRate || null);

	const { user } = useAuthContext();
	const { asPath } = useRouter();
	const { title: name, images, mal_id: id, episodes, score } = anime;
	const nameLenght = name.length > 30 ? name.slice(0, 30) + "..." : name;

	const onChangeRating = async (event: SyntheticEvent<Element, Event>, value: number | null) => {
		const userAnimeRef = doc(db, `users/${user?.uid}/anime/${anime.mal_id}`);
		await updateDoc(userAnimeRef, {
			personalRate: value,
		});
		setRatingValue(value);
	};

	return (
		<li className={classes.anime}>
			{asPath.includes("my-list") && (
				<SelectRating
					value={ratingValue}
					classNames={classes.rating}
					onChangeRating={onChangeRating}
				/>
			)}
			<Link href={`/anime/${id}`} className={classes.link}>
				<div className={classes.backImg}>
					<img src={images.jpg.image_url} />
					<div></div>
				</div>
				<div className={classes.mainBlock}>
					<img src={images.jpg.image_url} alt={name} />
					<div className={classes.flex}>
						<h4 className={classes.name} title={name}>
							{nameLenght}
						</h4>
						{episodes > 0 && <p className={classes.episodes}>{episodes} Episodes</p>}
						<p className={classes.score}>{score}</p>
					</div>
				</div>
			</Link>
		</li>
	);
};

export default Item;
