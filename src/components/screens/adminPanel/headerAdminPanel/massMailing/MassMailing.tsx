import CloseModal from "@Components/UI/btn/CloseModal";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import React, { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import classes from "./MassMailing.module.scss";
import {
	collection,
	getDocs,
	addDoc,
	doc,
	getDoc,
	updateDoc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import Loading from "@Components/UI/loading/Loading";
import { popMessage } from "@/utils/popMessage/popMessage";
import { useAuthContext } from "../../../../../context/useAuthContext";

interface IProps {
	setIsVisibleMassMailing: Dispatch<SetStateAction<boolean>>;
	isVisibleMassMailing: boolean;
}
const MIN_MESS_LENGHT = 10;

const MassMailing: FC<IProps> = ({ setIsVisibleMassMailing, isVisibleMassMailing }) => {
	const { user } = useAuthContext();
	const [messTxt, setMessTxt] = useState("");
	const [validTxt, setValidTxt] = useState(true);
	const [loading, seLoading] = useState(false);
	const { popSuccess, popError, ctxMessage } = popMessage();

	const onSubmitMassMailing = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;
		if (messTxt.trim().length >= MIN_MESS_LENGHT) {
			setValidTxt(true);
			seLoading(true);

			const usersRef = collection(db, "users");
			const usersSnapshot = await getDocs(usersRef);

			for (const userDoc of usersSnapshot.docs) {
				const userMessageDataRef = collection(userDoc.ref, "messages/AnimeX/data");
				const userMessageRef = doc(userDoc.ref, "messages/AnimeX");
				const getUserMessageDoc = await getDoc(userMessageRef);

				const data = {
					checked: false,
					message: messTxt,
					sender: false,
					timestamp: serverTimestamp(),
				};

				try {
					getUserMessageDoc.exists()
						? await updateDoc(userMessageRef, { lastUpdate: serverTimestamp() })
						: await setDoc(userMessageRef, { lastUpdate: serverTimestamp() });

					await addDoc(userMessageDataRef, data);
				} catch (error) {
					popError(`${userDoc.data().name}: ${error}`);
				}
			}
			await addDoc(collection(db, "adminsAction"), {
				type: "anonce",
				adminId: user.uid,
				message: messTxt,
				timestamp: serverTimestamp(),
			});

			setMessTxt("");
			setIsVisibleMassMailing(false);
			seLoading(false);
			popSuccess("Success!");
		} else {
			setValidTxt(false);
		}
	};

	return (
		<>
			{ctxMessage}
			{isVisibleMassMailing && (
				<ModalWrapper onClickHandler={() => setIsVisibleMassMailing(false)}>
					{loading && <Loading />}
					<div className={classes.wrapper}>
						<h6>Mass mailing</h6>
						{!validTxt && <p className={classes.notValid}>Min message lenght {MIN_MESS_LENGHT}</p>}
						<TextAreaForm
							minRows={1}
							maxRows={10}
							text={messTxt}
							setText={setMessTxt}
							placeholder="Your message..."
							onSubmitHandler={onSubmitMassMailing}
						/>
						<CloseModal
							className={classes.closeBtn}
							onClickHandler={() => setIsVisibleMassMailing(false)}
						/>
					</div>
				</ModalWrapper>
			)}
		</>
	);
};

export default MassMailing;
