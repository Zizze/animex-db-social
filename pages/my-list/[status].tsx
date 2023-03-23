import MyList from "@Components/screens/myList/MyList";
import { NextPage } from "next";
import { useRouter } from "next/router";

const MyListPage: NextPage = () => {
	const router = useRouter();
	const animeStateUrl = router.query.status;

	return <MyList />;
};

export default MyListPage;
