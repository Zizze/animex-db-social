import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { FC, useState, useEffect } from "react";
import classes from "./AllUsers.module.scss";
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
	where,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { IUserFirebase } from "@/types/types";
import User from "../user/User";
import Loading from "@Components/UI/loading/Loading";

const AllUsers: FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuthContext();

	const [islastDataUser, setIslastDataUser] = useState<boolean>();
	const [lastVisibleUser, setLastVisibleUser] = useState<QueryDocumentSnapshot<DocumentData>>();

	const [users, setUsers] = useState<IUserFirebase[]>([]);

	useEffect(() => {
		if (user) {
			const q = query(collection(db, `users`), where("id", "!=", user.uid), limit(10));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const lastVisibleUser = querySnapshot.docs[querySnapshot.docs.length - 1];

				const allUsers: IUserFirebase[] = [];
				querySnapshot.forEach((doc) => {
					allUsers.push(doc.data() as IUserFirebase);
				});

				setUsers(allUsers);
				setLastVisibleUser(lastVisibleUser);
				setIslastDataUser(querySnapshot.docs.length > 9);
			});

			setIsLoading(false);
		}
	}, [user]);

	const onClickMore = async () => {
		if (user) {
			const moreData = query(collection(db, `users`), startAfter(lastVisibleUser), limit(10));
			const querySnapshot = await getDocs(moreData);
			const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

			const dataUsers = querySnapshot.docs.map((doc) => {
				return { ...(doc.data() as IUserFirebase) };
			});

			setUsers((prev) => [...prev, ...dataUsers]);
			setIslastDataUser(dataUsers.length > 9);
			setLastVisibleUser(lastVisible);
		}
	};

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
							<h5 className={classes.emptyFriend}>Friends list is empty.</h5>
						)}
					</ul>
					{islastDataUser && (
						<div className={classes.btns}>
							<DefaultBtn onClickHandler={onClickMore} classMode="clear">
								More
							</DefaultBtn>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default AllUsers;
