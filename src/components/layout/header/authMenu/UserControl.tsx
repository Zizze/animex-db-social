import React, { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import classes from "./UserControl.module.scss";
import Image from "next/image";
import { userMenu } from "./userMenu.data";
import UserMenu from "./userMenu/UserMenu";
import defaultImage from "@Public/testava.jpg";
import Link from "next/link";
import { useAuthContext } from "@/context/useAuthContext";
import MiniModal from "@Components/UI/miniModal/MiniModal";
import { useOutside } from "@/hooks/useOutside";

interface IProps {
	setActiveSetings: Dispatch<SetStateAction<boolean>>;
}

const UserControl: FC<IProps> = ({ setActiveSetings }) => {
	const { isShow, setIsShow, ref } = useOutside(false);
	const { user } = useAuthContext();

	if (!user)
		return (
			<Link className={classes.singin} href="/auth/signin">
				Sign In
			</Link>
		);

	return (
		<div ref={ref} className={classes.userControl}>
			<button className={classes.btn} onClick={() => setIsShow((prev) => !prev)}>
				<div className={classes.ava}>
					<Image src={user.photoURL || defaultImage} alt="user avatar" width={100} height={100} />
				</div>
				<RiArrowDropDownLine />
			</button>

			<MiniModal isShow={isShow} addClass={classes.modal}>
				{userMenu.map((item) => {
					return (
						<UserMenu
							item={item}
							key={item.name}
							setActiveSetings={setActiveSetings}
							setIsShowModal={setIsShow}
						/>
					);
				})}
			</MiniModal>
		</div>
	);
};

export default UserControl;
