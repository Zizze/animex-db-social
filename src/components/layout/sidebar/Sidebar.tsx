import React, { FC, useState } from "react";

import Logo from "./logo/Logo";
import Navigation from "./navigation/Navigation";
import classes from "./Sidebar.module.scss";
import cn from "classnames";
import { MdArrowBackIosNew } from "react-icons/md";
import SupportBtn from "./supportBtn/SupportBtn";

const Sidebar: FC = () => {
	const [hideSidebar, setHideSidebar] = useState(false);

	const onClickHandler = () => {
		setHideSidebar((prev) => !prev);
	};

	return (
		<div className={cn(classes.sidebar, hideSidebar && classes.hiden)}>
			<button
				className={classes.hideBtn}
				onClick={onClickHandler}
				title={hideSidebar ? "Show menu" : "Hide menu"}
			>
				{new Array(3).fill(null).map((_, i) => (
					<span className={classes.arrow} key={i}>
						<MdArrowBackIosNew />
					</span>
				))}
			</button>
			<div>
				<Logo />
				<Navigation />
			</div>
			<div className={classes.bottom}>
				<SupportBtn />
			</div>
		</div>
	);
};

export default Sidebar;
