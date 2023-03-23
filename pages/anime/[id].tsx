import { useGetByIdAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { useRouter } from "next/router";
import MainInfoAnime from "@Components/screens/mainInfoItem/MainInfoItem";
import { NextPage } from "next";

const MainInfoAnimePage: NextPage = () => {
	const router = useRouter();
	const { data, isError, isLoading } = useGetByIdAnimeJikanQuery(Number(router.query.id));

	if (!data) return <></>;

	return <MainInfoAnime anime={data.data} />;
};

export default MainInfoAnimePage;
