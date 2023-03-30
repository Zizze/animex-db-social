import Layout from "@Components/layout/Layout";
import { FC, useState } from "react";
import classes from "./Messages.module.scss";
import PersonalChat from "./personalChat/PersonalChat";
import Users from "./users/Users";

const Messages: FC = () => {
	const [selectedUser, setSelectedUser] = useState("");

	return (
		<Layout>
			<div className={classes.wrapper}>
				<Users setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
				<PersonalChat selectedUser={selectedUser} />
			</div>
		</Layout>
	);
};

export default Messages;
