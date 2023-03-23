import { IUserFirebase } from "@/types/types";
import { db } from "@Project/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
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

	useEffect(() => {
		if (user) {
			const userRef = doc(db, `users/${user.uid}`);
			const unsub = onSnapshot(userRef, (doc) => {
				setUserStorage(doc.data() as IUserFirebase);
			});
			return () => unsub();
		} else {
			userStorage && setUserStorage(null);
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
		}),
		[user]
	);

	return (
		<AuthContext.Provider value={{ user, setUser, userStorage }}> {children}</AuthContext.Provider>
	);
};
