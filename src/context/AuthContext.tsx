import { IUserFirebase } from "@/types/types";
import { db } from "@Project/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Cookies from "js-cookie";
import isEqual from "lodash.isequal";
import sortBy from "lodash.sortby";
import { useRouter } from "next/router";
import {
	createContext,
	FC,
	ReactNode,
	useState,
	SetStateAction,
	Dispatch,
	useEffect,
	useMemo,
} from "react";

interface IContext {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	userStorage: IUserFirebase | null;
}

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [userStorage, setUserStorage] = useState<IUserFirebase | null>(null);
	const router = useRouter();
	const getUserCookies = Cookies.get("userDB");

	useEffect(() => {
		if (user) {
			const userRef = doc(db, `users/${user.uid}`);
			const unsub = onSnapshot(userRef, (doc) => {
				const cookieData = getUserCookies && JSON.parse(decodeURIComponent(getUserCookies));
				const userData = doc.data() as IUserFirebase;

				if (getUserCookies && !isEqual(sortBy(userData), sortBy(cookieData))) {
					Cookies.set("userDB", encodeURIComponent(JSON.stringify(doc.data())));
				}
				setUserStorage(userData);
			});

			return () => unsub();
		} else {
			userStorage && setUserStorage(null);
			getUserCookies && Cookies.remove("userDB");
		}
	}, [user]);

	useEffect(() => {
		const auth = getAuth();
		const unListen = onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				router.push("/");
				setUser(null);
			}
		});
		return () => {
			unListen();
		};
	}, []);

	const values = useMemo(
		() => ({
			user,
			setUser,
			userStorage,
		}),
		[user, userStorage]
	);

	return (
		<AuthContext.Provider
			value={{ user: values.user, setUser: values.setUser, userStorage: values.userStorage }}
		>
			{children}
		</AuthContext.Provider>
	);
};
