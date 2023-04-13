import { Dispatch, FC, SetStateAction, useEffect, useState, useMemo } from "react";
import classes from "./Users.module.scss";
import cn from "classnames";
import { MdClose } from "react-icons/md";
import { Timestamp } from "firebase/firestore";
import { IUserFirebase } from "@/types/types";
import User from "./user/User";
import { useAuthContext } from "@/context/useAuthContext";
import useDebounce from "@/hooks/useDebounce";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { TfiMoreAlt } from "react-icons/tfi";
import { useCollectionRealtime } from "@/hooks/firebase/useCollectionRealtime";
import { searchUsers } from "@/services/firebase/searchUsers";
import Loading from "@Components/UI/loading/Loading";
import { useTextField } from "@/hooks/useTextField";

interface IProps {
	setSelectedUser: Dispatch<SetStateAction<string>>;
	selectedUser: string;
}

const USERS_LIMIT = 10;

const Users: FC<IProps> = ({ setSelectedUser, selectedUser }) => {
	const { user } = useAuthContext();
	const [searchUsersData, setSearchUsersData] = useState<IUserFirebase[] | null>(null);
	const [userContextMenu, setUserContextMenu] = useState("");

	const {
		value: search,
		setValue: setSearch,
		error: searchErr,
		onChange: onChangeSearch,
	} = useTextField({
		maxLength: 10,
		minLength: 3,
		numLettOnly: true,
	});
	const debounceSearch = useDebounce(search, 500);

	const {
		data: users,
		isLastDocs,
		loadMoreData,
		isLoading,
		error,
	} = useCollectionRealtime<{ id: string; lastUpdate: Timestamp }>(`users/${user?.uid}/messages`, {
		orderBy: ["lastUpdate", "desc"],
		limit: USERS_LIMIT,
	});

	useEffect(() => {
		if (searchErr?.length || !user) return;
		const setStates = (usersData: IUserFirebase[]) => {
			setSearchUsersData(usersData);
		};
		searchUsers(search, setStates, user?.uid);
	}, [debounceSearch]);

	const onClearSearch = () => {
		setSearchUsersData(null);
		setSearch("");
		setSelectedUser("");
	};

	const finalUserData = useMemo(
		() => (!searchUsersData?.length || search.length < 3 ? users : searchUsersData),
		[search, searchUsersData, users]
	);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={cn(classes.wrapper, selectedUser.length && classes.none)}>
					<div className={classes.search}>
						<input type="text" placeholder="Enter user" value={search} onChange={onChangeSearch} />
						<span
							className={cn(classes.ico, search.length > 0 && classes.active)}
							onClick={onClearSearch}
						>
							<MdClose />
						</span>
					</div>
					<ul
						className={classes.usersList}
						style={{ overflow: userContextMenu !== "" ? "initial" : "auto" }}
					>
						{finalUserData?.map((user) => {
							return (
								<User
									userId={user.id}
									setSelectedUser={setSelectedUser}
									key={user.id}
									selectedUser={selectedUser}
									setUserContextMenu={setUserContextMenu}
									userContextMenu={userContextMenu}
								/>
							);
						})}
						{!isLastDocs && (
							<DefaultBtn
								classMode="clear"
								className={classes.btnMore}
								title="Load more"
								onClickHandler={loadMoreData}
							>
								<TfiMoreAlt className={classes.svg} />
							</DefaultBtn>
						)}
					</ul>
				</div>
			)}
		</>
	);
};

export default Users;
