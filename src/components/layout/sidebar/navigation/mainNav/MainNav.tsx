import Link from "next/link";
import { FC } from "react";
import classes from "../Navigation.module.scss";
import { INavList } from "../navList.data";
import cn from "classnames";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";

interface IListProps {
	item: INavList;
	listName: string;
	onClickHandler: () => void;
}

const MainNav: FC<IListProps> = ({ item, listName, onClickHandler }) => {
	const dispatch = useAppDispatch();
	const { href, name, img } = item;

	const onSelectMenu = () => {
		dispatch(changeHomeMode(name));
		onClickHandler();
	};

	const active = cn(classes.list, listName === name && "active-nav");
	return (
		<li className={active} key={name} onClick={onSelectMenu}>
			<Link href={href} className={classes.linkblock}>
				<div className={classes.linkInfo}>
					{img}
					<span className={classes.text}>{name}</span>
				</div>
			</Link>
		</li>
	);
};

export default MainNav;
