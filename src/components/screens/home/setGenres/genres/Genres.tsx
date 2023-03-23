import { useGetGenresAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { FC } from "react";
import classes from "./Genres.module.scss";
import Checkbox from "@Components/UI/checkbox/Checkbox";

interface IProps {
	selectedCheckbox: (id: string) => void;
}

const Genres: FC<IProps> = ({ selectedCheckbox }) => {
	const { data, isLoading, isError } = useGetGenresAnimeJikanQuery("genres");

	return (
		<div className={classes.wrapper}>
			<h3 className={classes.title}>Genres</h3>
			<ul className={classes.list}>
				{data?.data.map((genre) => {
					return (
						<li className={classes.genre} key={genre.mal_id}>
							<Checkbox name={genre.name} onChangeHandler={selectedCheckbox} id={genre.mal_id} />
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Genres;
