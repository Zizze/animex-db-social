import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import React, { FC } from "react";
import classes from "./Item.module.scss";
import Link from "next/link";
import { IAnimeFirebase } from "@/types/types";
import { useRouter } from "next/router";

interface IProps {
	anime: IDataAnime | IAnimeFirebase;
	personalRate?: number | undefined;
}

const Item: FC<IProps> = ({ anime, personalRate }) => {
	const { asPath } = useRouter();
	const { title: name, images, mal_id: id, episodes, score } = anime;

	return (
		<li className={classes.anime}>
			{personalRate && asPath.includes("my-list") && (
				<p className={classes.rating}>
					your rating is <span>{`${personalRate * 2}/10`}</span>
				</p>
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
							{name}
						</h4>
						{+episodes > 0 && <p className={classes.episodes}>{episodes} Episodes</p>}
						<p className={classes.score}>{score}</p>
					</div>
				</div>
			</Link>
		</li>
	);
};

export default Item;
