import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@Components/layout/Layout";
import "../global.scss";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</Provider>
		</AuthProvider>
	);
}
