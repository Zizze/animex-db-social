import { FC, useState } from "react";
import classes from "./Messages.module.scss";
import PersonalChat from "./personalChat/PersonalChat";
import Users from "./users/Users";

const Messages: FC = () => {
	const [selectedUser, setSelectedUser] = useState("");

	return (
		<div className={classes.wrapper}>
			<Users setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
			<PersonalChat selectedUser={selectedUser} />
		</div>
	);
};

export default Messages;
