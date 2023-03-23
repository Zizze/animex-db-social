import React, { FC } from "react";
import { MdCloseFullscreen } from "react-icons/md";
import classes from "./CloseModal.module.scss";

interface IProps {
	onClickHandler: () => void;
	className?: string;
}

const CloseModal: FC<IProps> = ({ onClickHandler, className = "" }) => {
	return (
		<button
			title="Close modal"
			className={`${classes.closeBtn} ${className}`}
			onClick={onClickHandler}
		>
			<MdCloseFullscreen className={classes.closeIco} />
		</button>
	);
};

export default CloseModal;
