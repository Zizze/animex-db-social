import React, { FC, useEffect, useState } from "react";
import errorImage from "@Public/error.png";
import Image from "next/image";
import classes from "./Error404.module.scss";
import { useRouter } from "next/router";
import Meta from "@Components/seo/Meta";

const REDIRECT_TIME = 10;

const Error404: FC = () => {
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
			<Meta title="Error" />
			<div className={classes.wrapper}>
				<div className={classes.container}>
					<h4>Error! Page not found, please try again.</h4>
					<Image src={errorImage} width={500} height={500} priority alt="Error image" />
					<p>
						Redirect to homepage after <span>{seconds}</span> seconds.
					</p>
				</div>
			</div>
		</>
	);
};

export default Error404;
