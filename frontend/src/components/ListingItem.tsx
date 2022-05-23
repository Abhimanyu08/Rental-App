import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ListingsQuery } from "../generated/graphql";
import Carousel from "./Carousel";
import { PriceShow } from "./PriceShow";

//restrict the height of card
//import next/image and set object-fit to contain

export const ListingItem: React.FC<
	ListingsQuery["listings"]["items"][number] & {
		viewer: "public" | "owner";
	} & {
		onDeleteClick?: React.Dispatch<React.SetStateAction<number | null>>;
	}
> = ({
	id,
	name,
	listedBy,
	photos,
	pricePerDay,
	pricePerWeek,
	pricePerMonth,
	street,
	state,
	district,
	viewer = "owner",
	onDeleteClick,
}) => {
	const router = useRouter();
	return (
		<div className="card-compact card h-auto w-auto shadow-xl">
			<div
				className="w-full bg-slate-300" //
			>
				<Carousel
					images={photos}
					width={384}
					height={300}
					layout="intrinsic"
				/>
			</div>
			<div className="card-body relative justify-between bg-slate-400">
				{viewer === "owner" ? (
					<div className="dropdown-left dropdown absolute  top-1 right-1 z-30">
						<label
							tabIndex={0}
							className="btn btn-active  glass btn-xs"
						>
							<BsThreeDotsVertical className="text-black" />
						</label>
						<ul
							tabIndex={0}
							className="dropdown-content menu rounded-box gap-2 bg-indigo-400 p-2 text-xs font-semibold text-black"
						>
							<Link href={`/edit/${id}`}>
								<li className="cursor-pointer self-center text-sm">
									Edit
								</li>
							</Link>
							<li className="self-center">
								<label
									htmlFor="my-modal"
									className="modal-button btn-sm"
									onClick={() => {
										onDeleteClick
											? onDeleteClick(id)
											: null;
									}}
								>
									Delete
								</label>
							</li>
						</ul>
					</div>
				) : (
					<></>
				)}

				<h2 className="card-title w-full flex-col flex-wrap items-start gap-0  text-black">
					<Link href={{ pathname: "/item/[id]", query: { id } }}>
						<p className="cursor-pointer break-all font-semibold">
							{name}
						</p>
					</Link>
					{!("id" in router.query) ? (
						<div className="flex gap-1 font-normal">
							<span className="text-sm">by</span>
							<Link href={`/user/${listedBy?.id}`}>
								<span className="link break-all text-sm font-semibold ">
									{" "}
									{listedBy?.name}
								</span>
							</Link>
						</div>
					) : (
						<></>
					)}
					<p className="break-all text-sm font-semibold ">
						@ {street}, {district}, {state}{" "}
					</p>
				</h2>

				{/* <div className="flex w-full justify-start gap-4 text-black">
					<div className="flex flex-col items-center">
						<div className="stat-title">Rented By</div>
						<div className="flex items-center gap-1 font-semibold">
							<p>100</p>
							<p>
								<IoPeopleSharp
									className=""
									fill="rgb(79 70 229)"
								/>
							</p>
						</div>
					</div>
					<div className="flex flex-col items-center">
						<div className="stat-title">Item Rating</div>
						<div className="flex items-center gap-1">
							<p className="font-semibold">4.2</p>
							<p>
								<AiFillStar className="text-amber-300" />
							</p>
							<p>(73)</p>
						</div>
					</div>
				</div> */}
				{/* -----------------------Price----------------------------- */}

				<div className="flex w-full justify-start gap-4 text-black">
					<PriceShow
						label="Regular Price"
						price={pricePerDay as number}
					/>
					{pricePerWeek && (
						<PriceShow
							label="For 7+ days"
							price={pricePerWeek as number}
						/>
					)}
					{pricePerMonth && (
						<PriceShow
							label="For 30+ days"
							price={pricePerMonth as number}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
