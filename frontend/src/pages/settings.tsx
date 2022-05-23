import { FirebaseError, getUA } from "@firebase/util";
import {
	deleteUser,
	getAuth,
	sendPasswordResetEmail,
	User,
} from "firebase/auth";
import { prepareDataForValidation } from "formik";
import { GraphQLError } from "graphql";
import { withUrqlClient } from "next-urql";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../components/Layout";
import {
	UpdateUserMutationVariables,
	useDeleteUserMutation,
	useUpdateUserMutation,
} from "../generated/graphql";
import { useAuth } from "../hooks/useAuth";
import app from "../utils/initializeFirebaseApp";
import { deleteImage, uploadFunc } from "../utils/uploadFunc";
import createUrqlClient from "../utils/UrqlClient";

function Settings() {
	const { user, fetching } = useAuth();
	const [, deleteUserFromDatabase] = useDeleteUserMutation();
	const [, updateUser] = useUpdateUserMutation();
	const router = useRouter();

	const [section, setSection] = useState<"profile" | "account">("profile");
	const [alert, setAlert] = useState({
		account: "",
		profile: "",
	});
	const [changing, setChanging] = useState(false);
	const [name, setName] = useState("");
	const [avatar, setAvatar] = useState<File | null>(null);

	const onChangePassword = async () => {
		if (user === null || !user.email) return;
		const auth = getAuth(app);
		await sendPasswordResetEmail(auth, user.email);
		setAlert((prev) => ({
			...prev,
			account: "Password reset link sent to your mail",
		}));
		setTimeout(() => setAlert((prev) => ({ ...prev, account: "" })), 3000);
	};

	const onDeleteUser = async () => {
		const auth = getAuth(app);
		const currUser = auth.currentUser;

		if (!currUser || !user) return;
		try {
			await deleteUser(auth.currentUser);
			await deleteUserFromDatabase({ deleteUserId: user.id });
			router.push("/login");
		} catch (e) {
			setAlert((prev) => ({
				...prev,
				account: (e as FirebaseError | GraphQLError).message,
			}));
		}
	};

	const onProfileChange = async () => {
		if ((name === "" && avatar === null) || user === null) return;
		setChanging(true);
		try {
			let data: UpdateUserMutationVariables = { updateUserId: user.id };
			if (name) data.name = name;
			if (avatar) {
				if (typeof user.avatar_url === "string")
					await deleteImage(user.avatar_url);
				const avatar_url = await uploadFunc(avatar, user.id, "avatar");
				data.avatarUrl = avatar_url;
			}

			await updateUser(data);
			setAlert((prev) => ({
				...prev,
				profile: "Profile Updated Successfully",
			}));
		} catch (e) {
			setAlert((prev) => ({
				...prev,
				profile: (e as FirebaseError | GraphQLError).message,
			}));
		} finally {
			setName("");
			setAvatar(null);
			setChanging(false);
		}
	};

	if (fetching) {
		return <p>Loading...</p>;
	}
	return (
		<Layout>
			<input
				type="checkbox"
				id="my-modal-account"
				className="modal-toggle"
			/>
			<div className="modal modal-bottom sm:modal-middle">
				<div className="modal-box bg-slate-200">
					<h3 className="text-lg font-bold text-rose-600">Warning</h3>
					<p className="py-4">
						Are you sure you want to delete your account?
					</p>
					<div className="modal-action">
						<label
							htmlFor="my-modal-account"
							className="btn btn-sm border-none capitalize"
							onClick={onDeleteUser}
						>
							Yes
						</label>
						<label
							htmlFor="my-modal-account"
							className="btn btn-sm border-none capitalize"
						>
							No
						</label>
					</div>
				</div>
			</div>

			<Profile
				profileAlert={alert["profile"]}
				{...{ onProfileChange, setName, setAvatar, changing }}
			/>
			<Account
				{...{ onChangePassword, accountAlert: alert["account"] }}
				showChangePassword={user?.auth_method === "email"}
			/>
		</Layout>
	);
}

const Profile = ({
	profileAlert,
	onProfileChange,
	setName,
	setAvatar,
	changing,
}: {
	profileAlert: string;
	onProfileChange: () => void;
	setName: React.Dispatch<React.SetStateAction<string>>;
	setAvatar: React.Dispatch<React.SetStateAction<File | null>>;
	changing: boolean;
}) => {
	const [showNameInput, setShowNameInput] = useState(false);
	const [showAvatarInput, setShowAvatarInput] = useState(false);

	return (
		<div className=" relative w-fit p-4">
			<div className="flex items-center gap-4 text-xl font-bold text-indigo-500">
				<span>Profile</span>
				<span className="text-sm font-semibold text-red-500">
					{profileAlert}
				</span>
			</div>

			<div className="mt-3 flex flex-col gap-3">
				<div className="flex flex-col gap-2  md:flex-row md:items-center">
					<label
						htmlFor="nameChange"
						className="btn btn-sm w-fit border-none bg-indigo-400  font-semibold capitalize text-black"
						onClick={() => setShowNameInput(true)}
					>
						Change Display Name
					</label>
					{showNameInput && (
						<input
							type="text"
							name=""
							id="nameChange"
							className="input input-sm border-indigo-500 bg-white"
							onChange={(e) => setName(e.target.value)}
						/>
					)}
				</div>
				<div className="flex flex-col gap-1 md:flex-row md:items-center">
					<label
						htmlFor="dp"
						className="btn btn-sm w-fit border-none bg-indigo-400  font-semibold capitalize text-black"
						onClick={() => setShowAvatarInput(true)}
					>
						Add/Change Profile Picture
					</label>
					{showAvatarInput && (
						<input
							type="file"
							accept="image/*"
							alt="profile picture"
							id="dp"
							className="border-none file:rounded-md file:border-none file:bg-indigo-400 file:p-1 file:text-sm"
							onChange={(e) =>
								setAvatar(e.target.files?.item(0) || null)
							}
						/>
					)}
				</div>
				{(showAvatarInput || showNameInput) && (
					<div
						className={`btn btn-sm mt-4 w-fit border-none bg-indigo-400 capitalize text-black md:absolute md:top-1 md:right-0 
						${changing ? "loading" : ""}`}
						onClick={onProfileChange}
					>
						Done
					</div>
				)}
			</div>
		</div>
	);
};

const Account = ({
	showChangePassword,
	onChangePassword,
	accountAlert,
}: {
	showChangePassword: boolean;
	onChangePassword: () => void;
	accountAlert: string;
}) => {
	return (
		<div className="flex flex-col gap-3 p-4">
			<div className="flex items-center gap-4 text-xl font-bold text-indigo-500">
				<span>Account</span>
				<span className="text-sm font-semibold text-red-500">
					{accountAlert}
				</span>
			</div>
			{showChangePassword && (
				<div
					className="btn btn-sm w-fit border-none bg-indigo-400 capitalize text-black"
					onClick={() => onChangePassword()}
				>
					Change Password
				</div>
			)}

			<label
				htmlFor="my-modal-account"
				className="modal-button btn btn-sm w-fit border-none bg-indigo-400 capitalize text-black"
			>
				Delete Account
			</label>
		</div>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Settings);
