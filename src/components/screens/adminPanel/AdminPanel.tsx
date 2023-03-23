import Layout from "@Components/layout/Layout";
import { FC } from "react";
import classes from "./AdminPanel.module.scss";
import HeaderAdminPanel from "./headerAdminPanel/HeaderAdminPanel";
import MainAdminPanel from "./mainAdminPanel/MainAdminPanel";

const AdminPanel: FC = () => {
	return (
		<Layout>
			<HeaderAdminPanel />
			<MainAdminPanel />
		</Layout>
	);
};

export default AdminPanel;
