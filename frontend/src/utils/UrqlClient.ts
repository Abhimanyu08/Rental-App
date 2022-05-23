import { dedupExchange, fetchExchange } from "@urql/core";
import {
	Cache,
	cacheExchange,
	Entity,
	Resolver,
} from "@urql/exchange-graphcache";
import { NextUrqlClientConfig } from "next-urql";
import schema from "../../graphql.schema.json";
import {
	CreateListingMutation,
	LoginUserMutation,
	LoginWithGoogleMutation,
	LogoutUserMutation,
	MeDocument,
	MeQuery,
	RegisterUserMutation,
} from "../generated/graphql";

const customPagination = (): Resolver => {
	return (parent, args, cache: Cache, info) => {
		const { parentKey, fieldName } = info;
		//parentKey = Query, fieldName = listings.
		//Over the course of lifetime of the app user may call listings query multiple times with different after argument
		//Therefore, there will be a bunch of fields with key listings(take:num, after:num)
		const allFields = cache.inspectFields(parentKey);
		let fieldInfos = allFields.filter((fi) => fi.fieldName === fieldName);

		if ("user_id" in args) {
			fieldInfos = fieldInfos.filter(
				(fi) => fi.arguments?.user_id === args.user_id
			);
		}
		if ("convoId" in args) {
			fieldInfos = fieldInfos.filter(
				(fi) => fi.arguments?.convoId === args.convoId
			);
		}

		if (fieldInfos.length === 0) return undefined;

		const isItInTheCache = cache.resolve(parentKey, fieldName, args);
		//above is true if listings(take:10, after:121) is already in the cache. If it's in the cache then simply return the data
		//else set info.partial = true

		info.partial = !Boolean(isItInTheCache);

		let results: string[] = [];
		let hasMore = true;
		fieldInfos.forEach((fi) => {
			const data = cache.resolve(parentKey, fi.fieldName, fi.arguments);
			let items;
			if ("convoId" in args) {
				items = cache.resolve(data as Entity, "messages") as string[];
			} else {
				items = cache.resolve(data as Entity, "items") as string[];
			}
			const _hasMore = cache.resolve(
				data as Entity,
				"hasMore"
			) as boolean;
			if (!_hasMore) hasMore = _hasMore;
			results.push(...items);
		});

		if ("convoId" in args) {
			return {
				__typename: "PaginatedMessages",
				hasMore,
				messages: results,
			};
		}
		return {
			__typename: "ListingsResponse",
			hasMore,
			items: results,
		};
	};
};

const createUrqlClient: NextUrqlClientConfig = (ssrExchange) => ({
	url: "http://localhost:4000/graphql",
	fetchOptions: {
		credentials: "include",
	} as const,
	exchanges: [
		dedupExchange,
		cacheExchange({
			resolvers: {
				Query: {
					listings: customPagination(),

					listingsByUser: customPagination(),

					// convoWithUser: customPagination(),

					user: (parent, args, cache, info) => {
						const { parentKey, fieldName } = info;
						const allFields = cache.inspectFields(parentKey);
						const fieldInfos = allFields.filter(
							(fi) =>
								fi.fieldName === fieldName &&
								fi.arguments?.id === args.id
						);

						if (fieldInfos.length === 0) return undefined;
						const isUserFetched = cache.resolve(
							parentKey,
							fieldName,
							args
						);
						info.partial = !isUserFetched;
						const reqInfo = fieldInfos.filter(
							(fi) => fi.arguments?.id === args.id
						)[0];

						const result = cache.resolve(
							parentKey,
							reqInfo.fieldName,
							reqInfo.arguments
						);
						return result;
					},
				},
			},
			keys: {
				ListingsResponse: () => null,
				PaginatedMessages: () => null,
			},
			schema: JSON.parse(JSON.stringify(schema)),
			updates: {
				Mutation: {
					//--------------Login------------------------
					loginUser: (
						result: LoginUserMutation,
						args,
						cache: Cache,
						info
					) => {
						cache.updateQuery(
							{ query: MeDocument },
							(data: MeQuery | null): MeQuery | null => {
								if (
									!result.loginUser ||
									result.loginUser.__typename === "Error"
								)
									return data;
								return {
									me: result.loginUser,
								};
							}
						);
					},
					// ----------------register---------------------------
					registerUser: (
						result: RegisterUserMutation,
						args,
						cache: Cache,
						info
					) => {
						cache.updateQuery(
							{ query: MeDocument },
							(data: MeQuery | null): MeQuery | null => {
								if (
									!result.registerUser ||
									result.registerUser.__typename === "Error"
								)
									return data;
								return {
									me: result.registerUser,
								};
							}
						);
					},

					loginWithGoogle: (
						result: LoginWithGoogleMutation,
						args,
						cache: Cache,
						info
					) => {
						cache.updateQuery(
							{ query: MeDocument },
							(data: MeQuery | null): MeQuery | null => {
								if (!result.loginWithGoogle) return data;
								else {
									return {
										me: result.loginWithGoogle,
									};
								}
							}
						);
					},
					//------------------LogOut User------------------
					logoutUser: (
						result: LogoutUserMutation,
						args,
						cache: Cache,
						info
					) => {
						cache.updateQuery(
							{ query: MeDocument },
							(data: MeQuery | null): MeQuery | null => {
								if (result.logoutUser) {
									return null;
								}
								return data;
							}
						);
					},

					// --------------------------Update Listings after create Listing--------------------
					createListing: (
						result: CreateListingMutation,
						args,
						cache: Cache,
						info
					) => {
						const key = "Query";
						cache
							.inspectFields(key)
							.filter(
								(field) =>
									field.fieldName === "listings" &&
									field.arguments?.after === undefined
							)
							.forEach((field) => {
								cache.invalidate(key, field.fieldKey);
								// cache.updateQuery(
								// 	{
								// 		query: ListingsDocument,
								// 		variables: {
								// 			take: field.arguments?.take,
								// 		},
								// 	},
								// 	(data: ListingsQuery | null) => {
								// 		if (
								// 			result.createListing.__typename ===
								// 			"Listing"
								// 		) {
								// 			if (
								// 				data?.listings.items !==
								// 				undefined
								// 			) {
								// 				data.listings.items.unshift(
								// 					result.createListing
								// 				);
								// 				return data;
								// 			}
								// 		}
								// 		return null;
								// 	}
								// );
							});

						cache
							.inspectFields(key)
							.filter(
								(field) =>
									field.fieldName === "listingsByUser" &&
									field.arguments?.after === undefined &&
									field.arguments?.user_id === args.userId
							)
							.forEach((field) => {
								cache.invalidate(key, field.fieldKey);
								// cache.updateQuery(
								// 	{
								// 		query: ListingsByUserDocument,
								// 		variables: {
								// 			take: field.arguments?.take,
								// 		},
								// 	},
								// 	(data: ListingsByUserQuery | null) => {
								// 		if (
								// 			result.createListing.__typename ===
								// 			"Listing"
								// 		) {
								// 			if (
								// 				data?.listingsByUser.items !==
								// 				undefined
								// 			) {
								// 				data.listingsByUser.items.unshift(
								// 					result.createListing
								// 				);
								// 				return data;
								// 			}
								// 		}
								// 		return null;
								// 	}
								// );
							});
					},

					//---------------Upadate listings when a listing is deleted--------
					// deleteListing: (
					// 	result: DeleteListingMutation,
					// 	args,
					// 	cache: Cache,
					// 	info
					// ) => {

					// 	const fields
					// },
				},
			},
		}),
		ssrExchange,
		fetchExchange,
	],
});

export default createUrqlClient;
