import Layout from "@Components/layout/Layout";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { FC, useState, useEffect } from "react";
import classes from "./Friends.module.scss";
import { FiSearch } from "react-icons/fi";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { useAuthContext } from "@/context/useAuthContext";
import { collection, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore";
import { db } from "@Project/firebase";
import { IUserFirebase } from "@/types/types";
import Requests from "./requests/Requests";
import { useOutside } from "@/hooks/useOutside";
import Loading from "@Components/UI/loading/Loading";
import FriendsCategory from "./categories/FriendsCategory";

import User from "./user/User";
import { dataCategories } from "./friends.data";
import AllUsers from "./categories/AllUsers";

const Friends: FC = () => {
	const { isShow, setIsShow } = useOutside(false);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const [searchText, setSearchText] = useState("");
	const [countRequests, setCountRequests] = useState<number>();
	const [nameCategory, setNameCategory] = useState(dataCategories[0]);
	const [users, setUsers] = useState<IUserFirebase[]>([]);

	const onChangeCategory = (categoryName: string) => {
		setNameCategory(categoryName);
	};

	const openModal = () => {
		setIsShow(true);
	};

	useEffect(() => {
		if (!user) return;
		const q = query(collection(db, `users/${user.uid}/friends`), where("confirmator", "==", true));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			setCountRequests(querySnapshot.docs.length);
		});
	}, [user]);

	const onSearchUser = () => {
		if (!user) return;
		if (searchText.length < 3) return;
		setIsLoading(true);

		const q = query(
			collection(db, "users"),
			where("name_lowercase", ">=", searchText.toLowerCase()),
			where("name_lowercase", "<=", searchText.toLowerCase() + "\uf8ff"),
			orderBy("name_lowercase"),
			startAt(searchText.toLowerCase()),
			endAt(searchText.toLowerCase() + "\uf8ff")
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const searchData: IUserFirebase[] = [];
			querySnapshot.forEach((doc) => {
				if (doc.id === user.uid) return;
				searchData.push(doc.data() as IUserFirebase);
			});

			setUsers(searchData);
			setNameCategory("search");
			setIsLoading(false);
		});

		return () => {
			unsubscribe();
		};
	};

	return (
		<Layout>
			<div className={classes.wrapper}>
				<div className={classes.header}>
					<div className={classes.search}>
						<input
							type="text"
							placeholder="Enter user name..."
							onChange={(e) => setSearchText(e.target.value)}
							value={searchText}
						/>
						<DefaultBtn onClickHandler={onSearchUser}>
							<FiSearch />
						</DefaultBtn>
					</div>
					<div className={classes.requests}>
						<DefaultBtn
							classMode="main-simple"
							onClickHandler={openModal}
							disabled={countRequests === 0}
						>
							Requests{countRequests !== 0 && <span>{countRequests}</span>}
						</DefaultBtn>
					</div>
				</div>
				<div className={classes.main}>
					<div className={classes.categories}>
						{dataCategories.map((item) => {
							return (
								<CategoryBtn
									isActive={nameCategory === item}
									onClickHandler={() => onChangeCategory(item)}
									key={item}
								>
									{item}
								</CategoryBtn>
							);
						})}
					</div>

					{nameCategory === dataCategories[0] && <FriendsCategory nameCategory={nameCategory} />}
					{nameCategory === dataCategories[1] && <AllUsers />}
					{nameCategory === "search" &&
						!isLoading &&
						users.map((user) => {
							return <User currUser={user} />;
						})}

					{users.length === 0 && nameCategory === "search" && (
						<h5 className={classes.emptySearch}>There are no such users.</h5>
					)}
				</div>
				<Requests setIsShow={setIsShow} isShow={isShow} />
			</div>
		</Layout>
	);
};

export default Friends;
