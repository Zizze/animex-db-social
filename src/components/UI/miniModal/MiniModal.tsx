import { FC, ReactNode } from "react";
import classes from "./MiniModal.module.scss";
import cn from "classnames";

interface IProps {
	children: ReactNode;
	addClass: string;
	isShow: boolean;
}

const MiniModal: FC<IProps> = ({ children, isShow, addClass }) => {
	const classnames = cn(isShow ? classes.userMenu : classes.userMenuClose, addClass);
	return <ul className={classnames}>{children}</ul>;
};

export default MiniModal;
