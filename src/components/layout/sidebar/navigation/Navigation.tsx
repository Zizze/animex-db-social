import { FC, useEffect, Dispatch, SetStateAction, useCallback } from "react";
import classes from "./Navigation.module.scss";
import { mainNavData, userNavData } from "./navList.data";
import MainNav from "./mainNav/MainNav";
import UserNav from "./userNav/UserNav";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRouter } from "next/router";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";
import { useAuthContext } from "@/context/useAuthContext";
	
	

interface IProps {
	setHideSidebar: Dispatch<SetStateAction<boolean>>;
}

const Navigation: FC<IProps> = ({ setHideSidebar }) => {
	const router = useRouter();
	const currentPath = router.asPath;
	const dispatch = useAppDispatch();
	const { mainHomeMode } = useAppSelector((state) => state.animeJikan);
	const { user } = useAuthContext();

	useEffect(() => {
		mainNavData.forEach((mainItem) => {
			if (currentPath === mainItem.href) {
				dispatch(changeHomeMode(mainItem.name));
			}
		});
		userNavData.forEach((mainItem) => {
			if (currentPath === mainItem.href) {
				dispatch(changeHomeMode(mainItem.name));
			}
		});
	}, [currentPath]);

	const onClickHandler = useCallback(() => {
		const screenWidth = window.screen.width <= 1071;
		if (screenWidth) setHideSidebar(true);
	}, []);

	return (
		<nav className={classes.navigation}>
			<ul>
				<>
					{mainNavData.map((item) => {
						return (
							<MainNav
								onClickHandler={onClickHandler}
								item={item}
								key={item.name}
								listName={mainHomeMode}
							/>
						);
					})}

					<div className={classes.line} />

					{user && userNavData.map((item) => {
						return (
							<UserNav
								onClickHandler={onClickHandler}
								item={item}
								key={item.name}
								listName={mainHomeMode}
							/>
						);
					})}

					<div className={"menuIndicator"} />
				</>
			</ul>
		</nav>
	);
};

export default Navigation;
