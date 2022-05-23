import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import {
	useConvosByUserQuery,
	useLogoutUserMutation,
} from "../generated/graphql";
import { useAuth } from "../hooks/useAuth";
import { AppContext } from "../pages/_app";
import app from "../utils/initializeFirebaseApp";
// import { AppContext } from "../pages/_app";

import { DropDown } from "./DropDown";

function Navbar() {
	const [show, setShow] = useState(false);
	const [notify, setNotify] = useState(false);
	const router = useRouter();
	const [, logout] = useLogoutUserMutation();
	const { user, fetching } = useAuth();

	const [{ data }] = useConvosByUserQuery({
		variables: {
			userId: user?.id,
		},
		pause: fetching || user === null,
		requestPolicy: "network-only",
	});

	const socket = useContext(AppContext);

	useEffect(() => {
		if (!fetching && user !== null) socket?.emit("join", user.id);
		socket?.on("message", () => {
			setNotify(true);
		});
	}, [fetching]);

	const hasNewMessages = (): boolean => {
		if (data?.convosByUser === undefined || data.convosByUser?.length === 0)
			return false;
		let flag = false;
		data.convosByUser.forEach((convo) => {
			if (convo?.all_seen_by_user === false) flag = true;
		});
		return flag;
	};

	const onLogout: React.MouseEventHandler = async (e) => {
		e.preventDefault();
		socket?.disconnect();
		const { data, error } = await logout();
		const auth = getAuth(app);
		await signOut(auth);
		if (error) return;
		if (data?.logoutUser === false) return;
		router.push("/login");
	};

	const onShow: React.MouseEventHandler = (e) => {
		e.preventDefault();
		setShow((prev) => !prev);
	};

	return (
		<div className=" z-20  flex w-full items-center justify-between border-b-2 border-indigo-500/50 bg-slate-200 p-4 ">
			<div className="basis-1/2  border-none text-lg  font-bold text-indigo-500 md:basis-9/12  md:text-3xl">
				<Link href="/">Rent-It</Link>
			</div>

			{!fetching && user !== null ? (
				<div
					className="btn indicator btn-circle btn-sm border-none bg-indigo-500 text-black shadow-lg shadow-indigo-500/50 md:btn-md"
					onClick={() => router.push(`/convos`)}
				>
					{(hasNewMessages() || notify) &&
						router.pathname !== "/convos" && (
							<span className="badge indicator-item badge-xs bg-pink-400 capitalize text-black">
								new
							</span>
						)}
					<BiMessageRounded className="md:h-5 md:w-5" />
				</div>
			) : (
				<></>
			)}

			{!fetching ? (
				<div className="relative  z-30">
					<div
						className="  btn btn-ghost btn-circle btn-sm overflow-visible border-none bg-indigo-500 text-black shadow-lg shadow-indigo-500/50 transition-all md:btn-md"
						onClick={onShow}
					>
						{show ? <IoMdClose /> : <AiOutlineMenu />}
					</div>
					<DropDown
						loggedIn={user !== null}
						show={show}
						onLogout={onLogout}
						userId={user ? user.id : null}
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default Navbar;
