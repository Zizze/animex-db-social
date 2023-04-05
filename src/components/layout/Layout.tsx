import { FC, PropsWithChildren } from "react";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import classes from "./Layout.module.scss";
import MainChat from "./mainChat/MainChat";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className={classes.wrapper}>
			<Sidebar />
			<div className={classes.mainInfo}>
				<Header />
				<main className={classes.main}>
					{children}
					<MainChat />
				</main>
			</div>
		</div>
	);
};

export default Layout;
