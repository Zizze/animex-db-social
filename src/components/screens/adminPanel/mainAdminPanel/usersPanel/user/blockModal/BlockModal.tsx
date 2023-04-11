import DatePick from "@Components/UI/datePick/DatePick";
import ModalWrapper from "@Components/UI/modal/ModalWrapper";
import { addDoc, doc, serverTimestamp, Timestamp, updateDoc, collection } from "firebase/firestore";
import React, { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import classes from "./BlockModal.module.scss";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { useTextField } from "@/hooks/useTextField";
import { db } from "@Project/firebase";
import { useAuthContext } from "../../../../../../../context/useAuthContext";
import { popMessage } from "@/utils/popMessage/popMessage";
import { blockUser } from "@/services/firebase/blockUser";

interface IProps {
	visibleBlockModal: boolean;
	setVisibleBlockModal: Dispatch<SetStateAction<boolean>>;
	currUserId: string;
}

const BlockModal: FC<IProps> = ({ setVisibleBlockModal, currUserId, visibleBlockModal }) => {
	const [noSelectDate, setNoSelectDate] = useState<string | null>(null);
	const [date, setDate] = useState<Timestamp | null>(null);
	const { popSuccess, popError, ctxMessage } = popMessage();
	const { user } = useAuthContext();

	const {
		value: comment,
		setValue: setComment,
		onChange: commentOnChange,
		error: errorName,
	} = useTextField({ minLength: 10, allowWhitespace: true });

	const onSubmitHandler = async (e: FormEvent) => {
		e.preventDefault();
		if (!user) return;
		if (!date) return setNoSelectDate("No date selected!");
		const blockedUser = await blockUser({
			endBan: date,
			currUserId,
			message: comment,
			adminId: user.uid,
		});
		if (blockedUser) {
			popSuccess("User banned");

			setComment("");
			setVisibleBlockModal(false);
			setNoSelectDate(null);
			setDate(null);
		} else popError("Banned error");
	};

	return (
		<>
			{ctxMessage}
			{visibleBlockModal && (
				<ModalWrapper onClickHandler={() => setVisibleBlockModal(false)}>
					<form className={classes.blockForm} onSubmit={onSubmitHandler}>
						<h6 className={classes.titleBlock}>Ban user</h6>
						{noSelectDate && <p className={classes.notvalid}>{noSelectDate}</p>}
						<DatePick classnames={classes.datepick} getDate={(date: Timestamp) => setDate(date)} />
						{errorName && <p className={classes.notvalid}>{errorName}</p>}
						<ReactTextareaAutosize
							value={comment}
							onChange={commentOnChange}
							placeholder="A short description of what the user was banned for."
							maxRows={7}
							minRows={2}
						/>

						<div className={classes.btns}>
							<DefaultBtn
								type="submit"
								classMode="clear"
								title="Chanhe profile"
								disabled={comment.trim().length < 10}
							>
								Ok
							</DefaultBtn>
							<DefaultBtn
								classMode="clear"
								title="Chanhe profile"
								onClickHandler={() => setVisibleBlockModal(false)}
							>
								Close
							</DefaultBtn>
						</div>
					</form>
				</ModalWrapper>
			)}
		</>
	);
};

export default BlockModal;
