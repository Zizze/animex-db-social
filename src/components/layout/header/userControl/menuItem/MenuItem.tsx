import { useAuthContext } from "@/context/useAuthContext";
import Link from "next/link";
import React, { Dispatch, FC, MouseEvent, SetStateAction } from "react";
import { IMenuItems, menuItems } from "../menuItems.data";
import classes from "./MenuItem.module.scss";
import { signOut, getAuth } from "firebase/auth";

interface IProps {
	item: IMenuItems;
	setIsShowModal: Dispatch<SetStateAction<boolean>>;
	setActiveSetings: Dispatch<SetStateAction<boolean>>;
}

const MenuItem: FC<IProps> = ({ item, setActiveSetings, setIsShowModal }) => {
	const { user, setUser } = useAuthContext();
	const auth = getAuth();

	const onClickHandler = (e: MouseEvent) => {
		e.stopPropagation();
		switch (item.name) {
			case "Logout":
				signOut(auth);
				setUser(null);
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
					href={item.name === menuItems[0].name ? `${item.href}/${user?.displayName}` : item.href}
				>
					{item.name}
				</Link>
			) : (
				<button onClick={(e) => onClickHandler(e)}>{item.name}</button>
			)}
		</li>
	);
};

export default MenuItem;
