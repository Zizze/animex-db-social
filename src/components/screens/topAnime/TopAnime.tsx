import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import Loading from "@Components/UI/loading/Loading";
import Pagination from "@Components/UI/pagination/Pagination";
import { useGetAnimeJikanQuery } from "@Store/animeJikan/animeJikan.api";
import { changePageHome } from "@Store/animeJikan/animeJikanSlice";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Items from "../home/items/Items";
import classes from "./TopAnime.module.scss";
import Meta from "@Components/seo/Meta";

const TopAnimes = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const topRef = useRef<HTMLDivElement>(null);

	const { activePage, search } = useAppSelector((state) => state.animeJikan);
	const { error, data, isLoading } = useGetAnimeJikanQuery({
		orderBy: "score",
		search,
		sort: "desc",
		activePage,
	});

	const onChangePage = (currPage: number) => {
		dispatch(changePageHome(currPage));
		topRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (error) router.push("/404");
	}, [error]);

	return (
		<>
			<Meta title="Top anime" description="The best anime of all time." />
			<div className={classes.wrapper} ref={topRef}>
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
		</>
	);
};

export default TopAnimes;
