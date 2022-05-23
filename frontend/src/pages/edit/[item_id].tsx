import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Listingform from "../../components/listingform";
import { useListingQuery, User } from "../../generated/graphql";
import { useAuth } from "../../hooks/useAuth";
import createUrqlClient from "../../utils/UrqlClient";

function Edit() {
	const router = useRouter();
	const { item_id } = router.query;
	const { user, fetching: userFetching } = useAuth();

	const [result, _] = useListingQuery({
		variables: {
			listingId: Number(item_id),
		},
	});
	const { data, fetching, error } = result;

	if (fetching || userFetching) {
		return <p>Loading... </p>;
	}
	if (data) {
		if (!user) return <p>Not logged In</p>;
		if (data.listing?.listedBy?.id !== (user as User).id) {
			return <p>Lol...</p>;
		}
		return (
			<Listingform {...{ listing: data.listing, user: user as User }} />
		);
	}
	return <p>Lol...</p>;
}

export default withUrqlClient(createUrqlClient)(Edit);
