import { FC, ReactNode } from "react";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import classes from "./Layout.module.scss";

interface Props {
	children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
	return (
		<div className={classes.wrapper}>
			{/* <div className="body-container"> */}
			<Sidebar />
			<div className={classes.mainInfo}>
				<Header />
				<main className={classes.main}>{children}</main>
			</div>
			{/* </div> */}
		</div>
	);
};

export default Layout;
