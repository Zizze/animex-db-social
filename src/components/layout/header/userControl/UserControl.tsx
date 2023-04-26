import React, { Dispatch, FC, SetStateAction } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import classes from "./UserControl.module.scss";
import Image from "next/image";
import { menuItems } from "./menuItems.data";
import MenuItem from "./menuItem/MenuItem";
import defaultImage from "@Public/testava.jpg";
import { useAuthContext } from "@/context/useAuthContext";
import MiniModal from "@Components/UI/miniModal/MiniModal";
import { useOutside } from "@/hooks/useOutside";
import Link from "next/link";

interface IProps {
	setActiveSetings: Dispatch<SetStateAction<boolean>>;
}

const UserControl: FC<IProps> = ({ setActiveSetings }) => {
	const { isShow, setIsShow, ref } = useOutside(false);
	const { user, userStorage } = useAuthContext();

	return (
		<>
			{user ? (
				<div ref={ref} className={classes.userControl}>
					<button className={classes.btn} onClick={() => setIsShow((prev) => !prev)}>
						<div className={classes.ava}>
							<Image
								src={user?.photoURL || defaultImage}
								alt="user avatar"
								width={100}
								height={100}
							/>
						</div>
						<RiArrowDropDownLine />
					</button>

					<MiniModal isShow={isShow} addClass={classes.modal}>
						{menuItems.map((item) => {
							if (item.name === menuItems[1].name && !userStorage?.access) return;
							return (
								<MenuItem
									item={item}
									key={item.name}
									setActiveSetings={setActiveSetings}
									setIsShowModal={setIsShow}
								/>
							);
						})}
					</MiniModal>
				</div>
			) : (
				<Link href="/auth/signin" className={classes.signin}>
					Sign In
				</Link>
			)}
		</>
	);
};

export default UserControl;
