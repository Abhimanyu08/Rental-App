import { Prisma } from "@prisma/client";
import {
	Convo,
	Listing,
	QueryConvosByUserArgs,
	QueryConvoWithUserArgs,
	QueryIsThereConvoWithFriendArgs,
	QueryListingArgs,
	QueryListingsArgs,
	QueryListingsByUserArgs,
	QueryResolvers,
	QuerySearchArgs,
	QueryUserArgs,
	User,
} from "src/resolvers-types";
import { Resp, respsToListings } from "../utils/respToListing";
import Context from "./interfaces/Context";

const sleep = (s: number) => new Promise((res) => setTimeout(res, s * 1000));

export const me: QueryResolvers["me"] = async (
	_: {},
	__: {},
	context: Context
) => {
	const { req, prisma } = context;

	const resp = (await prisma.user.findUnique({
		where: { id: req.session["userId"] },
		select: {
			id: true,
			name: true,
			email: true,
			avatar_url: true,
			auth_method: true,
		},
	})) as User;

	return resp;
};

export const user: QueryResolvers["user"] = async (
	_: {},
	args: QueryUserArgs,
	context: Context
) => {
	try {
		const user = await context.prisma.user.findUnique({
			where: { id: args.id },
			select: {
				id: true,
				name: true,
				email: true,
				avatar_url: true,
			},
		});
		if (user === null) {
			return {
				type: "User",
				message: "User not found",
			};
		}
		return user;
	} catch (e) {
		console.error(e);
		return {
			type: "FetchError",
			message: "not able to fetch the user for some reason",
		};
	}
};

