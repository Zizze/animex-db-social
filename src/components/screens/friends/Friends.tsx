import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { FC, useState, useRef, FormEvent } from "react";
import classes from "./Friends.module.scss";
import { FiSearch } from "react-icons/fi";
import CategoryBtn from "@Components/UI/btn/CategoryBtn";
import { useAuthContext } from "@/context/useAuthContext";
import { IUserFirebase } from "@/types/types";
import Requests from "./requests/Requests";
import { useOutside } from "@/hooks/useOutside";
import Loading from "@Components/UI/loading/Loading";
import FriendsCategory from "./categories/FriendsCategory";

import User from "./user/User";
import { dataCategories } from "./friends.data";
import AllUsers from "./categories/AllUsers";
import { useCollectionSize } from "@/hooks/firebase/useCollectionSize";
import { searchUsers } from "@/services/firebase/searchUsers";
import { enterClick } from "@/utils/enterClick";
import { useTextField } from "@/hooks/useTextField";

const Friends: FC = () => {
	const searchRef = useRef<HTMLFormElement>(null);
	const { isShow, setIsShow } = useOutside(false);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	const {
		value: searchText,
		onChange,
		error,
	} = useTextField({
		maxLength: 10,
		minLength: 3,
		numLettOnly: true,
	});

	const [nameCategory, setNameCategory] = useState(dataCategories[0]);
	const [users, setUsers] = useState<IUserFirebase[]>([]);

	const countRequests = useCollectionSize(`users/${user?.uid}/friends`, false, {
		where: [["confirmator", "==", true]],
	});

	const onSearchUser = (e?: FormEvent) => {
		e?.preventDefault();
		if (!user || error !== "") return;
		setIsLoading(true);

		const setStates = (searchData: IUserFirebase[]) => {
			setUsers(searchData);
			setNameCategory("search");
		};

		searchUsers(searchText, setStates, user.uid);
		setIsLoading(false);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<form ref={searchRef} onSubmit={onSearchUser} className={classes.search}>
					<input
						type="text"
						placeholder="Enter user name..."
						onChange={onChange}
						value={searchText}
					/>
					<DefaultBtn
						type="submit"
						onKeyDown={(event) => enterClick(event, { ref: searchRef, func: onSearchUser })}
					>
						<FiSearch />
					</DefaultBtn>
				</form>
				<div className={classes.requests}>
					<DefaultBtn
						classMode="main-simple"
						onClickHandler={() => setIsShow(true)}
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
								onClickHandler={() => setNameCategory(item)}
								key={item}
							>
								{item}
							</CategoryBtn>
						);
					})}
				</div>

				{nameCategory === dataCategories[0] && <FriendsCategory nameCategory={nameCategory} />}
				{nameCategory === dataCategories[1] && <AllUsers />}
				{nameCategory === "search" && (
					<ul>
						{!isLoading ? (
							users.map((user) => {
								return <User currUser={user} />;
							})
						) : (
							<Loading />
						)}
					</ul>
				)}

				{users.length === 0 && nameCategory === "search" && (
					<h5 className={classes.emptySearch}>There are no such users.</h5>
				)}
			</div>
			<Requests setIsShow={setIsShow} isShow={isShow} />
		</div>
	);
};

export default Friends;
