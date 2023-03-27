import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { FC, useState, useRef, FormEvent } from "react";
import classes from "./UsersPanel.module.scss";
import { FiSearch } from "react-icons/fi";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";

import Loading from "@Components/UI/loading/Loading";

import User from "./user/User";
import { dataCategories } from "./usersPanel.data";
import AddAccount from "./addAccount/AddAccount";
import Categories from "./categories/Categories";
import { searchUsers } from "@/services/firebase/searchUsers";
import { enterClick } from "@/utils/enterClick";

const UsersPanel: FC = () => {
	const searchRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const [searchText, setSearchText] = useState("");

	const [nameCategory, setNameCategory] = useState(dataCategories[0]);
	const [users, setUsers] = useState<IUserFirebase[]>([]);

	const [isActiveModal, setIsActiveModal] = useState(false);

	const onSearchUser = (e: FormEvent) => {
		e.preventDefault();
		if (!user || `${searchText}`.length < 3) return;
		setIsLoading(true);

		const setStates = (searchData: IUserFirebase[]) => {
			setUsers(searchData);
			setNameCategory("search");
			setIsLoading(false);
		};
		searchUsers(`${searchText}`, setStates, user.uid);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<form ref={searchRef} onSubmit={onSearchUser} className={classes.search}>
					<input
						type="text"
						placeholder="Enter user name..."
						onChange={(e) => setSearchText(e.target.value)}
						value={searchText}
					/>
					<DefaultBtn onKeyDown={(e) => enterClick(e, { ref: searchRef })}>
						<FiSearch />
					</DefaultBtn>
				</form>
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
								onClickHandler={() => setNameCategory(item)}
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
						return <User key={user.name_lowercase} currUser={user} />;
					})
				) : (
					<Categories categorySelected={nameCategory} />
				)}

				{!users.length && nameCategory === "search" && (
					<h5 className={classes.emptySearch}>There are no such users.</h5>
				)}
			</div>
			{isActiveModal && <AddAccount setIsActiveModal={setIsActiveModal} />}
		</div>
	);
};

export default UsersPanel;
