import { db } from "@Project/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

export interface IGetAnimeStatistics {
	completed: number;
	watching: number;
	postponed: number;
	dropped: number;
	total: number;
	[key: string]: number;
}

export const getAnimeStatistics = async (id: string) => {
	const dataAnimeStatus = ["completed", "watching", "postponed", "dropped"];

	const promises = dataAnimeStatus.map(async (status) => {
		const statusAnimeQ = query(
			collection(db, `users/${id}/anime`),
			where("animeState", "==", status)
		);
		const animeCount = await getCountFromServer(statusAnimeQ);
		return animeCount.data().count;
	});

	const counts = await Promise.all(promises);
	return {
		completed: counts[0] || 0,
		watching: counts[1] || 0,
		postponed: counts[2] || 0,
		dropped: counts[3] || 0,
		total: counts.reduce((acc, curr) => acc + curr, 0),
	};
};
