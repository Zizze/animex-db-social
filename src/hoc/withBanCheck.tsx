import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../context/useAuthContext";
import { Timestamp } from "firebase/firestore";

const withBanCheck = (WrappedComponent: any) => {
	const BanCheckComponent = (props: any) => {
		const { user, userStorage } = useAuthContext();
		const router = useRouter();
		const [isBanned, setIsBanned] = useState(false);

		useEffect(() => {
			if (user && userStorage && userStorage.blocked) {
				const userEndBan = userStorage.blocked.endBan.toDate();
				const dateNow = Timestamp.now().toDate();

				const currentPath = router.asPath;
				const banPath = `/ban-details/${user.displayName}`;
				const isHomePage = router.pathname === "/";

				if (!isHomePage && currentPath !== banPath && userEndBan > dateNow) {
					router.push(banPath);
					setIsBanned(true);
				} else {
					setIsBanned(false);
				}
			}
		}, [user, userStorage, router, isBanned]);

		return <WrappedComponent {...props} />;
	};

	return BanCheckComponent;
};

export default withBanCheck;
