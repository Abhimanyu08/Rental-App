import { useRouter } from "next/router";
import { string } from "prop-types";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { districts, states } from "../utils/stateDistrictParser";

// interface Props {
// 	state: string | undefined;
// 	setTerm: React.Dispatch<React.SetStateAction<string>>;
// 	setState: React.Dispatch<React.SetStateAction<string | undefined>>;
// 	setDistrict: React.Dispatch<React.SetStateAction<string | undefined>>;
// 	setSearch: React.Dispatch<React.SetStateAction<boolean>>;
// }

function Searchbar({
	dterm = "",
	dstate = "",
	dcity = "",
}: {
	dterm?: string;
	dstate?: string;
	dcity?: string;
}) {
	const [term, setTerm] = useState<string>(dterm);
	const [state, setState] = useState<string>(dstate);
	const [district, setDistrict] = useState<string>(dcity);

	const router = useRouter();

	return (
		<div className="sticky top-20 z-10 mt-2  mb-2 flex h-max items-center justify-center bg-slate-200 pb-2 md:top-20 lg:top-24 lg:mb-4">
			<input
				type="text"
				className=" h-10 w-40 rounded-3xl rounded-r-none border-2 border-indigo-500 px-3 shadow-md shadow-indigo-500/80 
                transition-all duration-300 focus:w-full md:w-2/5 focus:md:w-2/5 lg:w-2/5 focus:lg:w-2/5 xl:w-1/5 focus:xl:w-1/5"
				placeholder="Search"
				tabIndex={0}
				value={term}
				onChange={(e) => setTerm(e.target.value)}
				onKeyPress={(e) => {
					if (e.key === "Enter") {
						if (!term && !district && !state) return;
						router.push(
							`/search_results/?query=${
								term ? term : "none"
							}&state=${state !== "" ? state : "none"}&district=${
								district != "" ? district : "none"
							}`
						);
					}
				}}
			/>
			<select
				id="state"
				className="h-10 w-16 rounded-l-none border-2 border-l-0 border-indigo-500 bg-white text-sm font-semibold text-black shadow-md shadow-indigo-500/80 lg:w-20"
				onChange={(e) => {
					setState(e.target.value);
					if (e.target.value === "") setDistrict("");
				}}
				defaultValue={state}
			>
				<option value=""> State</option>
				{states().map((state) => (
					<option value={state} key={state}>
						{state}
					</option>
				))}
			</select>
			<select
				id="district"
				className={`h-10 w-16 rounded-3xl rounded-l-none border-2 border-l-0 border-indigo-500 bg-white text-sm font-semibold text-black shadow-md shadow-indigo-500/80 ${
					state !== "" ? "" : "hidden"
				}`}
				onChange={(e) => setDistrict(e.target.value)}
				defaultValue={district}
			>
				<option value=""> City</option>
				{districts(state)?.map((city) => (
					<option value={city} key={city}>
						{city}
					</option>
				))}
			</select>
			<div
				className="btn btn-active glass btn-sm ml-5 h-10 text-black"
				onClick={(e) => {
					if (!term && !state && !district) return;
					router.push(
						`/search_results/?query=${term ? term : "none"}&state=${
							state ? state : "none"
						}&district=${district ? district : "none"}`
					);
				}}
			>
				<FaSearch />
			</div>
		</div>
	);
}

export default Searchbar;
