import { FC, useEffect, useRef, useState } from "react";
import Layout from "@Components/layout/Layout";
import Categories from "./categories/Categories";
import Items from "./items/Items";
import { useGetAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import classes from "./Home.module.scss";
import Pagination from "@Components/UI/pagination/Pagination";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { changePageHome } from "@Store/animeJikan/animeJikanSlice";
import SetGenres from "./setGenres/SetGenres";
import { useOutside } from "@/hooks/useOutside";
import Loading from "@Components/UI/loading/Loading";
import Chat from "./chat/Chat";

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

	// useEffect(() => {
	// 	const timeoutID = setTimeout(() => {
	// 		topRef.current?.scrollIntoView({ behavior: "smooth" });
	// 	}, 100);
	// 	return () => clearTimeout(timeoutID);
	// }, [activePage]);

	return (
		<Layout>
			<div className={classes.container} ref={topRef}>
				<Categories setIsShow={setIsShow} />

				{isLoading ? <Loading /> : <Items allAnimeJikan={data?.data} />}
				<Chat />
			</div>
			<Pagination
				onChangePage={onChangePage}
				pageCount={Number(data?.pagination.last_visible_page)}
				thisPage={Number(data?.pagination.current_page)}
				existNextPage={data?.pagination.has_next_page}
			/>

			<SetGenres isShow={isShow} setIsShow={setIsShow} />
		</Layout>
	);
};

export default Home;
