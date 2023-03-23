import { FC, useState, useEffect } from "react";
import classes from "./Categories.module.scss";
import { useAuthContext } from "@/context/useAuthContext";
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	onSnapshot,
	query,
	QueryDocumentSnapshot,
	startAfter,
	Timestamp,
	where,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { IUserFirebase } from "@/types/types";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { dataCategories } from "../usersPanel.data";

const Categories: FC<{ categorySelected: string }> = ({ categorySelected }) => {
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuthContext();

	const [islastDataUser, setIslastDataUser] = useState<boolean>();
	const [lastVisibleUser, setLastVisibleUser] = useState<QueryDocumentSnapshot<DocumentData>>();
	const [reload, setReload] = useState(false);

	const [users, setUsers] = useState<IUserFirebase[]>([]);

	useEffect(() => {
		const activeCategory = usersFilter();
		if (!activeCategory || !user) return;

		const collectionRef = query(collection(db, `users`), activeCategory, limit(10));
		const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
			const lastVisibleUser = querySnapshot.docs[querySnapshot.docs.length - 1];
			const allAdmins: IUserFirebase[] = [];

			querySnapshot.forEach((doc) => {
				allAdmins.push(doc.data() as IUserFirebase);
			});

			setUsers(allAdmins);
			setLastVisibleUser(lastVisibleUser);
			setIslastDataUser(querySnapshot.size > 9);
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, [categorySelected, user, reload]);

	const loadMoreUsers = async () => {
		const activeCategory = usersFilter();
		if (!activeCategory || !user) return;

		const moreData = query(
			collection(db, `users`),
			activeCategory,
			startAfter(lastVisibleUser),
			limit(10)
		);

		const getMoreDocs = await getDocs(moreData);
		const moreAdmins = getMoreDocs.docs.map((doc) => doc.data() as IUserFirebase);

		setUsers((prev) => [...prev, ...moreAdmins]);
		setLastVisibleUser(getMoreDocs.docs[getMoreDocs.docs.length - 1]);
		setIslastDataUser(getMoreDocs.size > 9);
		setIsLoading(false);
	};

	function usersFilter() {
		const usersBanned = where("blocked.endBan", ">", Timestamp.now());
		const allUsers = where("id", "!=", user?.uid);
		const admins = where("access", ">", 0);
		const activeCategory =
			(categorySelected === dataCategories[0] && allUsers) ||
			(categorySelected === dataCategories[1] && admins) ||
			(categorySelected === dataCategories[2] && usersBanned);
		return activeCategory;
	}

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={classes.wrapper}>
					<ul className={classes.users}>
						{users.length > 0 ? (
							users.map((user) => {
								return <User currUser={user} key={user.id} />;
							})
						) : (
							<h5 className={classes.empty}>Banned list is empty.</h5>
						)}
					</ul>

					<div className={classes.btns}>
						{islastDataUser && (
							<DefaultBtn onClickHandler={loadMoreUsers} classMode="clear">
								More
							</DefaultBtn>
						)}
						{users.length > 10 && (
							<DefaultBtn onClickHandler={() => setReload((prev) => !prev)} classMode="clear">
								Hide
							</DefaultBtn>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default Categories;
