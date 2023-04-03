import { FC, PropsWithChildren } from "react";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import classes from "./Layout.module.scss";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className={classes.wrapper}>
			<Sidebar />
			<div className={classes.mainInfo}>
				<Header />
				<main className={classes.main}>{children}</main>
			</div>
		</div>
	);
};

export default Layout;
