import { FC, useState } from "react";
import UserControl from "./authMenu/UserControl";
import classes from "./Header.module.scss";
import Notification from "./notification/Notification";
import Search from "./search/Search";
import UserSettings from "./userSettings/UserSettings";

const Header: FC = () => {
	const [activeSetings, setActiveSetings] = useState(false);

	return (
		<header className={classes.header} id="header">
			<Search />
			<Notification />
			<UserControl setActiveSetings={setActiveSetings} />
			{activeSetings && <UserSettings setActiveSetings={setActiveSetings} />}
		</header>
	);
};

export default Header;
