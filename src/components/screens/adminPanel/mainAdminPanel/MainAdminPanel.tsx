import { FC } from "react";
import AllComments from "./allComments/AllComments";

import classes from "./MainAdminPanel.module.scss";
import UsersPanel from "./usersPanel/UsersPanel";

const MainAdminPanel: FC = () => {
	return (
		<div className={classes.wrapper}>
			<UsersPanel />
			<AllComments />
		</div>
	);
};

export default MainAdminPanel;
