import { useGetGenresAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { FC } from "react";
import classes from "./Themes.module.scss";
import Checkbox from "@Components/UI/checkbox/Checkbox";
import { popMessage } from "@/utils/popMessage/popMessage";
import Loading from "@Components/UI/loading/Loading";

interface IProps {
	selectedCheckbox: (id: string) => void;
}

const Themes: FC<IProps> = ({ selectedCheckbox }) => {
	const { popError, ctxMessage } = popMessage();
	const { data, isLoading, isError } = useGetGenresAnimeJikanQuery("themes");

	if (isError) popError("Error loading list of topics.");
	return (
		<>
			{ctxMessage}
			{isLoading && <Loading />}
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
		</>
	);
};

export default Themes;
