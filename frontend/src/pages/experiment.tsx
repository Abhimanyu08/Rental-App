import React from "react";
import Layout from "../components/Layout";

function experiment() {
	return (
		<Layout>
			<div className="max-h-xl  flex h-[36rem] w-10 flex-col bg-black">
				<div className="w-5 bg-white">1</div>
				<div className="h-[42rem] w-5 grow overflow-scroll bg-white">
					2
				</div>
			</div>
		</Layout>
	);
}

export default experiment;
