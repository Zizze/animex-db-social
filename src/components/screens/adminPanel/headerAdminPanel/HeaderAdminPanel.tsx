import { FC, useEffect, useState } from "react";
import classes from "./HeaderAdminPanel.module.scss";
import { FaUsers } from "react-icons/fa";
import { AiFillWechat } from "react-icons/ai";
import { collection, collectionGroup, getCountFromServer } from "firebase/firestore";
import { db } from "@Project/firebase";
import { TbMessages, TbListDetails, TbHelp } from "react-icons/tb";
import MassMailing from "./massMailing/MassMailing";
import AdminsAction from "./adminsAction/AdminsAction";
import Support from "./support/Support";

const HeaderAdminPanel: FC = () => {
	const [isVisibleMassMailing, setIsVisibleMassMailing] = useState(false);
	const [isVisibleActions, setIsVisibleActions] = useState(false);
	const [isVisibleSupport, setIsVisibleSupport] = useState(false);

	const [usersCount, setUsersCount] = useState(0);
	const [commentsCount, setCommentsCount] = useState(0);

	useEffect(() => {
		const getUserCount = async () => {
			const usersRef = collection(db, "users");
			const snapshot = await getCountFromServer(usersRef);
			setUsersCount(snapshot.data().count);
		};
		const getCommentsCount = async () => {
			const commentsRef = collectionGroup(db, "dataAnime");
			const animeDoc = await getCountFromServer(commentsRef);
			setCommentsCount(animeDoc.data().count);
		};
		getUserCount();
		getCommentsCount();
	}, []);

	return (
		<>
			<ul className={classes.adminCards}>
				{/* Max  card in block === 2; */}
				<li className={classes.adminCard}>
					<div className={classes.adminCardWrapper}>
						<p className={classes.name}>users</p>
						<p className={classes.count}>{usersCount}</p>
						<FaUsers />
					</div>
					<div className={classes.adminCardWrapper}>
						<p className={classes.name}>comments</p>
						<p className={classes.count}>{commentsCount}</p>
						<AiFillWechat />
					</div>
				</li>

				{/* Max mini card in block === 4; */}
				<li className={classes.adminCardMini}>
					<button title="Mass mailing" onClick={() => setIsVisibleMassMailing(true)}>
						<TbMessages />
					</button>
					<button
						title="The latest actions of the administration"
						onClick={() => setIsVisibleActions(true)}
					>
						<TbListDetails />
					</button>
					<button
						title="Messages for administration (Support)."
						onClick={() => setIsVisibleSupport(true)}
					>
						<TbHelp />
					</button>
				</li>
			</ul>
			<MassMailing
				setIsVisibleMassMailing={setIsVisibleMassMailing}
				isVisibleMassMailing={isVisibleMassMailing}
			/>
			<AdminsAction setIsVisibleActions={setIsVisibleActions} isVisibleActions={isVisibleActions} />
			{isVisibleSupport && <Support setIsVisibleSupport={setIsVisibleSupport} />}
		</>
	);
};

export default HeaderAdminPanel;
