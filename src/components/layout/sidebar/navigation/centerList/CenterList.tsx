import Link from "next/link";
import { FC, MouseEvent, useEffect, useState } from "react";
import classes from "../Navigation.module.scss";
import { INavList } from "../List.data";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import cn from "classnames";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";
import { useAuthContext } from "@/context/useAuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@Project/firebase";
import { IAnimeFirebase } from "@/types/types";

interface IListProps {
	item: INavList;
	listName: string;
	animeFirebase?: IAnimeFirebase[];
}

const CenterList: FC<IListProps> = ({ item, listName }) => {
	const { user } = useAuthContext();
	const { href, name, img } = item;
	const dispatch = useAppDispatch();
	const active = cn(classes.list, listName === name && "active-nav");

	const [animeFirebase, setAnimeFirebase] = useState<number>(0);

	useEffect(() => {
		if (!user) return;

		const q = query(
			collection(db, `users/${user.uid}/anime`),
			where("animeState", "==", name.toLowerCase())
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			setAnimeFirebase(querySnapshot.docs.length);
		});

		return () => unsubscribe();
	}, [user]);

	const onClickHandler = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch(changeHomeMode(name));
	};

	return (
		<li className={`${active}`} key={name} onClick={(e) => onClickHandler(e)}>
			<Link href={href} className={classes.linkblock}>
				<div className={classes.linkInfo}>
					{img}
					<span className={classes.text}>{name}</span>
				</div>
				<span className={classes.counter}>{animeFirebase}</span>
			</Link>
		</li>
	);
};

export default CenterList;
