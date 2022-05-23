import { Listing } from "src/resolvers-types";
export type Resp = {
	id: number;
	name: string;
	user_id?: number;
	username?: string;
	email?: string;
	description: string;
	pricePerWeek: number;
	pricePerDay: number;
	pricePerMonth: number;
	state: string;
	district: string;
	street: string;
	createdAt: string;
	photos: string[];
};

export const respsToListings = (resps: Resp[]): Listing[] => {
	resps.map((resp) => respToListing(resp));
	return resps;
};

export const respToListing = (resp: Resp): Listing => {
	const user_id = resp.user_id;
	const username = resp.username;
	const email = resp.email;

	delete resp.user_id;
	delete resp.username;
	delete resp.email;

	const listing: Listing = Object.assign(resp, {
		listedBy: {
			id: user_id as number,
			name: username as string,
			email: email,
		},
		createdAt: new Date(resp.createdAt),
	});

	return listing;
};
