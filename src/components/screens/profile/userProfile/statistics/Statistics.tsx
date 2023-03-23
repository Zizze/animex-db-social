import { getAnimeStatistics, IGetAnimeStatistics } from "@/services/firebase/getAnimeStatistics";
import React, { FC, useEffect, useState } from "react";
import classes from "./Statistics.module.scss";

const Statistics: FC<{ userId: string }> = ({ userId }) => {
	const [animeCounters, setAnimeCounters] = useState<IGetAnimeStatistics | null>(null);

	useEffect(() => {
		if (!userId) return;

		const fetchAnimeStatistics = async () => {
			const countsAnime = await getAnimeStatistics(userId);
			setAnimeCounters(countsAnime);
		};

		fetchAnimeStatistics();
	}, [userId]);

	return (
		<div className={classes.statistics}>
			<ul className={classes.list}>
				{animeCounters &&
					Object.entries(animeCounters).map(
						([key, value]) =>
							key !== "total" && (
								<li key={key}>
									{key[0].toUpperCase() + key.slice(1)}: <span>{value}</span>
								</li>
							)
					)}
			</ul>
		</div>
	);
};

export default Statistics;
