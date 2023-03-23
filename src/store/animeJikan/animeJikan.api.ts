import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IAnimeJikan, IJitakFullAnime } from "./IAnime.interface";
import { IGenres } from "../../components/screens/home/setGenres/genres.interface";

export interface IGetParams {
	search?: string;
	activePage?: number;
	sort?: string;
	orderBy?: string;
	id?: number;
	status?: string;
	type?: string;
	startDate?: string;
	genresExclude?: string;
	genres?: string;
}

export const animeJikanApi = createApi({
	reducerPath: "animeJikanApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://api.jikan.moe/v4",
	}),
	tagTypes: ["Jikan"],

	endpoints: (build) => ({
		getAnimeJikan: build.query<IAnimeJikan, IGetParams | string>({
			query: (body: IGetParams) => ({
				url: "/anime",
				params: {
					// start_date: body.startDate,
					q: body.search,
					order_by: body.orderBy,
					sort: body.sort,
					page: body.activePage,
					status: body.status,
					type: body.type,
					genres: body.genres,
					sfw: true,
				},
			}),
		}),
		getTopAnimeJikan: build.query<IJitakFullAnime, void>({
			query: () => `/top/anime`,
		}),

		getByIdAnimeJikan: build.query<IJitakFullAnime, number>({
			query: (id: number) => `/anime/${id}`,
		}),

		getRandomAnimeJikan: build.query<IJitakFullAnime, void>({
			query: () => `/random/anime?sfw`,
			providesTags: ["Jikan"],
		}),

		getGenresAnimeJikan: build.query<IGenres, string>({
			query: (filter: string) => ({
				url: `/genres/anime`,
				params: {
					filter: filter,
				},
			}),
			providesTags: ["Jikan"],
		}),
	}),
});

export const {
	useGetAnimeJikanQuery,
	useGetByIdAnimeJikanQuery,
	useGetRandomAnimeJikanQuery,
	useGetTopAnimeJikanQuery,
	useGetGenresAnimeJikanQuery,
} = animeJikanApi;
