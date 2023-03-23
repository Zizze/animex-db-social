import { FC } from "react";
import classes from "./Navigation.module.scss";
import { dataListTop, dataListCenter } from "./List.data";
import TopList from "./topList/TopList";
import CenterList from "./centerList/CenterList";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAuthContext } from "@/context/useAuthContext";

const Navigation: FC = () => {
	const { mainHomeMode } = useAppSelector((state) => state.animeJikan);
	const { user } = useAuthContext();

	return (
		<nav className={classes.navigation}>
			<ul>
				<>
					{dataListTop.map((item) => {
						return <TopList item={item} key={item.name} listName={mainHomeMode} />;
					})}

					<div className={classes.line} />

					{dataListCenter.map((item) => {
						return <CenterList item={item} key={item.name} listName={mainHomeMode} />;
					})}

					<div className={"menuIndicator"} />
				</>
			</ul>
		</nav>
	);
};

export default Navigation;
