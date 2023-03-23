import { IUserFirebase } from "@/types/types";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import classes from "./User.module.scss";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbLock, TbLockOpen } from "react-icons/tb";

import { useAuthContext } from "@/context/useAuthContext";
import defaulImage from "@Public/testava.jpg";
import Link from "next/link";

import { userAccessInString } from "@/utils/userAccessInString";
import BlockModal from "./blockModal/BlockModal";
import UnblockModal from "./unblockModal/UnblockModal";
import AccessModal from "./acessModal/AccessModal";
import { userBanChecker } from "@/utils/userBanChecker";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@Project/firebase";

interface IProps {
	currUser: IUserFirebase;
}

const User: FC<IProps> = ({ currUser }) => {
	const { userStorage } = useAuthContext();
	const [user, setUser] = useState<IUserFirebase>();

	const [visibleBlockModal, setVisibleBlockModal] = useState(false);
	const [visibleUnblockModal, setVisibleUnblockModal] = useState(false);
	const [visibleAccessModal, setVisibleAccessModal] = useState(false);

	const { name, photoURL, id, settings } = currUser;
	const userBanned = user && user.blocked && userBanChecker(user.blocked.endBan);

	useEffect(() => {
		const userRef = doc(db, `users/${currUser.id}`);
		const unsub = onSnapshot(userRef, (doc) => {
			if (doc.exists()) setUser(doc.data() as IUserFirebase);
		});
		return () => unsub();
	}, []);

	if (currUser.name_lowercase === "animex") return <></>;
	return (
		<>
			<li className={classes.user}>
				<p className={classes.userAccess}>{userAccessInString(user?.access || 0)}</p>
				<div className={classes.info}>
					<Link href={`/profile/${name}`}>
						<div className={classes.image}>
							<Image src={photoURL || defaulImage} alt={`${name} photo`} width={150} height={150} />
						</div>
						<div className={classes.nameWrapper}>
							<h5 className={classes.name}>{name}</h5>
						</div>
					</Link>
				</div>

				<div className={classes.btns}>
					<DefaultBtn
						className={classes.acessBtn}
						classMode="clear"
						title="Assign user"
						onClickHandler={() => setVisibleAccessModal(true)}
						disabled={(userStorage?.access || 0) > (currUser.access || 0) ? false : true}
					>
						<MdOutlineAdminPanelSettings />
					</DefaultBtn>

					<DefaultBtn
						classMode={userBanned ? "main-simple" : "decline"}
						title={userBanned ? "Unblock user" : "Block user"}
						onClickHandler={
							userBanned ? () => setVisibleUnblockModal(true) : () => setVisibleBlockModal(true)
						}
						disabled={(userStorage?.access || 0) > (currUser.access || 0) ? false : true}
					>
						{userBanned ? <TbLockOpen /> : <TbLock />}
					</DefaultBtn>
				</div>
			</li>

			<AccessModal
				visibleAccessModal={visibleAccessModal}
				setVisibleAccessModal={setVisibleAccessModal}
				currUser={user || currUser}
			/>

			<BlockModal
				setVisibleBlockModal={setVisibleBlockModal}
				currUserId={id}
				visibleBlockModal={visibleBlockModal}
			/>

			<UnblockModal
				setVisibleUnblockModal={setVisibleUnblockModal}
				currUser={user || currUser}
				visibleUnblockModal={visibleUnblockModal}
			/>
		</>
	);
};

export default User;
