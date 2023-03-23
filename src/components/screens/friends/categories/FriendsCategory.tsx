import { FC, useState, useEffect } from "react";
import classes from "./FriendsCategory.module.scss";
import { useAuthContext } from "@/context/useAuthContext";
import {
	collection,
	doc,
	DocumentData,
	getDoc,
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
import DefaultBtn from "@Components/UI/btn/DefaultBtn";

const FriendsCategory: FC<{ nameCategory: string }> = ({ nameCategory }) => {
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuthContext();

	const [islastDataUser, setIslastDataUser] = useState<boolean>();
	const [lastVisibleUser, setLastVisibleUser] = useState<QueryDocumentSnapshot<DocumentData>>();

	const [users, setUsers] = useState<IUserFirebase[]>([]);

	useEffect(() => {
		if (user) {
			const q = query(
				collection(db, `users/${user.uid}/friends`),
				where("friend", "==", true),
				limit(10)
			);

			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const lastVisibleUser = querySnapshot.docs[querySnapshot.docs.length - 1];
				const allFriendsData: IUserFirebase[] = [];

				querySnapshot.forEach((docс) => {
					const unsub = onSnapshot(doc(db, `users`, `${docс.id}`), (doc) => {
						allFriendsData.push(doc.data() as IUserFirebase);
						setUsers(allFriendsData);
					});
				});

				setLastVisibleUser(lastVisibleUser);
				setIslastDataUser(querySnapshot.docs.length > 9);
			});
			setIsLoading(false);
		}
	}, [user]);

	const onClickMore = async () => {
		if (user) {
			const moreData = query(
				collection(db, `users/${user.uid}/friends`),
				where("friend", "==", true),
				startAfter(lastVisibleUser),
				limit(10)
			);
			const querySnapshot = await getDocs(moreData);
			const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

			const dataUsers: IUserFirebase[] = [];
			querySnapshot.docs.forEach(async (friend) => {
				const friendRef = doc(db, "users", friend.id);
				const friendSnap = await getDoc(friendRef);

				dataUsers.push(friendSnap.data() as IUserFirebase);

				setUsers((prev) => [...prev, ...dataUsers]);
			});

			setIslastDataUser(dataUsers.length > 9);
			setLastVisibleUser(lastVisible);
			// setIsLoading(false);
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
								return <User currUser={user} key={user.id} nameCategory={nameCategory} />;
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

export default FriendsCategory;
