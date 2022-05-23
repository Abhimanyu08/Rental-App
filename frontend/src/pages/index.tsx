import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { ItemShow } from "../components/ItemShow";
import Layout from "../components/Layout";
import Searchbar from "../components/Searchbar";
import { useListingsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/UrqlClient";

function Index() {
	const [after, setAfter] = useState<number | undefined>(undefined);
	const [{ data, fetching }, _] = useListingsQuery({
		variables: {
			take: 6,
			after,
		},
	});

	if (!fetching && !data) {
		return <p>Lol...</p>;
	}

	return (
		<Layout>
			<Searchbar />
			{!fetching ? (
				<ItemShow
					{...{
						fetching,
						listings: data!.listings,
						setAfter,
						viewer: "public",
					}}
				/>
			) : (
				<p>Loading...</p>
			)}
		</Layout>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
