import Context from "./interfaces/Context";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import {
	MutationCreateListingArgs,
	MutationResolvers,
	MutationRegisterUserArgs,
	Listing,
	User,
	Error,
	MutationLoginUserArgs,
	MutationLoginWithGoogleArgs,
	MutationUpdateListingArgs,
	MutationDeleteListingArgs,
	MutationCreateConvoArgs,
	Convo,
	MutationUpdateConvoArgs,
	MutationRegisterWithGoogleArgs,
	MutationDeleteUserArgs,
	MutationUpdateUserArgs,
} from "../resolvers-types";
import { resolve } from "path";

export const registerUser: MutationResolvers["registerUser"] = async (
	_: {},
	args: MutationRegisterUserArgs,
	context: Context
) => {
	const { req, prisma } = context;

	try {
		let resp = await prisma.user.create({
			data: {
				name: args.name,
				email: args.email,
				auth_method: "email",
			},
		});

		req.session.userId = resp.id;
		return resp;
	} catch (e) {
		console.error(e);
		return {
			type: "email",
			message: "emial already exists",
		};
	}
};

export const loginUser: MutationResolvers["loginUser"] = async (
	_: {},
	args: MutationLoginUserArgs,
	context: Context
): Promise<User | Error> => {
	const { req, prisma } = context;
	let resp = await prisma.user.findUnique({
		where: { email: args.email },
	});

	if (resp === null) {
		return {
			type: "email",
			message: `Email not found`,
		};
	}

	req.session.userId = resp.id;

	return resp;
};

export const registerWithGoogle: MutationResolvers["registerWithGoogle"] =
	async (_: {}, args: MutationRegisterWithGoogleArgs, context: Context) => {
		const { req, prisma } = context;
		const resp = await prisma.user.create({
			data: {
				name: args.name,
				email: args.email,
				auth_method: "google",
			},
			select: {
				id: true,
				name: true,
				email: true,
				avatar_url: true,
			},
		});

		req.session.userId = resp.id;
		return resp;
	};

export const loginWithGoogle: MutationResolvers["loginWithGoogle"] = async (
	_: {},
	args: MutationLoginWithGoogleArgs,
	context: Context
): Promise<User> => {
	const { req, prisma } = context;
	let resp = await prisma.user.findUnique({
		where: { email: args.email },
	});

	if (resp !== null) req.session.userId = resp.id;
	return resp as User;
};

export const logoutUser: MutationResolvers["logoutUser"] = async (
	_: {},
	__: {},
	context: Context
): Promise<boolean> => {
	const { req, res } = context;
	let resp: boolean = await new Promise((resolve) =>
		req.session.destroy((err) => {
			if (err) {
				console.error(err);
				resolve(false);
				return;
			}
			res.clearCookie(COOKIE_NAME);
			resolve(true);
		})
	);
	return resp;
};

export const createListing: MutationResolvers["createListing"] = async (
	_: {},
	args: MutationCreateListingArgs,
	context: Context
): Promise<Listing> => {
	const { prisma } = context;

	const resp = await prisma.listing.create({
		data: args,
		include: {
			listedBy: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});
	return resp;
};

export const updateListing: MutationResolvers["updateListing"] = async (
	_: {},
	args: MutationUpdateListingArgs,
	context: Context
): Promise<Listing> => {
	const { prisma } = context;
	let data: any = { ...args };
	delete data.itemId;
	const listing = await prisma.listing.update({
		where: {
			id: args.itemId,
		},
		data,
		include: {
			listedBy: true,
		},
	});

	return listing;
};

export const deleteListing: MutationResolvers["deleteListing"] = async (
	_: {},
	args: MutationDeleteListingArgs,
	context: Context
) => {
	const { prisma } = context;
	let resp = await prisma.listing.delete({
		where: {
			id: args.listingId,
		},
	});
	return resp.id;
};

export const createConvo: MutationResolvers["createConvo"] = async (
	_: {},
	args: MutationCreateConvoArgs,
	context: Context
) => {
	const { prisma } = context;
	const resp = await prisma.convo.create({
		data: {
			firstParticipantId: args.firstId,
			secondParticiapantId: args.secondId,
		},
		include: {
			secondParticipant: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	const convo: Convo = {
		id: resp.id,
		friend: resp.secondParticipant,
		all_seen_by_user: true,
	};
	return convo;
};

export const updateConvo: MutationResolvers["updateConvo"] = async (
	_: {},
	args: MutationUpdateConvoArgs,
	context: Context
) => {
	const { prisma } = context;
	const convo = await prisma.convo.findUnique({
		where: {
			id: args.convoId,
		},
	});

	const first = convo?.firstParticipantId === args.userId;
	try {
		if (first) {
			await prisma.convo.update({
				where: {
					id: args.convoId,
				},
				data: {
					all_seen_by_first: true,
				},
			});
			return true;
		}
		await prisma.convo.update({
			where: {
				id: args.convoId,
			},
			data: {
				all_seen_by_second: true,
			},
		});
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};

export const deleteUser: MutationResolvers["deleteUser"] = async (
	_: {},
	args: MutationDeleteUserArgs,
	context: Context
) => {
	const { req, prisma } = context;
	if (!req.session.userId || req.session.userId !== args.id) return false;

	try {
		await prisma.user.delete({
			where: {
				id: args.id,
			},
		});
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};

export const updateUser: MutationResolvers["updateUser"] = async (
	_: {},
	args: MutationUpdateUserArgs,
	context: Context
) => {
	const { req, prisma } = context;
	if (!req.session.userId || req.session.userId !== args.id) return null;

	const data: any = { ...args };
	delete data["id"];

	try {
		const user = await prisma.user.update({
			where: {
				id: args.id,
			},
			data,
		});
		return user;
	} catch (e) {
		console.error(e);
		return null;
	}
};
