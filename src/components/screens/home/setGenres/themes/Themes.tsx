import { useGetGenresAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { Dispatch, FC, SetStateAction } from "react";
import classes from "./Themes.module.scss";
import Checkbox from "@Components/UI/checkbox/Checkbox";

interface IProps {
	selectedCheckbox: (id: string) => void;
}

const Themes: FC<IProps> = ({ selectedCheckbox }) => {
	const { data, isLoading, isError } = useGetGenresAnimeJikanQuery("themes");

	return (
		<div className={classes.wrapper}>
			<h3 className={classes.title}>Themes</h3>
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

export default Themes;
