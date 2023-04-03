import { FC, useEffect, useRef, FormEvent } from "react";
import classes from "./Search.module.scss";
import { FiSearch } from "react-icons/fi";
import cn from "classnames";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { searchValueData, changeHomeMode } from "@Store/animeJikan/animeJikanSlice";
import { useRouter } from "next/router";
import { useTextField } from "@/hooks/useTextField";

const Search: FC = () => {
	const router = useRouter();
	const searchRef = useRef<HTMLFormElement>(null);
	const dispatch = useAppDispatch();

	const { value, onChange, error, setFirstChange } = useTextField({
		minLength: 3,
		allowWhitespace: true,
	});

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();

		if (error === null || error.length) {
			return setFirstChange(true);
		} else {
			await router.push("/");
			dispatch(changeHomeMode("Home"));
			dispatch(searchValueData(value));
		}
	};

	const handleClick = (e: Event) => {
		if (!error || !error.length) return;
		if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
			setFirstChange(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [error]);

	const classNames = cn(classes.searchValid, error?.length && classes.on);

	return (
		<div className={classes.container}>
			<form onSubmit={onSubmitHandler} className={classes.search} ref={searchRef}>
				<button className={classes.btn} type="submit">
					<FiSearch className={cn(error?.length && classes.validIco)} />
				</button>
				<input
					className={!error?.length ? classes.valid : classes.notValid}
					type="text"
					value={value}
					placeholder="Anime, actions..."
					onChange={onChange}
				/>
			</form>
			<span className={classNames}>{error}</span>
		</div>
	);
};

export default Search;
