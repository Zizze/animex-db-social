import Layout from "@Components/layout/Layout";
import { FC, useState } from "react";
import ChatUserList from "./chatUserList/ChatUserList";
import classes from "./Messages.module.scss";
import UserChat from "./userChat/UserChat";

const Messages: FC = () => {
	const [selectedUser, setSelectedUser] = useState("");

	return (
		<Layout>
			<div className={classes.wrapper}>
				<ChatUserList setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
				<UserChat selectedUser={selectedUser} />
			</div>
		</Layout>
	);
};

export default Messages;
