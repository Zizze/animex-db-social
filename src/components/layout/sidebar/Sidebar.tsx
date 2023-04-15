import React, { FC, useState, useEffect } from "react";
import Logo from "./logo/Logo";
import Navigation from "./navigation/Navigation";
import classes from "./Sidebar.module.scss";
import cn from "classnames";
import { MdOutlineMenuOpen } from "react-icons/md";
import SupportBtn from "./supportBtn/SupportBtn";

const Sidebar: FC = () => {
	const [hideSidebar, setHideSidebar] = useState(false);

	useEffect(() => {
		const screenWidth = window.screen.width <= 1071;
		if (screenWidth) setHideSidebar(true);
	}, []);

	return (
		<div className={cn(classes.sidebar, hideSidebar && classes.hiden)}>
			<button
				className={classes.hideBtn}
				onClick={() => setHideSidebar((prev) => !prev)}
				title={hideSidebar ? "Show menu" : "Hide menu"}
			>
				<span className={classes.arrow}>
					<MdOutlineMenuOpen />
				</span>
			</button>
			<div>
				<Logo />
				<Navigation setHideSidebar={setHideSidebar} />
			</div>
			<div className={classes.bottom}>
				<SupportBtn />
			</div>
		</div>
	);
};

export default Sidebar;
