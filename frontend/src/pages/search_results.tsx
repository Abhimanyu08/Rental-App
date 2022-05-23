import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { ListingItem } from "../components/ListingItem";
import Searchbar from "../components/Searchbar";
import { useSearchQuery } from "../generated/graphql";
import createUrqlClient from "../utils/UrqlClient";

function Results() {
	const router = useRouter();
	const { query, state, district } = router.query;
	console.log(query, state, district);

	const [{ data, fetching }, _] = useSearchQuery({
		variables: {
			term: query === "none" ? undefined : (query as string),
			state: state === "none" ? undefined : (state as string),
			district: district === "none" ? undefined : (district as string),
		},
	});

	return (
		<Layout>
			<Searchbar
				dterm={query === "none" ? "" : (query as string)}
				dstate={state === "none" ? "" : (state as string)}
				dcity={district === "none" ? "" : (district as string)}
			/>
			{fetching ? (
				<p>Loading...</p>
			) : (
				<div className="grid auto-rows-max grid-cols-1 gap-8 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{data?.search?.map((listing) => {
						return (
							<ListingItem
								key={listing.id}
								{...{ ...listing, viewer: "public" }}
							/>
						);
					})}
				</div>
			)}
		</Layout>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Results);
