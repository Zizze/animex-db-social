import React, { FC, RefObject } from "react";
import classes from "./Items.module.scss";
import Item from "./item/Item";
import { IDataAnime } from "@Store/animeJikan/IAnime.interface";
import { IAnimeFirebase } from "@/types/types";

interface Iprops {
	allAnimeJikan?: IDataAnime[];
	animeFirebase?: IAnimeFirebase[];
}

const Items: FC<Iprops> = ({ allAnimeJikan, animeFirebase }) => {
	return (
		<div className={classes.wrapper}>
			<ul className={classes.all}>
				{allAnimeJikan &&
					allAnimeJikan?.map((anime) => {
						return <Item anime={anime} key={anime.mal_id} />;
					})}

				{animeFirebase &&
					animeFirebase?.map((anime) => {
						return <Item personalRate={anime.personalRate} anime={anime} key={anime.mal_id} />;
					})}
			</ul>
		</div>
	);
};

export default Items;
