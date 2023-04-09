import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { AuthProvider } from "@/context/AuthContext";
import withBanCheck from "@/hoc/withBanCheck";
import Layout from "@Components/layout/Layout";
import "../global.scss";

export default function App({ Component, pageProps }: AppProps) {
	const ComponentWithBanCheck = withBanCheck(Component);

	return (
		<AuthProvider>
			<Provider store={store}>
				<Layout>
					<ComponentWithBanCheck {...pageProps} />
				</Layout>
			</Provider>
		</AuthProvider>
	);
}
