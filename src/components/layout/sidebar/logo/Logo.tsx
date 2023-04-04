import React, { FC } from "react";
import mainLogo from "@Public/mainlogo.svg";
import Image from "next/image";
import classes from "./Logo.module.scss";

const Logo: FC = () => {
	return (
		<div className={classes["logo-block"]}>
			<Image src={mainLogo} alt="AnimeX logo" width={30} height={30} />
			<span>AnimeX</span>
		</div>
	);
};

export default Logo;
