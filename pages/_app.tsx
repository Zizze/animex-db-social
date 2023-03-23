import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { AuthProvider } from "@/context/AuthContext";
import withBanCheck from "@/hoc/withBanCheck";
import "../firebase";
import "../global.scss";

export default function App({ Component, pageProps }: AppProps) {
	const ComponentWithBanCheck = withBanCheck(Component);

	return (
		<AuthProvider>
			<Provider store={store}>
				<ComponentWithBanCheck {...pageProps} />
			</Provider>
		</AuthProvider>
	);
}
