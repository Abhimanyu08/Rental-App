import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import Layout from "./Layout";
import { Message, useConvoWithUserQuery } from "../generated/graphql";
import { useAuth } from "../hooks/useAuth";
import createUrqlClient from "../utils/UrqlClient";
import { AppContext } from "../pages/_app";
import { FiRewind } from "react-icons/fi";
import { Convo as ConvoType } from "../generated/graphql";
import { BsPeopleFill } from "react-icons/bs";
function Convo({
	convoId,
	uid,
	friend: { id: fid, name: fname },
	convoToMessage,
	convoToMessages,
	setConvoState,
	convoToHasMore,
	sendMessage,
	setConvoToShow,
	showIndicator,
}: {
	showIndicator: boolean;
	convoId: number;
	uid: number;
	friend: {
		id: number;
		name: string;
	};
	convoToMessage: Record<number, string>;
	convoToMessages: Record<number, Array<Message>>;
	setConvoState: (
		convoId: number,
		stateName: "hasMore" | "message" | "messages" | "after",
		value: string | boolean | number | Array<Message | null>
	) => void;

	convoToHasMore: Record<number, boolean>;
	sendMessage: (convoId: number, message: string, fid: number) => void;
	setConvoToShow: React.Dispatch<React.SetStateAction<ConvoType | null>>;
}) {
	const router = useRouter();

	function compareFunction(a: Message, b: Message) {
		const aDate = new Date(a.createdAt);
		const bDate = new Date(b.createdAt);

		//if a was sent before b we want a to be placed after b
		if (aDate < bDate) return 1;
		return -1;
	}

	return (
		<div className="flex h-full w-full basis-full flex-col self-center md:basis-2/3 xl:mb-2">
			<div className="mb-2 flex h-full flex-col-reverse justify-start overflow-y-auto ">
				{convoToMessages[convoId]
					?.sort(compareFunction)
					?.map((message) => {
						return (
							<div
								className={`mx-1 flex flex-col ${
									message?.fromId === uid ? "self-end" : ""
								}`}
							>
								{
									<span
										className={`font-semibold text-indigo-500  ${
											message?.fromId === uid
												? "self-end"
												: ""
										}`}
									>
										{message?.fromId === uid
											? "You"
											: fname}
									</span>
								}
								<p
									className={`w-fit  ${
										message?.fromId === uid
											? "self-end bg-pink-300"
											: "bg-indigo-300"
									}  rounded-md py-1 px-3 font-normal`}
								>
									{message?.content}
								</p>
							</div>
						);
					})}
				{convoToHasMore[convoId] && (
					<div
						className="btn btn-sm w-fit self-center border-none bg-indigo-400 capitalize text-black"
						onClick={() =>
							setConvoState(
								convoId,
								"after",
								convoToMessages[convoId][
									convoToMessages[convoId].length - 1
								].id
							)
						}
					>
						Load previous messages
					</div>
				)}
			</div>
			<div className="flex w-full items-center gap-1">
				<div className="indicator mr-2 md:hidden">
					{showIndicator && (
						<span className="badge indicator-item badge-xs badge-accent "></span>
					)}
					<div
						className={` btn btn-square btn-sm self-end border-none bg-indigo-500  text-black `}
						onClick={() => {
							setConvoToShow(null);
						}}
					>
						<BsPeopleFill />
					</div>
				</div>
				<input
					type="text"
					name=""
					id="message"
					className="input input-sm grow border-indigo-500 bg-white "
					value={convoToMessage[convoId]}
					onChange={(e) =>
						setConvoState(convoId, "message", e.target.value)
					}
					// onKeyPress={(e) => {
					// 	if (e.key === "Enter")
					// 		sendMessage(convoId, convoToMessage[convoId], fid);
					// }}
				/>
				<div
					className="px-1 text-3xl text-indigo-500 transition-all duration-75 active:text-2xl"
					onClick={(e) => {
						e.preventDefault();
						sendMessage(convoId, convoToMessage[convoId], fid);
					}}
				>
					<BiSend />
				</div>
			</div>
		</div>
	);
}

export default Convo;
