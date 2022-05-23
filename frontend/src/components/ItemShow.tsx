import React from "react";
import { ListingsQuery } from "../generated/graphql";
import { ListingItem } from "./ListingItem";

export function ItemShow({
	fetching,
	listings,
	setAfter,
	viewer,
	onDeleteClick,
}: {
	fetching: boolean;
	listings: ListingsQuery["listings"];
	setAfter: React.Dispatch<React.SetStateAction<number | undefined>>;
	viewer: "public" | "owner";
	onDeleteClick?: React.Dispatch<React.SetStateAction<number | null>>;
}) {
	return (
		<div className="grid auto-rows-max grid-cols-1 gap-8 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{listings.items?.map((listing) => {
				return (
					<ListingItem
						key={listing.id}
						{...{ ...listing, viewer, onDeleteClick }}
					/>
				);
			})}
			{listings.hasMore ? (
				<div
					className={`col-span-1 col-start-1 flex h-20 items-center justify-center bg-gradient-to-t from-slate-400 sm:col-span-2 lg:col-span-3 xl:col-span-4 `}
				>
					<div
						className="btn btn-sm border-none bg-indigo-400 capitalize text-black"
						onClick={() =>
							setAfter(
								listings.items[listings.items.length - 1].id
							)
						}
					>
						Load More
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
