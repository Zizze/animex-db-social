import { FC, useEffect, useState, Dispatch } from "react";
import Layout from "@Components/layout/Layout";
import Items from "../home/items/Items";
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	startAfter,
	where,
} from "firebase/firestore";
import { db } from "@Project/firebase";
import { useAuthContext } from "@/context/useAuthContext";
import { IAnimeFirebase } from "@/types/types";
import { useRouter } from "next/router";
import classes from "./MyList.module.scss";
import Loading from "@Components/UI/loading/Loading";
import DefaultBtn from "@Components/UI/btn/DefaultBtn";
import Statistics from "./statistics/Statistics";

const MyList: FC = () => {
	const router = useRouter();
	const routerPath = router.query.status;

	const { user } = useAuthContext();
	const [getAnimeFirebase, setGetAnimeFirebase] = useState<IAnimeFirebase[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [activeHideBtn, setActiveHideBtn] = useState(false);
	const [reload, setReload] = useState(false);

	const [lastVisibleAnime, setLastVisibleAnime] = useState<QueryDocumentSnapshot<DocumentData>>();
	const [lastData, setLastData] = useState<boolean>();

	useEffect(() => {
		if (!user || !routerPath) return;
		const getFirebaseAnime = async () => {
			const q = query(
				collection(db, `users/${user.uid}/anime`),
				where("animeState", "==", routerPath),
				orderBy("personalRate", "desc"),
				limit(15)
			);

			const querySnapshot = await getDocs(q);
			const lastVisibleAnime = querySnapshot.docs[querySnapshot.docs.length - 1];

			const dataAnime = querySnapshot.docs.map((doc) => {
				return { ...(doc.data() as IAnimeFirebase) };
			});

			setLastData(querySnapshot.docs.length > 14);
			setLastVisibleAnime(lastVisibleAnime);
			setGetAnimeFirebase(dataAnime);
			setIsLoading(false);
		};
		getFirebaseAnime();
	}, [routerPath, user, reload]);

	const onClickMore = async () => {
		if (user) {
			const moreData = query(
				collection(db, `users/${user.uid}/anime`),
				where("animeState", "==", `${routerPath}`),
				startAfter(lastVisibleAnime),
				limit(15)
			);
			const querySnapshot = await getDocs(moreData);
			const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			const dataAnime = querySnapshot.docs.map((doc) => {
				return { ...(doc.data() as IAnimeFirebase) };
			});

			setGetAnimeFirebase((prev) => [...prev, ...dataAnime]);
			setLastData(dataAnime.length > 14);
			setIsLoading(false);
			setLastVisibleAnime(lastVisible);
			setActiveHideBtn(true);
		}
	};

	const onHideAll = () => {
		setReload((prev) => !prev);
		setActiveHideBtn(false);
	};

	return (
		<Layout>
			<Statistics />
			<div className={classes.container}>
				{isLoading ? (
					<Loading />
				) : getAnimeFirebase.length > 0 ? (
					<Items animeFirebase={getAnimeFirebase} />
				) : (
					<p className={classes.emptyList}>Nothing's been added yet.</p>
				)}

				<div className={classes.btns}>
					{lastData && (
						<DefaultBtn classMode="main" onClickHandler={onClickMore} disabled={!lastData}>
							More
						</DefaultBtn>
					)}
					{activeHideBtn && <DefaultBtn onClickHandler={onHideAll}>Hide all</DefaultBtn>}
				</div>
			</div>
		</Layout>
	);
};

export default MyList;
