import { FC, PropsWithChildren } from "react";
import { IMeta } from "./meta.interface";
import Head from "next/head";
import mainLogo from "@Public/mainlogo.svg";
import { titleWithSiteName } from "@/utils/titleWithSiteName";

const Meta: FC<PropsWithChildren<IMeta>> = ({ title, description }) => {
	return (
		<Head>
			<title>{titleWithSiteName(title)}</title>

			{description ? (
				<>
					<meta property="og:title" content={titleWithSiteName(title)} />
					<meta name="description" content={description} />
					<meta property="og:description" content={description} />
					<meta property="og:image" content={mainLogo} />
				</>
			) : (
				<meta name="robots" content={"noindex"} />
			)}
		</Head>
	);
};

export default Meta;
