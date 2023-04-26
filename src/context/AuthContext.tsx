import { IUserFirebase } from "@/types/types";
import { db } from "@Project/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Cookies from "js-cookie";
import isEqual from "lodash.isequal";
import sortBy from "lodash.sortby";
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
	const getUserCookies = Cookies.get("userDB");

	useEffect(() => {
		if (!user) return;

		const userRef = doc(db, `users/${user.uid}`);
		const unsub = onSnapshot(userRef, (doc) => {
			const cookieData = getUserCookies && JSON.parse(decodeURIComponent(getUserCookies));
			const userData = doc.data() as IUserFirebase;
			const dataForCookie = JSON.stringify({
				name: user.displayName,
				access: userData.access || 0,
				blocked: { endBan: userData.blocked?.endBan } || null,
			});

			const date = new Date();
			date.setMonth(date.getMonth() + 1);

			if (!getUserCookies || !isEqual(sortBy(userData), sortBy(cookieData))) {
				Cookies.set("userDB", encodeURIComponent(dataForCookie), { expires: date });
			}

			setUserStorage(userData);
		});

		return () => unsub();
	}, [user]);

	useEffect(() => {
		const auth = getAuth();
		const unListen = onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				setUser(null);
				setUserStorage(null);
				Cookies.remove("userDB");
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
