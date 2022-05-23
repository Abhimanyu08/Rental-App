import { useField, FieldConfig } from "formik";
import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

function InputElement({ label, ...props }: FieldConfig & { label: string }) {
	const [field, meta] = useField(props);
	const [show, setShow] = useState(false);
	return (
		<div className="flex w-min flex-col items-center">
			<label
				htmlFor={props.name}
				className="mr-2 mt-2  self-start font-semibold text-black"
			>
				{label}
			</label>
			<div className="relative flex items-center">
				<input
					{...field}
					{...props}
					type={label === "Password" && !show ? "password" : "text"}
					className=" mr-2 w-60 rounded-md "
				/>
				{label === "Password" &&
					(!show ? (
						<BsEyeSlashFill
							className="absolute top-1 right-3 text-indigo-700"
							size={20}
							onClick={() => setShow((prev) => !prev)}
						/>
					) : (
						<BsEyeFill
							className="absolute top-1 right-3 text-indigo-700"
							size={20}
							onClick={() => setShow((prev) => !prev)}
						/>
					))}
			</div>
			{meta.touched && meta.error ? (
				<p className=" break-all text-sm font-semibold text-red-700">
					{meta.error}
				</p>
			) : (
				<></>
			)}
		</div>
	);
}
export default InputElement;
