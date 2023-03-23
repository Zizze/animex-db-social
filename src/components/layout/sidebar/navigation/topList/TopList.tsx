import Link from "next/link";
import { FC, MouseEvent, useEffect } from "react";
import classes from "../Navigation.module.scss";
import { INavList } from "../List.data";
import cn from "classnames";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";
import { useRouter } from "next/router";

interface IListProps {
	item: INavList;
	listName: string;
}

const TopList: FC<IListProps> = ({ item, listName }) => {
	const { href, name, img } = item;
	const active = cn(classes.list, listName === name && "active-nav");
	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		switch (router.asPath) {
			case "/top-anime":
				dispatch(changeHomeMode("Top score"));
				return;
			case "/random-anime":
				dispatch(changeHomeMode("Random"));
				return;
		}
	}, [router]);

	const onClickHandler = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch(changeHomeMode(name));
	};

	return (
		<li className={active} key={name} onClick={(e) => onClickHandler(e)}>
			<Link href={href} className={classes.linkblock}>
				<div className={classes.linkInfo}>
					{img}
					<span className={classes.text}>{name}</span>
				</div>
			</Link>
		</li>
	);
};

export default TopList;
