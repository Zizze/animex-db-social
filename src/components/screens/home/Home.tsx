import { FC, useRef } from "react";
import Layout from "@Components/layout/Layout";
import Categories from "./categories/Categories";
import Items from "./items/Items";
import { useGetAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import classes from "./Home.module.scss";
import Pagination from "@Components/UI/pagination/Pagination";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { changePageHome } from "@Store/animeJikan/animeJikanSlice";

import { useOutside } from "@/hooks/useOutside";
import Loading from "@Components/UI/loading/Loading";
import Chat from "./chat/Chat";
import GenreThemeModal from "./genreThemeModal/GenreThemeModal";

const Home: FC = () => {
	const dispatch = useAppDispatch();
	const topRef = useRef<HTMLDivElement>(null);
	const { isShow, setIsShow } = useOutside(false);

	const { orderBy, status, activePage, search, startDate, selectedGenres } = useAppSelector(
		(state) => state.animeJikan
	);

	const { data, error, isLoading } = useGetAnimeJikanQuery({
		genres: selectedGenres.join(","),
		orderBy,
		search,
		sort: "asc",
		activePage,
		status,
		type: "movie tv ",
		startDate,
	});

	const onChangePage = (currPage: number) => {
		dispatch(changePageHome(currPage));
		topRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const pagination = {
		last: Number(data?.pagination.last_visible_page),
		current: Number(data?.pagination.current_page),
		hasNext: data?.pagination.has_next_page,
	};

	const existNextPageConditions =
		pagination.hasNext || (activePage === pagination.last && pagination.last !== 1);

	return (
		<Layout>
			{isLoading && <Loading />}
			<div className={classes.container} ref={topRef}>
				<Categories setIsShow={setIsShow} />
				<Items allAnimeJikan={data?.data} />
				<Chat />
			</div>
			<Pagination
				onChangePage={onChangePage}
				pageCount={pagination.last}
				thisPage={pagination.current}
				existNextPage={existNextPageConditions}
			/>

			<GenreThemeModal isShow={isShow} setIsShow={setIsShow} />
		</Layout>
	);
};

export default Home;
