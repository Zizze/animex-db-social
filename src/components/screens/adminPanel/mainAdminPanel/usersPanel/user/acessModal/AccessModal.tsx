import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";
import CloseModal from "@Components/UI/btn/CloseModal";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Checkbox from "@Components/UI/checkbox/Checkbox";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { db } from "@Project/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import classes from "./AccessModal.module.scss";
import { dataAccess } from "../../usersPanel.data";
import { popMessage } from "@/utils/popMessage/popMessage";

interface IProps {
	visibleAccessModal: boolean;
	setVisibleAccessModal: Dispatch<SetStateAction<boolean>>;
	currUser: IUserFirebase;
}

const AccessModal: FC<IProps> = ({ visibleAccessModal, setVisibleAccessModal, currUser }) => {
	const { userStorage } = useAuthContext();
	const [accessSelect, setAccessSelect] = useState(currUser.access || 0);
	const [noRights, setNoRights] = useState(false);
	const { popSuccess, popError, ctxMessage } = popMessage();

	const changeAccessHandler = async () => {
		if (!userStorage) return;
		const currAccessUser = currUser.access || 0;
		const adminAccess = userStorage.access || 0;
		setNoRights(false);

		if (currAccessUser === accessSelect) {
			setVisibleAccessModal(false);
		} else {
			if (adminAccess > currAccessUser && adminAccess > accessSelect) {
				try {
					await updateDoc(doc(db, `users/${currUser.id}`), { access: accessSelect });
					await addDoc(collection(db, "adminsAction"), {
						type: "access",
						adminId: userStorage.id,
						userId: currUser.id,
						timestamp: serverTimestamp(),
						access: accessSelect,
					});

					setVisibleAccessModal(false);

					popSuccess("Access changed successfully");
				} catch {
					popError("Access changed error");
				}
			} else {
				setNoRights(true);
			}
		}
	};

	return (
		<>
			{ctxMessage}
			{visibleAccessModal && (
				<ModalWrapper onClickHandler={() => setVisibleAccessModal(false)}>
					<div className={classes.accessModal}>
						<p className={classes.accessTitle}>Access settings</p>
						<ul className={classes.checkboxes}>
							{noRights && (
								<p className={classes.noRights}>You do not have enough access rights.</p>
							)}
							{dataAccess.map((item) => (
								<li key={item.id}>
									<Checkbox
										id={item.id}
										name={item.name}
										onChangeHandler={(id: string) => setAccessSelect(+id)}
										onlyOneMode={true}
										disabled={item.id === accessSelect}
									/>
								</li>
							))}
						</ul>
						<div className={classes.btns}>
							<DefaultBtn
								className={classes.accessBtn}
								classMode="clear"
								title="Confirm"
								onClickHandler={changeAccessHandler}
							>
								Confirm
							</DefaultBtn>
							<CloseModal
								className={classes.close}
								onClickHandler={() => setVisibleAccessModal(false)}
							/>
						</div>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default AccessModal;
