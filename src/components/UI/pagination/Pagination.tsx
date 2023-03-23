import useDebounce from "@/hooks/useDebounce";
import { ChangeEvent, FC, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import classes from "./Pagination.module.scss";

interface IProps {
	pageCount: number | undefined;
	itemsPerPage?: number;
	thisPage?: number;
	existNextPage?: boolean;
	onChangePage: (currentPage: number) => void;
}

const Pagination: FC<IProps> = ({ pageCount, thisPage, existNextPage, onChangePage }) => {
	const [currentPage, setCurrentPage] = useState<number | string>(1);
	const debounce = useDebounce(currentPage, 1500);

	const handlePageClick = (event: { selected: number }) => {
		const activePageNumber = ++event.selected;
		setCurrentPage(activePageNumber);
	};

	const selectPage = (e: ChangeEvent<HTMLInputElement>) => {
		const inputPage = +e.target.value;

		if (inputPage <= 0) return setCurrentPage("");
		if (pageCount && inputPage > pageCount) return setCurrentPage(pageCount);
		setCurrentPage(inputPage);
	};

	useEffect(() => {
		onChangePage(+currentPage);
	}, [debounce]);

	return (
		<>
			{existNextPage && (
				<div className={classes.pagination}>
					<ReactPaginate
						forcePage={thisPage ? +thisPage - 1 : 0}
						breakLabel={null}
						previousLabel="<"
						nextLabel=">"
						pageCount={pageCount ? pageCount : 0}
						onPageChange={handlePageClick}
						renderOnZeroPageCount={undefined}
						pageRangeDisplayed={4}
						marginPagesDisplayed={0}
						className={classes.container}
						pageClassName={classes.li}
						pageLinkClassName={classes.a}
						activeClassName={classes.active}
						activeLinkClassName={classes.linkActive}
						previousClassName={classes.liPrev}
						previousLinkClassName={classes.aPrev}
						nextClassName={classes.liNext}
						nextLinkClassName={classes.aNext}
						disabledClassName={classes.disabled}
						disabledLinkClassName={classes.aDisabled}
					/>

					<label className={classes.setPage}>
						Go to page:
						<input
							type="number"
							value={currentPage}
							min={1}
							max={pageCount}
							onChange={selectPage}
						/>
					</label>
				</div>
			)}
		</>
	);
};

export default Pagination;
