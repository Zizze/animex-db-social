import React, { FC, useEffect, useState } from "react";
import stopImage from "@Public/stop.png";
import Image from "next/image";
import classes from "./NoRights.module.scss";
import { useRouter } from "next/router";
import Meta from "@Components/seo/Meta";

const REDIRECT_TIME = 10;

const NoRights: FC = () => {
	const router = useRouter();
	const [seconds, setSeconds] = useState(REDIRECT_TIME);

	useEffect(() => {
		if (!!seconds) {
			const time = setTimeout(() => {
				setSeconds((prev) => prev - 1);
			}, 1000);

			return () => clearTimeout(time);
		} else {
			router.push("/");
		}
	}, [seconds]);

	return (
		<>
			<Meta title="No rights" />
			<div className={classes.wrapper}>
				<div className={classes.container}>
					<h4>You do not have sufficient rights to visit this page.</h4>
					<Image src={stopImage} width={500} height={500} priority alt="Error image" />
					<p>
						Redirect to home page after <span>{seconds}</span> seconds.
					</p>
				</div>
			</div>
		</>
	);
};

export default NoRights;
