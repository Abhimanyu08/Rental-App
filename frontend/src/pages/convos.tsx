import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import Convo from "../components/Convo";
import Layout from "../components/Layout";
import {
	Convo as ConvoType,
	Message,
	useConvosByUserQuery,
	useConvoWithUserQuery,
	User,
	useUpdateConvoMutation,
} from "../generated/graphql";
import { useAuth } from "../hooks/useAuth";
import createUrqlClient from "../utils/UrqlClient";
import { AppContext } from "./_app";

function Convos() {
	const router = useRouter();
	const { user, fetching } = useAuth();
	const [convoToShow, setConvoToShow] = useState<ConvoType | null>(null);
	const [convoToSeen, setConvoToSeen] = useState<Record<string, boolean>>({});
	const [convoToMessage, setConvoToMessage] = useState<
		Record<number, string>
	>({});
	const [convoToMessages, setConvoToMessages] = useState<
		Record<number, Array<Message>>
	>({});
	const [convoToAfter, setConvoToAfter] = useState<
		Record<number, number | null | undefined>
	>({});
	const [convoToHasMore, setConvoToHasMore] = useState<
		Record<number, boolean>
	>({});
	const { show } = router.query;
	const socket = useContext(AppContext);
	const [, updateConvo] = useUpdateConvoMutation();

	useEffect(() => {
		if (!fetching && user === null) {
			router.replace("/");
		}
	}, [user, fetching]);

	useEffect(() => {
		socket?.on("message", (message: Message) => {
			console.log("message");
			setConvoState(message.convoId, "messages", [message]);
			// setConvoState(convo.id, "seen", convo.all_seen_by_user);
			return;
		});
	}, []);

	//fetch all the conversations by the user.
	const [
		{ data: conversations, fetching: conversationsFetching },
		refetchConvos,
	] = useConvosByUserQuery({
		variables: {
			userId: user?.id,
		},
		pause: fetching,
		requestPolicy: "network-only",
	});

	//fetch a specific conversation by the user.
	const [{ data: conversation, fetching: conversationFetching }] =
		useConvoWithUserQuery({
			variables: {
				convoId: convoToShow?.id as number,
				after: convoToAfter[convoToShow?.id as number],
				take: 20,
			},
			pause:
				convoToShow === null || convoToAfter[convoToShow!.id] === null,
			requestPolicy: "network-only",
		});
	useEffect(() => {
		if (convoToShow === null) return;

		updateConvo({
			convoId: convoToShow.id,
			userId: user!.id,
		});
		setConvoState(convoToShow.id, "seen", true);
	}, [convoToShow]);

	useEffect(() => {
		if (convoToShow === null || convoToMessages === {}) return;

		updateConvo({
			convoId: convoToShow.id,
			userId: user!.id,
		});
		setConvoState(convoToShow.id, "seen", true);
	}, [convoToMessages]);

	useEffect(() => {
		if (!conversationFetching && conversation && convoToShow) {
			setConvoState(
				convoToShow.id,
				"messages",
				conversation.convoWithUser.messages
			);

			setConvoState(
				convoToShow.id,
				"hasMore",
				conversation.convoWithUser.hasMore
			);

			setConvoState(convoToShow.id, "after", null);
		}
	}, [conversationFetching, conversation]);

	//this useEffect sets the inital state of the whole page. Runs only once
	useEffect(() => {
		if (!conversationsFetching && conversations !== undefined) {
			conversations.convosByUser.forEach((convo) => {
				if (show && convo?.id === Number(show) && convoToShow === null)
					setConvoToShow(convo);
				// if (convo === null || convoToMessages.hasOwnProperty(convo.id))
				// 	return;
				if (convo === null) return;
				if (!convoToMessages.hasOwnProperty(convo.id)) {
					setConvoToMessages((prev) => ({ ...prev, [convo.id]: [] }));
				}

				setConvoToSeen((prev) => ({
					...prev,
					[convo.id]: convo.all_seen_by_user,
				}));
			});
		}
	}, [conversationsFetching, conversations]);

	//utility function for changing the state of a specific conversation.
	const setConvoState = (
		convoId: number,
		stateName: "seen" | "hasMore" | "message" | "messages" | "after",
		value: string | boolean | number | Array<Message | null> | null
	) => {
		// if (!convoToMessages.hasOwnProperty(convoId)) {
		// 	console.log(convoToMessages);
		// 	refetchConvos();
		// 	return;
		// }

		if (
			stateName === "after" &&
			(typeof value === "number" || value === null)
		) {
			setConvoToAfter((prev) => ({
				...prev,
				[convoId]: value as number | null,
			}));
			return;
		}
		if (stateName === "message" && typeof value === "string") {
			setConvoToMessage((prev) => ({ ...prev, [convoId]: value }));
			return;
		}
		if (stateName === "hasMore" && typeof value === "boolean") {
			setConvoToHasMore((prev) => ({ ...prev, [convoId]: value }));
			return;
		}
		if (stateName === "seen" && typeof value === "boolean") {
			setConvoToSeen((prev) => ({ ...prev, [convoId]: value }));
			return;
		}
		setConvoToMessages((prev) => {
			setConvoState(convoId, "seen", false);
			if (!prev.hasOwnProperty(convoId)) {
				refetchConvos();
				return prev;
			}
			return {
				...prev,
				[convoId]: [...(value as Array<Message>), ...prev[convoId]],
			};
		});
	};

	const sendMessage = (
		convoId: number,
		message: string,
		friendId: number
	) => {
		if (message === "") return;
		socket?.emit("message", user?.id, friendId, message, convoId);
		const newMessage = {
			id: 69,
			content: message,
			convoId,
			createdAt: Date.now(),
			fromId: user?.id,
		} as Message;

		setConvoToMessages((prev) => ({
			...prev,
			[convoId]: [...prev[convoId], newMessage],
		}));
		setConvoState(convoId, "message", "");
	};

	return (
		<Layout>
			{/* <div
				className={` btn btn-circle btn-sm mt-1 self-end border-none bg-indigo-500 text-black ${
					convoToShow !== null ? "md:hidden" : "hidden"
				}`}
				onClick={() => {
					setConvToShow(null);
				}}
			>
				<BsPeopleFill />
			</div> */}
			<div className="mt-4 mb-6 flex w-full grow place-self-center overflow-hidden md:w-4/5">
				<div
					className={`${
						convoToShow === null ? "basis-full " : "hidden md:flex"
					} mr-4 flex  flex-col items-center gap-2  overflow-y-auto md:basis-1/3 md:border-r-4   md:border-indigo-500/50 md:pr-4`}
				>
					{!conversationsFetching &&
						!fetching &&
						conversations?.convosByUser.map((convo) => {
							if (convo === null) return;
							return (
								<div
									className={` $ m-1 flex w-full  justify-center border-b-2 border-indigo-500 p-2 font-semibold text-indigo-500 ${
										convo?.id === convoToShow?.id
											? "bg-slate-300"
											: ""
									}`}
									onClick={() => setConvoToShow(convo)}
								>
									<p>
										{convo.friend!.name}
										{convoToSeen.hasOwnProperty(convo.id) &&
											!convoToSeen[convo.id] && (
												<span className="badge badge-sm badge-accent ml-2">
													new
												</span>
											)}
									</p>
								</div>
							);
						})}
				</div>
				{convoToShow && user && conversation && (
					<Convo
						convoId={convoToShow.id}
						uid={user.id}
						friend={convoToShow.friend as User}
						{...{
							convoToHasMore,
							convoToMessages,
							sendMessage,
							setConvoState,
							convoToMessage,
							setConvoToShow,
						}}
						showIndicator={Object.values(convoToSeen).some(
							(v) => !v
						)}
					/>
				)}
			</div>
		</Layout>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Convos);
