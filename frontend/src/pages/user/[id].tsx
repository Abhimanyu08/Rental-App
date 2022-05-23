import { GetServerSideProps } from "next";
import { initUrqlClient, withUrqlClient } from "next-urql";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import { env } from "process";
import React, { useContext, useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BiMessageAdd } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { ssrExchange, dedupExchange, cacheExchange, fetchExchange } from "urql";
import { ItemShow } from "../../components/ItemShow";
import Layout from "../../components/Layout";
import {
	Listing,
	ListingsByUserDocument,
	useCreateConvoMutation,
	useDeleteListingMutation,
	useIsThereConvoQuery,
	useListingsByUserQuery,
	User,
	UserDocument,
	useUserQuery,
} from "../../generated/graphql";
import { useAuth, LoggedInUser } from "../../hooks/useAuth";
import { deleteImage } from "../../utils/uploadFunc";
import createUrqlClient from "../../utils/UrqlClient";

function Profile(props: any) {
	const router = useRouter();

	const { user: loggedInUser, fetching } = useAuth();
	const [delItem, setDelItem] = useState<number | null>(null);
	const [after, setAfter] = useState<number | undefined>(undefined);

	const [{ data, fetching: userFetching }, _] = useUserQuery({
		variables: {
			userId: Number(props.id) || Number(router.query.id),
		},
		requestPolicy: "cache-and-network",
	});

	const [{ data: listingData, fetching: listingsFetching }, refetchListings] =
		useListingsByUserQuery({
			variables: {
				userId: Number(props.id) || Number(router.query.id),
				take: 4,
				after,
			},
		});

	const [{ data: isConvo, fetching: isConvoFetching }] = useIsThereConvoQuery(
		{
			variables: {
				friendId:
					data && data.user.__typename === "User" ? data.user.id : -1,
				userId: loggedInUser ? loggedInUser.id : -1,
			},
			pause: fetching || userFetching,
		}
	);

	const owner = (): boolean => {
		if (loggedInUser === null) return false;
		if (loggedInUser.id === Number(props.id)) return true;
		if (loggedInUser.id === Number(router.query.id)) return true;
		return false;
	};

	const [, deleteListing] = useDeleteListingMutation();
	const [, createConvo] = useCreateConvoMutation();

	return (
		<Layout>
			{/* //---------------------Modal-----------------------------// */}
			{!userFetching && !listingsFetching ? (
				<>
					<input
						type="checkbox"
						id="my-modal"
						className="modal-toggle"
					/>
					<div className="modal modal-bottom sm:modal-middle">
						<div className="modal-box bg-slate-200">
							<h3 className="text-lg font-bold text-rose-600">
								Warning
							</h3>
							<p className="py-4">
								Are you sure you want to delete the listing{" "}
								{
									listingData?.listingsByUser.items.find(
										(i) => i.id == delItem
									)?.name
								}
							</p>
							<div className="modal-action">
								<label
									htmlFor="my-modal"
									className="btn btn-sm border-none capitalize"
									onClick={async () => {
										if (
											listingData?.listingsByUser !==
											undefined
										) {
											await Promise.all(
												(
													listingData.listingsByUser.items.find(
														(l) => l.id === delItem
													) as Listing
												).photos.map(async (p) => {
													await deleteImage(p);
												})
											);
											// }

											let resp = await deleteListing({
												listingId: delItem as number,
											});
											if (
												typeof resp.data
													?.deleteListing === "number"
											) {
												setDelItem(null);
												refetchListings({
													requestPolicy:
														"cache-and-network",
												});
											}
										}
									}}
								>
									Yes
								</label>
								<label
									htmlFor="my-modal"
									className="btn btn-sm border-none capitalize"
								>
									No
								</label>
							</div>
						</div>
					</div>
					{/* -------------------------------Profile Page----------------------------------- */}
					<div className="mt-10 flex h-44 justify-center">
						<div className="flex flex-col  items-center gap-2">
							{data &&
							data?.user.__typename !== "Error" &&
							(data?.user as User).avatar_url !== null ? (
								<div className="avatar   justify-center">
									<div className=" rounded-full">
										<Image
											// src={user.avatar_url as string}
											src={
												(data.user as User)
													.avatar_url as string
											}
											width={128}
											height={128}
											layout="fixed"
											loading="lazy"
										/>
									</div>
								</div>
							) : (
								<div className="flex h-4/6 w-full items-center justify-center text-8xl text-indigo-500">
									<BsPersonCircle />
								</div>
							)}

							{data?.user.__typename === "User" ? (
								<p className="max-w-fit truncate text-sm  font-bold lg:text-xl">
									{data.user.name}
								</p>
							) : (
								<></>
							)}
						</div>
					</div>
					{loggedInUser &&
						data &&
						data.user.__typename === "User" &&
						!owner() && (
							<div className="flex justify-center">
								<div
									className="btn glass btn-sm   border-none text-xl"
									onClick={async () => {
										if (!isConvo?.isThereConvoWithFriend) {
											const convo = await createConvo({
												firstId: loggedInUser.id,
												secondId: (data.user as User)
													.id,
											});
											router.push(
												`/convos?show=${convo.data?.createConvo.id}`
											);
											return;
										}
										router.push(
											`/convos?show=${isConvo.isThereConvoWithFriend}`
										);
									}}
								>
									<BiMessageAdd className="text-black" />
								</div>
							</div>
						)}
					<div className=" tabs mt-10 mb-6  justify-center gap-2">
						<div
							className={`tab tab-lifted bg-indigo-500 font-semibold text-black`}
						>
							Shop
						</div>
					</div>

					{listingData && data ? (
						<ItemShow
							{...{
								listings: listingData!.listingsByUser,
								viewer: owner() ? "owner" : "public",
								fetching: listingsFetching,
								onDeleteClick: setDelItem,
								setAfter,
							}}
						/>
					) : (
						<></>
					)}
				</>
			) : (
				<>Loading...</>
			)}
		</Layout>
	);
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// 	const ssrCache = ssrExchange({ isClient: false });
// 	const client = initUrqlClient(
// 		{
// 			url: process.env.GRAPHQL_API as string,
// 			exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
// 		},
// 		true
// 	);

// 	// This query is used to populate the cache for the query
// 	// used on this page.

// 	await client!
// 		.query(UserDocument, {
// 			userId: Number(ctx.params?.id),
// 		})
// 		.toPromise();
// 	await client!
// 		.query(ListingsByUserDocument, {
// 			userId: Number(ctx.params?.id),
// 			take: 4,
// 		})
// 		.toPromise();
// 	return {
// 		props: {
// 			// urqlState is a keyword here so withUrqlClient can pick it up.
// 			urqlState: ssrCache.extractData(),
// 			id: Number(ctx.params?.id),
// 		},
// 	};
// };

// export default withUrqlClient(
// 	createUrqlClient,
// 	{ ssr: false, neverSuspend: true } // Important so we don't wrap our component in getInitialProps
// )(Profile);

export default withUrqlClient(createUrqlClient, { ssr: true })(Profile);
