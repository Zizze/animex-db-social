import { FC, useEffect, useState } from "react";
import cn from "classnames";
import classes from "./Message.module.scss";
import { IMessageFirebase } from "@/types/types";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@Project/firebase";
import Image from "next/image";
import { RiDownloadCloudFill, RiFile2Line, RiMovieLine, RiFileMusicLine } from "react-icons/ri";
import Link from "next/link";

interface IFilesPlusUrls {
	id: string;
	name: string;
	type: string;
	url: string;
}

const Message: FC<{ messageObj: IMessageFirebase }> = ({ messageObj }) => {
	const { message, sender, files } = messageObj;
	const [filesPlusUrls, setFilesPlusUrls] = useState<IFilesPlusUrls[] | null>(null);

	useEffect(() => {
		if ((files && !files.length) || !files) return;
		const promises = files.map(async (file) => {
			const pathReference = ref(storage, `files/${file.id}`);
			return getDownloadURL(pathReference).then((url) => ({
				...file,
				url: url,
			}));
		});

		Promise.all(promises)
			.then((filesUrls) => setFilesPlusUrls(filesUrls))
			.catch((error) => {
				// Handle any errors
			});
	}, []);

	return (
		<li className={cn(classes.message, sender && classes.currUser)}>
			{filesPlusUrls && (
				<ul className={classes.imagesList}>
					{filesPlusUrls.map((file) => {
						if (file.type.includes("image")) {
							return (
								<li>
									<Image src={file.url} width={100} height={100} alt="" />
								</li>
							);
						}
					})}
				</ul>
			)}

			<p>{message}</p>

			{filesPlusUrls && (
				<ul className={classes.files}>
					{filesPlusUrls.map((file) => {
						if (!file.type.includes("image")) {
							return (
								<li>
									{file.type.includes("video") ? (
										<RiMovieLine />
									) : file.type.includes("audio") ? (
										<RiFileMusicLine />
									) : (
										<RiFile2Line />
									)}
									<span>{file.name}</span>
									<Link className={classes.downloadLink} download target="_blank" href={file.url}>
										<RiDownloadCloudFill />
									</Link>
								</li>
							);
						}
					})}
				</ul>
			)}
		</li>
	);
};

export default Message;
