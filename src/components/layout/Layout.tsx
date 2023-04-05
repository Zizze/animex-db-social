import { FC, PropsWithChildren } from "react";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import classes from "./Layout.module.scss";
import MainChat from "./mainChat/MainChat";
import { useAuthContext } from "@/context/useAuthContext";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	const { userStorage } = useAuthContext();

	return (
		<div className={classes.wrapper}>
			<Sidebar />
			<div className={classes.mainInfo}>
				<Header />
				<main className={classes.main}>
					{children}
					{(!userStorage || !userStorage.settings?.chat) && <MainChat />}
				</main>
			</div>
		</div>
	);
};

export default Layout;
