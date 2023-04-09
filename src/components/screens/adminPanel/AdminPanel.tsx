import { FC } from "react";
import classes from "./AdminPanel.module.scss";
import HeaderAdminPanel from "./headerAdminPanel/HeaderAdminPanel";
import MainAdminPanel from "./mainAdminPanel/MainAdminPanel";

const AdminPanel: FC = () => {
	return (
		<div className={classes.wrapper}>
			<HeaderAdminPanel />
			<MainAdminPanel />
		</div>
	);
};

export default AdminPanel;
