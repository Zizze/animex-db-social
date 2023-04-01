import { NextPage } from "next";
import AnimeDetails from "@Components/screens/animeDetails/AnimeDetails";
import { useRouter } from "next/router";

const MainInfoAnimePage: NextPage = () => {
	const { query } = useRouter();
	const animeId = Number(query?.id);

	if (isNaN(animeId)) return <></>;
	return <AnimeDetails animeId={animeId} />;
};

export default MainInfoAnimePage;
