import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import React, { FC, useState } from "react";
import classes from "./Item.module.scss";
import Link from "next/link";
import { IAnimeFirebase } from "@/types/types";
import { useRouter } from "next/router";
import Image, { StaticImageData } from "next/image";
import Loading from "@Components/UI/loading/Loading";
import defaultImage from "@Public/testava.jpg";

interface IProps {
	anime: IDataAnime | IAnimeFirebase;
	personalRate?: number | undefined;
}

const Item: FC<IProps> = ({ anime, personalRate }) => {
	const { asPath } = useRouter();
	const { title: name, images, mal_id: id, episodes, score } = anime;

	const [isLoading, setIsLoading] = useState(true);
	const [image, setImage] = useState<string | StaticImageData>(images.jpg.large_image_url);
	const [smallImage, setSmallImage] = useState<string | StaticImageData>(images.jpg.image_url);

	return (
		<li className={classes.anime}>
			{personalRate && asPath.includes("my-list") && (
				<p className={classes.rating}>
					your rating is <span>{`${personalRate * 2}/10`}</span>
				</p>
			)}
			<Link href={`/anime/${id}`} className={classes.link}>
				<div className={classes.backImg}>
					<Image src={smallImage} alt="Anime background" width={250} height={250} priority={true} />
					<div></div>
				</div>
				<div className={classes.mainBlock}>
					<div className={classes.image}>
						<Image
							src={image}
							alt={`${name} image`}
							width={500}
							height={250}
							priority={true}
							onLoadingComplete={() => setIsLoading(false)}
							onError={() => {
								setImage(defaultImage);
								setSmallImage(defaultImage);
								setIsLoading(false);
							}}
						/>
						{isLoading && <Loading className={classes.loadImage} />}
					</div>

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
