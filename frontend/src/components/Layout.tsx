import { withUrqlClient } from "next-urql";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import createUrqlClient from "../utils/UrqlClient";
import Navbar from "./Navbar";

const Layout: React.FC = ({ children }) => {
	return (
		<div className="max-w-screen mx-2   flex h-screen max-h-screen  flex-col  px-2  md:px-0 md:pb-0 lg:mx-auto lg:w-4/5">
			<Navbar />
			{children}
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
};

// export default withUrqlClient(createUrqlClient, { ssr: true })(Layout);
export default Layout;
