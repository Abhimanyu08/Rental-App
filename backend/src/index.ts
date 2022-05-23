import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { COOKIE_NAME, __prod__ } from "./constants";
import fs from "fs";
import path, { resolve } from "path";
import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import { CustomDate } from "./resolvers/Scalars";
import { PrismaClient } from "@prisma/client";
import express from "express";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { stringify } from "querystring";

const app = express();

(async () => {
	const RedisStore = connectRedis(session);
	const redisClient = createClient({
		socket: {
			host: "127.0.0.1",
			port: 6379,
		},
		legacyMode: true,
	});

	await redisClient.connect();

	app.set("trust proxy", 1);
	app.use(
		cors({
			origin: __prod__
				? process.env.CORS_ORIGIN
				: ["https://studio.apollographql.com", "http://localhost:3000"],
			// origin: "*",
			credentials: true,
			exposedHeaders: [
				"Access-Control-Allow-Origin",
				"Access-Control-Allow-Credentials",
				"Set-Cookie",
			],
		})
	);

	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({
				client: redisClient,
				disableTouch: true,
				/*Usually every time user does an action we would want to reset the lifetime of their data on redis but this will increase the number of times we touch redis. To reduce this, we'll just store the session data on the redis forever*/
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
				sameSite: "lax", //doesn't allow cookies to make post something to sites which don't have the same domain as the aapi server
				httpOnly: true, //frontend javascript code will not be able to access the cookie
				secure: __prod__,
			},
			resave: false,
			secret: "randomString@#$%",
			saveUninitialized: false,
		})
	);

	const httpServer = createServer(app);
	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
		},
	});

	const prisma = new PrismaClient({
		// log: ["query", "info", "warn", "error"],
	});

	const resolvers = {
		LoginResponse: {
			__resolveType(obj: any) {
				if (obj.name) return "User";
				if (obj.message) return "Error";
				return null;
			},
		},
		Date: CustomDate,
		Query,
		Mutation,
	};

	const apolloServer = new ApolloServer({
		typeDefs: fs.readFileSync(
			path.join(resolve("./src/schema.graphql")),
			"utf-8"
		),
		resolvers,
		context: ({ req, res }) => ({
			req,
			res,
			prisma,
		}),
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	io.on("connection", (socket) => {
		socket.on("join", async (userId) => {
			socket.join(`${userId}`);
		});

		socket.on("message", async (from, to, message, convoId) => {
			try {
				const resp = await prisma.message.create({
					data: {
						content: message,
						fromId: from,
						toId: to,
						convoId,
					},
					include: {
						convo: {
							select: {
								firstParticipantId: true,
								secondParticiapantId: true,
							},
						},
					},
				});

				const rooms = io.of("/").adapter.rooms;
				const online = rooms.has(String(to)); //check if user with id `to` is online.
				// console.log(online, resp, convo, rooms, to);
				if (to === resp.convo.firstParticipantId) {
					await prisma.convo.update({
						where: {
							id: convoId,
						},
						data: {
							all_seen_by_first: false,
						},
					});
				} else {
					await prisma.convo.update({
						where: {
							id: convoId,
						},
						data: {
							all_seen_by_second: false,
						},
					});
				}
				if (online) socket.to(`${to}`).emit("message", resp);
			} catch (e) {
				console.error(e);
			}
		});
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: false,
	});

	httpServer.listen({ port: 4000 }, () => {
		console.log(`Server started at port 4000`);
	});
})();