export const listing: QueryResolvers["listing"] = async (
	_: {},
	args: QueryListingArgs,
	context: Context
) => {
	const listing = await context.prisma.listing.findUnique({
		where: { id: args.id },
		include: {
			listedBy: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});
	return listing as Listing;
};

export const listingsByUser: QueryResolvers["listingsByUser"] = async (
	_: {},
	args: QueryListingsByUserArgs,
	context: Context
) => {
	const findObj = {
		where: { userId: args.user_id },
		include: {
			listedBy: {
				select: {
					id: true,
					name: true,
				},
			},
		},
		skip: args.after ? 1 : 0,
		take: args.take + 1,
		orderBy: {
			createdAt: "desc",
		},
	} as Prisma.ListingFindManyArgs;
	if (args.after) {
		findObj["cursor"] = { id: args.after };
	}
	const resp = await context.prisma.listing.findMany(findObj);
	return {
		items: resp.slice(0, args.take),
		hasMore: resp.length === args.take + 1,
	};
};

export const listings: QueryResolvers["listings"] = async (
	_: {},
	args: QueryListingsArgs,
	context: Context
) => {
	const findObj = {
		include: {
			listedBy: {
				select: {
					id: true,
					name: true,
				},
			},
		},
		skip: args.after ? 1 : 0,
		take: args.take + 1,
		orderBy: {
			createdAt: "desc",
		},
	} as Prisma.ListingFindManyArgs;
	if (args.after) {
		findObj["cursor"] = { id: args.after };
	}
	const resp = await context.prisma.listing.findMany(findObj);
	return {
		items: resp.slice(0, args.take),
		hasMore: resp.length === args.take + 1,
	};
};

export const search = async (
	_: {},
	args: QuerySearchArgs,
	context: Context
) => {
	const { prisma } = context;

	if (!args.term) {
		const findObj = {
			include: {
				listedBy: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		} as Prisma.ListingFindManyArgs;

		if (args.state && !args.district) {
			findObj["where"] = {
				state: args.state,
			};
			const resp = await prisma.listing.findMany(findObj);
			return resp;
		}
		findObj["where"] = {
			state: args.state as string,
			district: args.district as string,
		};
		const resp = await prisma.listing.findMany(findObj);
		return resp;
	}

	const searchTerm = args.term?.split(" ").join(" | ");
	let searchQuery;
	if (args.state && args.district) {
		searchQuery = Prisma.sql`
		WITH "S" AS  
		(
			SELECT *
			FROM "Listing"
			WHERE searchable_index_col @@ to_tsquery(${searchTerm}) AND state=${args.state} AND district=${args.district}
		)
		SELECT "S".id AS id, "S".name as name, "User".id AS user_id, "User".name AS username, "User".email ,description, "pricePerWeek", "pricePerMonth", "pricePerDay", "state", "district", "street", "S"."createdAt", photos
		FROM "User" JOIN "S" 
		ON "User".id = "S"."userId"
		ORDER BY "createdAt" DESC
		`;
	} else if (args.state && !args.district) {
		searchQuery = Prisma.sql`
		WITH "S" AS  
		(
			SELECT *
			FROM "Listing"
			WHERE searchable_index_col @@ to_tsquery(${searchTerm}) AND state=${args.state} 
		)
		SELECT "S".id AS id, "S".name as name, "User".id AS user_id, "User".name AS username, "User".email ,description, "pricePerWeek", "pricePerMonth", "pricePerDay", "state", "district", "street", "S"."createdAt", photos
		FROM "User" JOIN "S" 
		ON "User".id = "S"."userId"
		ORDER BY "createdAt" DESC
		`;
	} else {
		searchQuery = Prisma.sql`
		WITH "S" AS  
		(
			SELECT *
			FROM "Listing"
			WHERE searchable_index_col @@ to_tsquery(${searchTerm})
		)

		SELECT "S".id AS id, "S".name as name, "User".id AS user_id, "User".name AS username, "User".email ,description, "pricePerWeek", "pricePerMonth", "pricePerDay", "state", "district", "street", "S"."createdAt", photos
		FROM "User" JOIN "S" 
		ON "User".id = "S"."userId"
		ORDER BY "createdAt" DESC

		`;
	}

	try {
		const resps: Resp[] = await prisma.$queryRaw(searchQuery);
		const listings = respsToListings(resps);
		// console.log(resp);
		return listings;
	} catch (e) {
		console.error(e);
		return [];
	}
};

export const convosByUser: QueryResolvers["convosByUser"] = async (
	_: {},
	args: QueryConvosByUserArgs,
	context: Context
) => {
	if (!args.user_id) return [];

	const { prisma } = context;
	const convos = await prisma.convo.findMany({
		where: {
			OR: [
				{
					firstParticipantId: args.user_id,
				},
				{
					secondParticiapantId: args.user_id,
				},
			],
		},
		orderBy: {
			latest_message_time: "desc",
		},
		include: {
			firstParticipant: {
				select: {
					id: true,
					name: true,
				},
			},
			secondParticipant: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	let chatHeads: Convo[] = [];
	convos.forEach((convo) => {
		if (convo.firstParticipantId === args.user_id) {
			chatHeads.push({
				id: convo.id,
				friend: convo.secondParticipant,
				all_seen_by_user: convo.all_seen_by_first,
			});
			return;
		}
		chatHeads.push({
			id: convo.id,
			friend: convo.firstParticipant,
			all_seen_by_user: convo.all_seen_by_second,
		});
	});
	return chatHeads;
};

export const convoWithUser: QueryResolvers["convoWithUser"] = async (
	_: {},
	args: QueryConvoWithUserArgs,
	context: Context
) => {
	const { prisma } = context;
	const findObj = {
		where: {
			convoId: args.convoId,
		},
		select: {
			id: true,
			content: true,
			fromId: true,
			createdAt: true,
			convoId: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: args.take + 1,
		skip: args.after ? 1 : 0,
	} as Prisma.MessageFindManyArgs;
	if (args.after) {
		findObj["cursor"] = { id: args.after };
	}

	try {
		const messages = await prisma.message.findMany(findObj);
		return {
			messages: messages.slice(0, args.take),
			hasMore: messages.length === args.take + 1,
		};
	} catch (e) {
		console.error(e);
		return {
			hasMore: false,
			messages: [],
		};
	}
};

export const isThereConvoWithFriend: QueryResolvers["isThereConvoWithFriend"] =
	async (_: {}, args: QueryIsThereConvoWithFriendArgs, context: Context) => {
		const { prisma } = context;
		const resp = await prisma.convo.findFirst({
			where: {
				OR: [
					{
						firstParticipantId: args.userId,
						secondParticiapantId: args.friendId,
					},
					{
						firstParticipantId: args.friendId,
						secondParticiapantId: args.userId,
					},
				],
			},
			select: {
				id: true,
			},
		});

		return resp?.id || null;
	};
