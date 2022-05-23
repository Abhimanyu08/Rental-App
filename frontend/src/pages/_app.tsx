import type { AppProps } from "next/app";
import "../../styles/globals.css";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ToastContainer } from "react-toastify";

export const AppContext = createContext<Socket | null>(null);

function MyApp({ Component, pageProps }: AppProps) {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (socket === null) {
			const newSocket = io("http://localhost:4000");

			setSocket(newSocket);
		}
	}, []);

	return (
		<AppContext.Provider value={socket}>
			<Component {...pageProps} />;
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</AppContext.Provider>
	);
}

export default MyApp;
