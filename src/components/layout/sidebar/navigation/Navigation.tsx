import { FC, useEffect } from "react";
import classes from "./Navigation.module.scss";
import { mainNavData, userNavData } from "./navList.data";
import MainNav from "./mainNav/MainNav";
import UserNav from "./userNav/UserNav";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRouter } from "next/router";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";

const Navigation: FC = () => {
	const router = useRouter();
	const currentPath = router.asPath;
	const dispatch = useAppDispatch();
	const { mainHomeMode } = useAppSelector((state) => state.animeJikan);

	useEffect(() => {
		mainNavData.forEach((mainItem) => {
			if (currentPath === mainItem.href) {
				dispatch(changeHomeMode(mainItem.name));
			}
		});
	}, []);

	return (
		<nav className={classes.navigation}>
			<ul>
				<>
					{mainNavData.map((item) => {
						return <MainNav item={item} key={item.name} listName={mainHomeMode} />;
					})}

					<div className={classes.line} />

					{userNavData.map((item) => {
						return <UserNav item={item} key={item.name} listName={mainHomeMode} />;
					})}

					<div className={"menuIndicator"} />
				</>
			</ul>
		</nav>
	);
};

export default Navigation;
