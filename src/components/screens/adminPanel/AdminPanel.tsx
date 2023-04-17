import { FC } from "react";
import classes from "./AdminPanel.module.scss";
import HeaderAdminPanel from "./headerAdminPanel/HeaderAdminPanel";
import MainAdminPanel from "./mainAdminPanel/MainAdminPanel";
import Meta from "@Components/seo/Meta";

const AdminPanel: FC = () => {
	return (
		<>
			<Meta title="Admin panel" />
			<div className={classes.wrapper}>
				<HeaderAdminPanel />
				<MainAdminPanel />
			</div>
		</>
	);
};

export default AdminPanel;
