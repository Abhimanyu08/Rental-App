import React from "react";

export function PriceShow({ label, price }: { label: string; price: number }) {
	return (
		<div className="flex flex-col items-center">
			<div className="text-xs font-medium"> {label}</div>
			<div className="flex items-center gap-1 font-semibold">
				<span>₹ {price}/day</span>
			</div>
		</div>
	);
}
