import { useAuthContext } from "@/context/useAuthContext";
import Link from "next/link";
import React, { Dispatch, FC, MouseEvent, SetStateAction } from "react";
import { IUserMenu, userMenu } from "../userMenu.data";
import classes from "./UserMenu.module.scss";
import { signOut, getAuth } from "firebase/auth";

interface IProps {
	item: IUserMenu;
	setIsShowModal: Dispatch<SetStateAction<boolean>>;
	setActiveSetings: Dispatch<SetStateAction<boolean>>;
}

const UserMenu: FC<IProps> = ({ item, setActiveSetings, setIsShowModal }) => {
	const { user } = useAuthContext();
	const auth = getAuth();

	const onClickHandler = (e: MouseEvent) => {
		e.stopPropagation();
		switch (item.name) {
			case "Logout":
				signOut(auth);
				setIsShowModal(false);
				return;
			case "Settings":
				setActiveSetings(true);
				setIsShowModal(false);
				return;
		}
	};

	return (
		<li>
			{item.href ? (
				<Link
					href={item.name === userMenu[0].name ? `${item.href}/${user?.displayName}` : item.href}
				>
					{item.name}
				</Link>
			) : (
				<button onClick={(e) => onClickHandler(e)}>{item.name}</button>
			)}
		</li>
	);
};

export default UserMenu;
