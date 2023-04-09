import CloseModal from "@Components/UI/btn/CloseModal";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import TextAreaForm from "@Components/UI/textareaForm/TextAreaForm";
import React, { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import classes from "./MassMailing.module.scss";

import Loading from "@Components/UI/loading/Loading";
import { popMessage } from "@/utils/popMessage/popMessage";

import { massMailing } from "@/services/firebase/massMailing";
import { useAuthContext } from "@/context/useAuthContext";

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

			try {
				await massMailing({ message: messTxt, adminId: user.uid });
				popSuccess("Success!");
				setMessTxt("");
				setIsVisibleMassMailing(false);
			} catch {
				popError("Error");
			} finally {
				seLoading(false);
			}
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
							maxRows={4}
							text={messTxt}
							setText={setMessTxt}
							placeholder="Your message..."
							onSubmitHandler={onSubmitMassMailing}
							classes={{ cnForm: classes.textareaForm, cnBtns: classes.textareaBtns }}
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
