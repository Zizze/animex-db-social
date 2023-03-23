import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import classes from "./UnblockModal.module.scss";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { db } from "@Project/firebase";
import defaultImage from "@Public/testava.jpg";
import { IUserFirebase } from "@/types/types";
import { useAuthContext } from "@/context/useAuthContext";
import { convertTimestamp } from "@/utils/convertTimestamp";
import Link from "next/link";
import Image from "next/image";
import CloseModal from "@Components/UI/btn/CloseModal";
import { popMessage } from "@/utils/popMessage/popMessage";

interface IProps {
	visibleUnblockModal: boolean;
	setVisibleUnblockModal: Dispatch<SetStateAction<boolean>>;
	currUser: IUserFirebase;
}

const UnblockModal: FC<IProps> = ({ setVisibleUnblockModal, currUser, visibleUnblockModal }) => {
	const [adminData, setAdminData] = useState<IUserFirebase>();
	const { userStorage } = useAuthContext();
	const { name, blocked, id } = currUser;
	const { popSuccess, popError, ctxMessage } = popMessage();

	const startBlockTimestamp = convertTimestamp(blocked?.startBan || null);
	const endBlockTimestamp = convertTimestamp(blocked?.endBan || null);

	useEffect(() => {
		if (!blocked) return;
		const adminRef = doc(db, `users/${blocked.adminId}`);
		const unsub = onSnapshot(adminRef, (doc) => {
			setAdminData(doc.data() as IUserFirebase);
		});

		return () => unsub();
	}, [blocked]);

	const onClickUnblock = async () => {
		if (userStorage?.access && userStorage.access < 1) return;
		try {
			await updateDoc(doc(db, `users/${currUser.id}`), { blocked: null });
			await addDoc(collection(db, "adminsAction"), {
				type: "unblock",
				adminId: userStorage?.id,
				userId: id,
				timestamp: serverTimestamp(),
			});

			setVisibleUnblockModal(false);
			popSuccess("User unblocked");
		} catch {
			popError("Unblock error");
		}
	};

	return (
		<>
			{ctxMessage}
			{visibleUnblockModal && (
				<ModalWrapper onClickHandler={() => setVisibleUnblockModal(false)}>
					<div className={classes.unblock}>
						<p className={classes.titleUnblock}>
							Unblock user <span>{name}</span> ?
						</p>
						<ul className={classes.info}>
							<>
								<li>
									<span className={classes.mainSpan}>Issued a ban:</span>
									<Link href={`/profile/${adminData?.name}`}>
										<div>
											<Image
												src={adminData?.photoURL || defaultImage}
												height={100}
												width={100}
												alt="Admin avatar"
											/>
											<span>{adminData?.name}</span>
										</div>
									</Link>
								</li>
								<li>
									<span className={classes.mainSpan}>Block:</span>
									<span> {startBlockTimestamp}</span>
								</li>
								<li>
									<span className={classes.mainSpan}>Unblock:</span>
									<span> {endBlockTimestamp}</span>
								</li>
								<li>
									<span className={classes.mainSpan}>Ban reason:</span>
									<span> {blocked?.message}</span>
								</li>
							</>
						</ul>
						<div className={classes.btns}>
							<DefaultBtn onClickHandler={onClickUnblock} classMode="main-simple">
								Unblock
							</DefaultBtn>
						</div>
						<CloseModal
							className={classes.closeBtn}
							onClickHandler={() => setVisibleUnblockModal(false)}
						/>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default UnblockModal;
