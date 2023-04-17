import { useAuthContext } from "@/context/useAuthContext";
import { FC, useEffect, useState } from "react";
import classes from "./BanDetails.module.scss";
import { useRouter } from "next/router";
import Layout from "@Components/layout/Layout";
import { IUserFirebase } from "@/types/types";
import { convertTimestamp } from "@/utils/convertTimestamp";
import Image from "next/image";
import defaultImage from "@Public/testava.jpg";
import SupportForm from "@Components/UI/supportForm/SupportForm";
import { useRealtimeDoc } from "@/hooks/firebase/useRealtimeDoc";
import Loading from "@Components/UI/loading/Loading";
import Meta from "@Components/seo/Meta";

const BanDetails: FC = () => {
	const router = useRouter();
	const [isOpenSupport, setIsOpenSupport] = useState(false);

	const { user, userStorage } = useAuthContext();
	const { data: adminData, loading } = useRealtimeDoc<IUserFirebase>(
		`users/${userStorage?.blocked?.adminId}`
	);

	useEffect(() => {
		if (!user || user.displayName !== router.query.name || !userStorage?.blocked) {
			router.replace("/");
		}
	}, [router.query.name, user]);

	return (
		<>
			<Meta title="Block details" />
			{loading ? (
				<Loading />
			) : (
				<div className={classes.wrapper}>
					<div className={classes.container}>
						{adminData && userStorage && userStorage.blocked && (
							<>
								<h6>Your account is blocked.</h6>
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
										<span className={classes.date}>
											{convertTimestamp(userStorage.blocked.endBan)}
										</span>
									</li>
									<li>
										Reason: <p>{userStorage.blocked.message}</p>
									</li>
									<li className={classes.supportBlock}>
										If you have any questions, you can contact
										<button onClick={() => setIsOpenSupport(true)}>Support</button>.
									</li>
								</ul>
							</>
						)}
					</div>
					<SupportForm isActiveSupport={isOpenSupport} setIsActiveSupport={setIsOpenSupport} />
				</div>
			)}
		</>
	);
};

export default BanDetails;
