import React from "react";
import MainInfoAnime from "@Components/screens/mainInfoItem/MainInfoItem";
import { useGetRandomAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { NextPage } from "next";
import Loading from "@Components/UI/loading/Loading";
import Layout from "@Components/layout/Layout";

const RandomAnimePage: NextPage = () => {
	const { data, isError, isLoading } = useGetRandomAnimeJikanQuery();

	if (!data || isLoading)
		return (
			<Layout>
				<Loading />
			</Layout>
		);

	return <MainInfoAnime anime={data.data} isError={isError} isLoading={isLoading} />;
};

export default RandomAnimePage;
