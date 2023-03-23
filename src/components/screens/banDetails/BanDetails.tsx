import { useAuthContext } from "@/context/useAuthContext";
import { FC, useEffect, useState } from "react";
import classes from "./BanDetails.module.scss";
import { useRouter } from "next/router";
import Layout from "@Components/layout/Layout";
import { IUserFirebase } from "@/types/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@Project/firebase";
import { convertTimestamp } from "@/utils/convertTimestamp";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import SupportForm from "@Components/UI/supportForm/SupportForm";

const BanDetails: FC = () => {
	const [isOpenSupport, setIsOpenSupport] = useState(false);
	const [adminData, setAdminData] = useState<IUserFirebase>();
	const { user, userStorage } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!user || user.displayName !== router.query.name || !userStorage?.blocked) {
			router.push("/");
		}
	}, [router.query.name, user, userStorage]);

	useEffect(() => {
		if (!userStorage || !userStorage.blocked || !user) return;

		const adminRef = doc(db, `users/${userStorage.blocked.adminId}`);
		const unsub = onSnapshot(adminRef, (doc) => {
			setAdminData(doc.data() as IUserFirebase);
		});
		return () => unsub();
	}, [user, userStorage]);

	return (
		<Layout>
			<div className={classes.wrapper}>
				<div className={classes.container}>
					<h6>Your account is blocked.</h6>
					{adminData && userStorage && userStorage.blocked && (
						<ul>
							<li>
								Blocked by:
								<div>
									<Image
										src={adminData.photoURL || defaultImage}
										height={100}
										width={100}
										alt={`${adminData.name} ava`}
									/>
									<span>{adminData.name}</span>
								</div>
							</li>
							<li>
								Lock date:
								<span className={classes.date}>
									{convertTimestamp(userStorage.blocked.startBan)}
								</span>
							</li>
							<li>
								End of blocking:
								<span className={classes.date}>{convertTimestamp(userStorage.blocked.endBan)}</span>
							</li>
							<li>
								Reason: <p>{userStorage.blocked.message}</p>
							</li>
							<li className={classes.supportBlock}>
								If you have any questions, you can contact
								<button onClick={() => setIsOpenSupport(true)}>Support</button>.
							</li>
						</ul>
					)}
				</div>
				<SupportForm isActiveSupport={isOpenSupport} setIsActiveSupport={setIsOpenSupport} />
			</div>
		</Layout>
	);
};

export default BanDetails;
