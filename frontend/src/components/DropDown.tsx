import React from "react";
import Link from "next/link";

export function DropDown({
	loggedIn,
	show,
	onLogout,
	userId,
}: {
	loggedIn: boolean;
	show: boolean;
	onLogout: React.MouseEventHandler;
	userId: number | null;
}) {
	return (
		<ul
			className={`${
				show ? "visible" : "invisible"
			} rounded-box absolute right-1/2 top-14 z-30 flex  w-max flex-col  gap-2 bg-indigo-500 p-2 font-normal text-black shadow-md shadow-indigo-500/75 `}
		>
			{loggedIn ? (
				<>
					<button className="btn btn-ghost btn-sm  capitalize">
						<Link href={`/user/${userId}`}>Profile</Link>
					</button>
					<button className="btn btn-ghost btn-sm  capitalize">
						<Link href="/settings">Settings</Link>
					</button>
					<div className="btn btn-ghost btn-sm capitalize ">
						<Link href="/create-listing">List An Item</Link>
					</div>
					<button
						className="btn btn-ghost btn-sm  capitalize"
						onClick={onLogout}
					>
						Logout
					</button>
				</>
			) : (
				<>
					<button className="btn btn-ghost btn-sm  capitalize">
						<Link href="/login">Login</Link>
					</button>

					<button className="btn btn-ghost btn-sm  capitalize">
						<Link href="/register">Register</Link>
					</button>
				</>
			)}
		</ul>
	);
}
