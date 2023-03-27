import { IAdminActionFirebase, IUserFirebase } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import classes from "./Action.module.scss";
import defaultImage from "@Public/testava.jpg";
import { userAccessInString } from "@/utils/userAccessInString";
import cn from "classnames";
import { convertTimestamp } from "@/utils/convertTimestamp";
import { checkCreateData } from "@/utils/checkCreateData";
import { adminActionData } from "./action.data";
import { useGetDoc } from "@/hooks/firebase/useGetDoc";

const Action: FC<{ action: IAdminActionFirebase }> = ({ action }) => {
	const [showHideToggle, setShowHideToggle] = useState(false);

	const { data: adminData } = useGetDoc<IUserFirebase>(`users/${action.adminId}`);
	const { data: userData } = useGetDoc<IUserFirebase>(`users/${action.userId}`);

	const createdTime = checkCreateData(action.timestamp.seconds);

	return (
		<li className={classes.action}>
			{adminActionData.map(
				({ type, descr }) =>
					type === action.type && (
						<div key={action.timestamp.toString() + action.adminId}>
							<div className={classes.shortDescr}>
								<Link href={`/profile/${adminData?.name}`}>
									<Image
										src={adminData?.photoURL || defaultImage}
										height={50}
										width={50}
										alt={`${adminData?.name} ava`}
									/>
									{adminData?.name}
								</Link>
								{action.type === adminActionData[4].type ? (
									<p>changed</p>
								) : action.page === "chat" ? (
									<p>{descr.replace("comment", "chat message")}</p>
								) : (
									<p>{descr}</p>
								)}
								{userData?.name && (
									<Link className={classes.userLink} href={`/profile/${userData?.name}`}>
										<Image
											src={userData?.photoURL || defaultImage}
											height={50}
											width={50}
											alt={`${userData?.name} ava`}
										/>
										{userData?.name}
									</Link>
								)}
								{action.type === adminActionData[4].type && (
									<p>{`${descr} "${userAccessInString(userData?.access || 0)}"`}</p>
								)}
								{action.type === adminActionData[1].type && (
									<p>
										until
										<span className={classes.untilTimestamp}>{` ${convertTimestamp(
											action.timestampEnd || null
										)}`}</span>
									</p>
								)}
							</div>

							<div className={classes.messageWrapper}>
								<div>
									<p>{createdTime}</p>
									{action.message && (
										<button onClick={() => setShowHideToggle((prev) => !prev)}>
											{action.type === adminActionData[0].type &&
												(showHideToggle ? "Hide the message" : "Show the message")}
											{action.type === adminActionData[1].type &&
												(showHideToggle ? "Hide the reason" : "Show the reason")}
											{action.type === adminActionData[3].type &&
												(showHideToggle ? "Hide the deleted message" : "Show the deleted message")}
										</button>
									)}
								</div>

								<p className={cn(showHideToggle && classes.activeMess, classes.message)}>
									{action.message}
								</p>
							</div>
						</div>
					)
			)}
		</li>
	);
};

export default Action;
