import { useAuthContext } from "@/context/useAuthContext";
import { getAnimeStatistics, IGetAnimeStatistics } from "@/services/firebase/getAnimeStatistics";
import { useEffect, useState } from "react";
import classes from "./Statisticas.module.scss";

const Statistics = () => {
	const { user } = useAuthContext();
	const [animeCounters, setAnimeCounters] = useState<IGetAnimeStatistics | null>(null);

	useEffect(() => {
		if (!user) return;

		const fetchAnimeStatistics = async () => {
			const countsAnime = await getAnimeStatistics(user.uid);
			setAnimeCounters(countsAnime);
		};

		fetchAnimeStatistics();
	}, [user]);

	return (
		<>
			{animeCounters && animeCounters.total > 0 && (
				<ul className={classes.counts}>
					{Object.entries(animeCounters).map(
						([key, value]) =>
							key !== "total" && (
								<li
									key={key}
									title={key}
									className={classes[key]}
									style={{ width: `${(value / animeCounters.total) * 100}%` }}
								>
									{value}
								</li>
							)
					)}
				</ul>
			)}
		</>
	);
};

export default Statistics;
