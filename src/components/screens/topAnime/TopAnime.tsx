import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import Layout from "@Components/layout/Layout";
import Loading from "@Components/UI/loading/Loading";
import Pagination from "@Components/UI/pagination/Pagination";
import { useGetAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { changePageHome } from "@Store/animeJikan/animeJikanSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Items from "../home/items/Items";
import classes from "./TopAnime.module.scss";

const TopAnimes = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { activePage, search } = useAppSelector((state) => state.animeJikan);
	const { error, data, isLoading } = useGetAnimeJikanQuery({
		orderBy: "score",
		search,
		sort: "desc",
		activePage,
	});

	const onChangePage = (currPage: number) => {
		dispatch(changePageHome(currPage));
	};

	useEffect(() => {
		if (error) router.push("/404");
	}, [error]);

	return (
		<Layout>
			<div className={classes.wrapper}>
				{isLoading ? (
					<Loading />
				) : (
					<>
						<Items allAnimeJikan={data?.data} />
						<Pagination
							onChangePage={onChangePage}
							pageCount={Number(data?.pagination.last_visible_page)}
							thisPage={Number(data?.pagination.current_page)}
							existNextPage={data?.pagination.has_next_page}
						/>
					</>
				)}
			</div>
		</Layout>
	);
};

export default TopAnimes;
