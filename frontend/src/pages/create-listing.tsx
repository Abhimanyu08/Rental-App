import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Listingform from "../components/listingform";
import { useAuth } from "../hooks/useAuth";
import createUrqlClient from "../utils/UrqlClient";

function CreateListing() {
	const { user, fetching } = useAuth();
	const router = useRouter();

	if (fetching) return <p>Loading...</p>;
	if (user === null) {
		router.push("/login");
		return <></>;
	}
	return <Listingform user={user} />;
}
export default withUrqlClient(createUrqlClient, { ssr: false })(CreateListing);
