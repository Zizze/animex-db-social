import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import classes from "./ChatUserList.module.scss";
import cn from "classnames";
import { MdClose } from "react-icons/md";
import { db } from "@Project/firebase";
import {
	collection,
	doc,
	DocumentData,
	endAt,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
	startAt,
	where,
} from "firebase/firestore";
import { IUserFirebase } from "@/types/types";
import User from "./user/User";
import { useAuthContext } from "@/context/useAuthContext";
import useDebounce from "@/hooks/useDebounce";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import { TfiMoreAlt } from "react-icons/tfi";

interface IProps {
	setSelectedUser: Dispatch<SetStateAction<string>>;
	selectedUser: string;
}

const ChatUserList: FC<IProps> = ({ setSelectedUser, selectedUser }) => {
	const { user } = useAuthContext();
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState<IUserFirebase[]>([]);
	const debounceSearch = useDebounce(search, 1000);
	const [userContextMenu, setUserContextMenu] = useState("");

	const [lastVisibleUser, setLastVisibleUser] = useState<QueryDocumentSnapshot<DocumentData>>();
	const [isLastData, setIsLastData] = useState<boolean>();

	useEffect(() => {
		if (!user || debounceSearch.length > 2) return;

		const getUsers = async () => {
			try {
				const q = query(
					collection(db, `users/${user.uid}/messages`),
					orderBy("lastUpdate", "desc"),
					limit(10)
				);
				const querySnapshot = await getDocs(q);
				setLastVisibleUser(querySnapshot.docs[querySnapshot.docs.length - 1]);
				const dataUser: IUserFirebase[] = [];

				for (const mess of querySnapshot.docs) {
					const userRef = doc(db, `users/${mess.id}`);
					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						dataUser.push(userSnap.data() as IUserFirebase);
					}
				}
				setUsers(dataUser);
				setIsLastData(dataUser.length > 9);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		getUsers();
	}, [user, debounceSearch, userContextMenu]);

	useEffect(() => {
		if (debounceSearch.length < 3) return;
		const getSearchUsers = async () => {
			const q = query(
				collection(db, "users"),
				where("name_lowercase", ">=", search.toLowerCase()),
				where("name_lowercase", "<=", search.toLowerCase() + "\uf8ff"),
				orderBy("name_lowercase"),
				startAt(search.toLowerCase()),
				endAt(search.toLowerCase() + "\uf8ff"),
				limit(9)
			);

			const querySnapshot = await getDocs(q);
			const dataUser: IUserFirebase[] = [];
			querySnapshot.forEach((doc) => {
				if (doc.id === user?.uid) return;
				dataUser.push(doc.data() as IUserFirebase);
			});
			setUsers(dataUser);
		};
		getSearchUsers();
	}, [debounceSearch]);

	const onClearSearch = () => {
		setSearch("");
		setSelectedUser("");
	};

	const onLoadMore = async () => {
		if (!user) return;
		// setIsLoading(true);

		try {
			const moreData = query(
				collection(db, `users/${user.uid}/messages`),
				orderBy("lastUpdate", "desc"),
				startAfter(lastVisibleUser),
				limit(10)
			);
			const querySnapshot = await getDocs(moreData);
			setLastVisibleUser(querySnapshot.docs[querySnapshot.docs.length - 1]);

			const dataUser: IUserFirebase[] = [];

			for (const mess of querySnapshot.docs) {
				const userRef = doc(db, `users/${mess.id}`);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					dataUser.push(userSnap.data() as IUserFirebase);
				}
			}
			setUsers((prev) => [...prev, ...dataUser]);
			setIsLastData(dataUser.length > 9);
		} catch (error) {
			console.error("Error fetching users:", error);
		}

		// setIsLoading(false);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.search}>
				<input
					type="text"
					placeholder="Enter user"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
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
				{users.map((user) => {
					return (
						<User
							user={user}
							setSelectedUser={setSelectedUser}
							key={user.id}
							selectedUser={selectedUser}
							setUserContextMenu={setUserContextMenu}
							userContextMenu={userContextMenu}
						/>
					);
				})}
				{isLastData && (
					<DefaultBtn
						classMode="clear"
						className={classes.btnMore}
						title="Load more"
						onClickHandler={onLoadMore}
					>
						<TfiMoreAlt className={classes.svg} />
					</DefaultBtn>
				)}
			</ul>
		</div>
	);
};

export default ChatUserList;
