import React from "react";
import { useGetRandomAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { NextPage } from "next";
import Loading from "@Components/UI/loading/Loading";
import Layout from "@Components/layout/Layout";
import AnimeDetails from "@Components/screens/animeDetails/AnimeDetails";
import { useRouter } from "next/router";

const RandomAnimePage: NextPage = () => {
	const { data: anime, isError, isLoading } = useGetRandomAnimeJikanQuery();
	const router = useRouter();

	if (isLoading) return <Loading />;
	if (isError || !anime) {
		router.push("/404");
		return <></>;
	}

	return <AnimeDetails animeId={anime.data.mal_id} />;
};

export default RandomAnimePage;
