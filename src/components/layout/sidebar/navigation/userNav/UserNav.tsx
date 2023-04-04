import Link from "next/link";
import { FC, MouseEvent, useEffect, useState, useMemo } from "react";
import classes from "../Navigation.module.scss";
import { INavList } from "../navList.data";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import cn from "classnames";
import { changeHomeMode } from "@Store/animeJikan/animeJikanSlice";
import { useAuthContext } from "@/context/useAuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@Project/firebase";
import { IAnimeFirebase } from "@/types/types";
import { useCollectionSize } from "@/hooks/firebase/useCollectionSize";

interface IListProps {
	item: INavList;
	listName: string;
	animeFirebase?: IAnimeFirebase[];
}

const UserNav: FC<IListProps> = ({ item, listName }) => {
	const { user } = useAuthContext();
	const dispatch = useAppDispatch();
	const [animeFirebase, setAnimeFirebase] = useState<number>(0);
	const { href, name, img } = item;

	useEffect(() => {
		if (!user) return;
		const userListRef = query(
			collection(db, `users/${user.uid}/anime`),
			where("animeState", "==", name.toLowerCase())
		);
		const unsubscribe = onSnapshot(userListRef, (querySnapshot) => {
			setAnimeFirebase(querySnapshot.size);
		});
		return () => unsubscribe();
	}, [user]);

	const active = cn(classes.list, listName === name && "active-nav");
	return (
		<li className={`${active}`} key={name} onClick={() => dispatch(changeHomeMode(name))}>
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

export default UserNav;
