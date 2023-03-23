import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import classes from "./Search.module.scss";
import { FiSearch } from "react-icons/fi";
import cn from "classnames";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { searchValueData, changeHomeMode } from "@Store/animeJikan/animeJikanSlice";
import { useRouter } from "next/router";

const Search: FC = () => {
	const router = useRouter();
	const { search } = useAppSelector((state) => state.animeJikan);
	const dispatch = useAppDispatch();

	const [validSearch, setValidSearch] = useState(true);
	const [value, setValue] = useState<string>(search);

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
		setValidSearch(true);
	};

	const onClickHandler = async (e: MouseEvent<HTMLButtonElement>) => {
		if (value.trim().length <= 3) {
			setValidSearch(false);
			return;
		} else {
			await router.push("/");
			dispatch(changeHomeMode("Home"));
			dispatch(searchValueData(value));
		}
	};

	// useEffect(() => {

	// }, [value]);

	const classNames = cn(classes.searchValid, !validSearch && classes.on);

	return (
		<div className={classes.container}>
			<div className={classes.search}>
				<button className={classes.btn} onClick={onClickHandler}>
					<FiSearch className={cn(!validSearch && classes.validIco)} />
				</button>
				<input
					className={validSearch ? classes.valid : classes.notValid}
					type="text"
					value={value}
					placeholder="Anime, actions..."
					onChange={onChangeHandler}
				/>
			</div>
			<span className={classNames}>It's too short a name.</span>
		</div>
	);
};

export default Search;
