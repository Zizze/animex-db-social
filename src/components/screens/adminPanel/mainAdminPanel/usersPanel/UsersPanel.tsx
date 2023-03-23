import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { FC, useState } from "react";
import classes from "./UsersPanel.module.scss";
import { FiSearch } from "react-icons/fi";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { useAuthContext } from "@/context/useAuthContext";
import { collection, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore";
import { db } from "@Project/firebase";
import { IUserFirebase } from "@/types/types";

import Loading from "@Components/UI/loading/Loading";

import User from "./user/User";
import { dataCategories } from "./usersPanel.data";
import AddAccount from "./addAccount/AddAccount";
import Categories from "./categories/Categories";

const UsersPanel: FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const [searchText, setSearchText] = useState("");
	const [nameCategory, setNameCategory] = useState(dataCategories[0]);
	const [users, setUsers] = useState<IUserFirebase[]>([]);

	const [isActiveModal, setIsActiveModal] = useState(false);

	const onChangeCategory = (categoryName: string) => {
		setNameCategory(categoryName);
	};

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
					<DefaultBtn classMode="main-simple" onClickHandler={() => setIsActiveModal(true)}>
						Add account
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

				{nameCategory === "search" ? (
					!isLoading &&
					users.map((user) => {
						return <User currUser={user} />;
					})
				) : (
					<Categories categorySelected={nameCategory} />
				)}

				{users.length === 0 && nameCategory === "search" && (
					<h5 className={classes.emptySearch}>There are no such users.</h5>
				)}
			</div>
			{isActiveModal && <AddAccount setIsActiveModal={setIsActiveModal} />}
		</div>
	);
};

export default UsersPanel;
