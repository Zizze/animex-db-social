import { FC, useState } from "react";
import UserControl from "./userControl/UserControl";
import classes from "./Header.module.scss";
import Notification from "./notification/Notification";
import Search from "./search/Search";
import UserSettings from "./userSettings/UserSettings";
import { useAuthContext } from "@/context/useAuthContext";

const Header: FC = () => {
	const [activeSetings, setActiveSetings] = useState(false);
	const { user } = useAuthContext();

	return (
		<header className={classes.header} id="header">
			<Search />
			<Notification />
			<UserControl setActiveSetings={setActiveSetings} />
			{activeSetings && user && <UserSettings setActiveSetings={setActiveSetings} />}
		</header>
	);
};

export default Header;
