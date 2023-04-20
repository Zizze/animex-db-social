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

	const onlyImageFiles = filesPlusUrls?.filter((file) => file.type.includes("image"));

	return (
		<li className={cn(classes.message, sender && classes.currUser)}>
			{onlyImageFiles && onlyImageFiles.length > 0 && (
				<div className={classes.images}>
					<Link href={onlyImageFiles[0].url} target="_blank" download>
						<Image
							className={classes.firstImage}
							src={onlyImageFiles[0].url}
							width={300}
							height={300}
							alt=""
						/>
					</Link>

					{onlyImageFiles.length > 1 && (
						<ul className={classes.imagesList}>
							{onlyImageFiles.slice(1).map((file) => {
								if (file.type.includes("image")) {
									return (
										<li>
											<Link href={file.url} target="_blank" download>
												<Image src={file.url} width={300} height={300} alt="" />
											</Link>
										</li>
									);
								}
							})}
						</ul>
					)}
				</div>
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
