import { GetServerSideProps } from "next";
import { initUrqlClient, withUrqlClient } from "next-urql";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { IoPeopleSharp } from "react-icons/io5";
import { cacheExchange, dedupExchange, fetchExchange, ssrExchange } from "urql";
import Carousel from "../../components/Carousel";
import Layout from "../../components/Layout";
import { PriceShow } from "../../components/PriceShow";
import Searchbar from "../../components/Searchbar";
import {
	ListingDocument,
	useCreateConvoMutation,
	useIsThereConvoQuery,
	useListingQuery,
	User,
} from "../../generated/graphql";
import { useAuth } from "../../hooks/useAuth";
import createUrqlClient from "../../utils/UrqlClient";

function Item() {
	const router = useRouter();
	const [section, setSection] = useState<"reviews" | "description">(
		"description"
	);
	const [pvalue, setPvalue] = useState(0);
	const [inter, setInter] = useState<NodeJS.Timer | null>(null);

	const [{ data, fetching: listingFetching, error }] = useListingQuery({
		variables: {
			listingId: Number(router.query.id),
		},
	});

	useEffect(() => {
		if (listingFetching) {
			const interval = setInterval(
				() => setPvalue((prev) => prev + 5),
				30
			);
			setInter(interval);
			return;
		}
		if (inter) clearInterval(inter);
	}, [listingFetching]);

	const { user: loggedInUser, fetching } = useAuth();
	const [, createConvo] = useCreateConvoMutation();

	const [{ data: isConvo, fetching: isConvoFetching }] = useIsThereConvoQuery(
		{
			variables: {
				friendId: data?.listing.listedBy
					? data.listing.listedBy.id
					: -1,
				userId: loggedInUser ? loggedInUser.id : -1,
			},
			pause:
				fetching ||
				listingFetching ||
				data?.listing.listedBy === undefined ||
				loggedInUser === null,
		}
	);

	return (
		<Layout>
			<Head>
				<title>Rent It - {data?.listing?.name}</title>
				<meta property="og:title" content={`${data?.listing?.name}`} />
				<meta
					property="og:image"
					content={`${data?.listing?.photos[0]}`}
				/>
				<meta property="og:image:width" content="200" />
				<meta property="og:image:height" content="100" />
				<meta
					property="og:image:alt"
					content="An image for the item on rent"
				/>
				<meta
					property="og:url"
					content={`http://localhost:3000/item/${data?.listing?.id}`}
				/>
				<meta
					property="og:description"
					content={`Rent ${data?.listing?.name} @ ₹ ${data?.listing?.pricePerDay} per day`}
				/>
			</Head>
			<Searchbar />
			{!listingFetching && data?.listing !== undefined ? (
				<div className="flex grow flex-col gap-3 overflow-y-auto">
					<div className="mt-2 flex flex-col md:flex-row">
						{/* ----------------------------Carousel---------------------- */}
						<div className=" overflow-hidden rounded-md bg-slate-400 md:basis-1/2 lg:basis-5/12">
							<Carousel
								images={data.listing.photos as string[]}
								height={256}
								width={384}
								layout="responsive"
							/>
						</div>

						<div className="flex flex-col items-center  gap-2 md:ml-10 md:basis-1/2 md:items-start lg:basis-7/12 lg:gap-5">
							{/* ------------------Name and item stats--------------------------------- */}
							<div className="text-2xl font-bold text-black md:text-3xl">
								{data.listing.name}{" "}
							</div>

							<div className="flex items-center gap-3 text-black ">
								<span className="font-semibold">
									Listed By:{" "}
								</span>
								<Link
									href={`/user/${data.listing.listedBy?.id}`}
								>
									<span className="link font-normal">
										{data.listing.listedBy?.name}
									</span>
								</Link>
							</div>

							<div className="flex w-full justify-center  text-black md:justify-start ">
								<PriceShow
									label="Regular Price"
									price={data.listing.pricePerDay as number}
								/>
								{data.listing.pricePerWeek && (
									<>
										<div className="divider text-2xl">
											|
										</div>
										<PriceShow
											label="For 7+ days"
											price={
												data.listing
													.pricePerWeek as number
											}
										/>
									</>
								)}
								{data.listing.pricePerMonth && (
									<>
										<div className="divider text-2xl">
											|
										</div>
										<PriceShow
											label="For 30+ days"
											price={
												data.listing
													.pricePerMonth as number
											}
										/>
									</>
								)}
							</div>
							<div className="mx-5 mt-2 flex flex-wrap text-black md:mx-0 lg:mx-0  lg:gap-2">
								<span className="font-semibold">
									Available at :{"  "}
								</span>
								<span>
									{data.listing.street},{" "}
									{data.listing.district},{" "}
									{data.listing.state}
								</span>
							</div>
							{loggedInUser !== null &&
								loggedInUser.id !==
									data.listing.listedBy?.id && (
									<div
										className="btn btn-sm mt-2 border-none bg-indigo-400 capitalize text-black lg:mt-5"
										onClick={async () => {
											if (
												!isConvo?.isThereConvoWithFriend
											) {
												const convo = await createConvo(
													{
														firstId:
															loggedInUser.id,
														secondId: (
															data?.listing
																?.listedBy as User
														).id,
													}
												);
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
										Message Owner
									</div>
								)}
						</div>
					</div>

					{/* -------------------------Tabs------------------------------ */}
					<div className=" tabs mt-5 mb-2 justify-center gap-2  lg:mt-10 lg:mb-5">
						<div
							className={`tab tab-lifted bg-indigo-400 font-semibold  transition-all duration-300 ${
								section === "description"
									? "text-black"
									: "tab-active text-white"
							}`}
							onClick={() => setSection("description")}
						>
							Description
						</div>
						<div
							className={`tab  tab-lifted bg-indigo-400 transition-all ${
								section === "reviews"
									? "text-black"
									: "tab-active text-white"
							}`}
							onClick={() => setSection("reviews")}
						>
							Reviews
						</div>
					</div>

					{/* ---------------------Description and reviews---------------------- */}
					<div className="mx-auto w-full  p-5 pt-0 text-left md:w-2/3 lg:w-1/2">
						{section === "description" && (
							<p className="font-normal">
								{data?.listing?.description}
							</p>
						)}
						{section === "reviews" && <p>reviews</p>}
					</div>
				</div>
			) : (
				<progress
					className="progress progress-primary w-56 self-center justify-self-center"
					value={pvalue}
					max="100"
				></progress>
			)}
		</Layout>
	);
}

const ItemStat = ({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon: JSX.Element;
}) => {
	return (
		<div className="flex w-max items-center  text-black">
			{icon}
			<span className="ml-1 font-semibold">{value}</span>
			<span className="ml-2">{label}</span>
		</div>
	);
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// 	const ssrCache = ssrExchange({ isClient: false });
// 	const client = initUrqlClient(
// 		{
// 			url: "http://localhost:4000/graphql",
// 			exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
// 		},
// 		false
// 	);

// 	// This query is used to populate the cache for the query
// 	// used on this page.
// 	const result = await client!
// 		.query(ListingDocument, { listingId: Number(ctx.params?.id) })
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
// 	(ssr) => ({
// 		url: "http://localhost:4000/graphql",
// 	}),
// 	{ ssr: false, neverSuspend: true } // Important so we don't wrap our component in getInitialProps
// )(Item);

export default withUrqlClient(createUrqlClient, { ssr: true })(Item);
