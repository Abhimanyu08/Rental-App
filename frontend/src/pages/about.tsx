import React from "react";
import { useMeQuery } from "../generated/graphql";

function about() {
	const [result] = useMeQuery();
	const { data, fetching, error } = result;

	if (data) {
		console.log(data);
		if (data.me?.__typename === "Error") return <p>{data.me.message}</p>;
		return (
			<>
				<p>{data.me?.name}</p>
				<p>{data.me?.email}</p>
			</>
		);
	} else if (fetching) return <p>Loading...</p>;
	else console.log(error);
}

export default about;
