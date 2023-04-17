import { FC, useState } from "react";
import classes from "./Messages.module.scss";
import PersonalChat from "./personalChat/PersonalChat";
import Users from "./users/Users";
import Meta from "@Components/seo/Meta";

const Messages: FC = () => {
	const [selectedUser, setSelectedUser] = useState("");

	return (
		<>
			<Meta title="Messages" />
			<div className={classes.wrapper}>
				<Users setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
				<PersonalChat selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
			</div>
		</>
	);
};

export default Messages;
