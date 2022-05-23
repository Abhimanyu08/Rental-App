import { FirebaseError } from "firebase/app";
import {
	ErrorMessage,
	Field,
	FieldConfig,
	FieldInputProps,
	FieldMetaProps,
	Form,
	Formik,
	FormikProps,
	FormikTouched,
	useField,
} from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillDelete, AiOutlineCloseCircle } from "react-icons/ai";
import * as Yup from "yup";
import {
	CreateListingMutationVariables,
	ListingQuery,
	useCreateListingMutation,
	User,
	useUpdateListingMutation,
} from "../generated/graphql";
import { districts, states } from "../utils/stateDistrictParser";
import { deleteImage, uploadFunc } from "../utils/uploadFunc";
import Layout from "./Layout";

interface Values {
	name?: string;
	description?: string;
	rent?: string[];
	pricePerDay?: number | string | null;
	pricePerWeek?: number | string | null;
	pricePerMonth?: number | string | null;
	street?: string;
	district?: string;
	state?: string;
}

function ListingForm({
	listing,
	user,
}: {
	listing?: ListingQuery["listing"];
	user: User;
}) {
	const [images, setImages] = useState<(File | String)[]>(
		listing?.photos || []
	);
	const [imageCount, setImageCount] = useState(0);
	const [alert, setAlert] = useState("");
	const [, createListing] = useCreateListingMutation();
	const [, updateListing] = useUpdateListingMutation();
	const router = useRouter();

	const onImageSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();
		setImages((prev) => [
			...prev,
			...Array.from(e.target.files as FileList).slice(0, 6 - prev.length),
		]);
		setImageCount((prev) => prev + 1);
	};

	const onEdit = (): boolean => "item_id" in router.query;

	return (
		<Layout>
			<Formik
				initialValues={
					!listing
						? {
								name: "",
								description: "",
								rent: [],
								pricePerDay: "",
								pricePerWeek: "",
								pricePerMonth: "",
								street: "",
								district: "",
								state: "",
						  }
						: {
								...listing,
								rent: [
									listing?.pricePerWeek ? "week" : "",
									listing?.pricePerMonth ? "month" : "",
								],
						  }
				}
				validationSchema={validationSchema}
				onSubmit={async (
					values: Values,
					{ setSubmitting, setErrors }
				) => {
					//check if all three prices are undefined
					if (images.length === 0) {
						setAlert("Please upload some images for the item.");
						setSubmitting(false);
						return;
					}

					if (!values.rent?.includes("week"))
						delete values.pricePerWeek;
					if (!values.rent?.includes("month"))
						delete values.pricePerMonth;

					delete values.rent;

					let imageUrls: string[] = [];

					try {
						imageUrls = await Promise.all(
							images.map(async (image) => {
								const url = await uploadFunc(
									image as File,
									(user as User).id,
									values.name as string
								);
								return url;
							})
						);

						let { data, error } = await createListing({
							...values,
							userId: (user as User).id,
							photos: imageUrls,
						} as CreateListingMutationVariables);
						if (error || !data || !data.createListing) {
							setAlert(
								error?.message || "Could not create listing"
							);
						} else {
							router.push(`/user/${user.id}`);
						}
					} catch (e) {
						setAlert((e as FirebaseError).message);
						return;
					} finally {
						setSubmitting(false);
						return;
					}
				}}
			>
				<Form className="mt-4 mb-2 flex flex-col gap-5 overflow-auto">
					<InputField
						label="Item Name"
						name="name"
						type="text"
						placeholder="Detailed name of the item"
					/>
					<InputField
						label="Description"
						name="description"
						type="textarea"
						placeholder="Please add a lengthy description of what the rentee should expect"
					/>
					<Field name="pricePerDay">
						{({
							field: { name, value, onChange, onBlur },
							form: { touched, errors },
							meta,
						}: {
							field: FieldInputProps<Values>;
							form: FormikProps<Values>;
							meta: FieldMetaProps<Values>;
						}) => (
							<div className="flex flex-col gap-1 md:flex-row md:items-center ">
								<label htmlFor="day" className="font-semibold">
									Price Per Day
								</label>
								<div className="flex items-center">
									<span className=" mr-2  font-semibold text-black md:ml-5">
										₹
									</span>
									<input
										type="number"
										id="day"
										className=" h-10  rounded-md font-semibold"
										value={value as number | string}
										{...{ name, onChange, onBlur }}
									/>
								</div>
								{meta.touched && meta.error && (
									<p className="ml-2 text-sm font-semibold text-rose-700">
										{meta.error}
									</p>
								)}
							</div>
						)}
					</Field>
					<CheckElement
						label="Set Discounted Price For 7+ Days"
						checkName="rent"
						id="week"
						priceName="pricePerWeek"
					/>
					<CheckElement
						label="Set Discounted Price For 30+ Days"
						checkName="rent"
						id="month"
						priceName="pricePerMonth"
					/>
					<ErrorMessage
						name="rent"
						render={(msg) => (
							<p className="text-sm font-semibold text-red-700">
								{msg}
							</p>
						)}
					/>

					<AddressField
						districtName="district"
						streetName="street"
						stateName="state"
					/>
					<div className="flex flex-wrap gap-2">
						<label htmlFor="images" className="font-semibold">
							Images
						</label>
						<input
							type="file"
							id="images"
							onChange={onImageSelect}
							max={`${6 - images.length}`}
							multiple
							required={images.length === 0}
							accept="image/*"
							className="border-none file:btn file:btn-xs file:rounded-md file:bg-indigo-400 file:capitalize file:text-black"
						/>
						{alert && (
							<p className="font-seminold text-sm text-rose-700">
								{alert}
							</p>
						)}
					</div>
					<div className="flex w-full flex-col flex-wrap gap-1 font-semibold text-black lg:flex-row">
						<span>{onEdit() ? "Additional" : "New"} Images: </span>
						{imageCount > 0 ? (
							images.map((image, idx) => {
								if (typeof image === "string") return;
								return (
									<div
										className="flex flex-row items-center gap-2 pr-3 font-normal lg:flex-col lg:gap-0"
										key={idx}
									>
										<span>{(image as File).name}</span>
										<div
											className="btn glass btn-circle btn-xs"
											onClick={() =>
												setImages((prev) =>
													prev.filter(
														(i) => i !== image
													)
												)
											}
										>
											<AiOutlineCloseCircle className="h-full w-full text-black" />
										</div>
									</div>
								);
							})
						) : (
							<></>
						)}
					</div>
					{onEdit() ? (
						<div className="flex flex-col">
							<p className="mb-2 font-semibold">
								Uploaded Images for this Item:
							</p>
							<div className="grid  grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{images.map((image, idx) => {
									if (typeof image !== "string") return;
									return (
										<div
											className=" flex flex-col rounded-md "
											key={idx}
										>
											<div className="figure border-2 border-indigo-500">
												<Image
													src={image}
													width={384}
													height={256}
													layout="responsive"
													objectFit="contain"
												/>
											</div>
											<div
												className="btn btn-active glass btn-xs mt-1 w-1/4 self-center capitalize text-black"
												onClick={async () => {
													let res = await deleteImage(
														image
													);
													if (res)
														setImages(
															(prevImages) =>
																prevImages.filter(
																	(i) =>
																		i !==
																		image
																)
														);
												}}
											>
												<AiFillDelete className="mr-1 " />{" "}
												Delete
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<></>
					)}
					<Field>
						{({
							_,
							form,
							__,
						}: {
							_: any;
							form: FormikProps<Values>;
							__: any;
						}) => {
							{
								return onEdit() ? (
									<button
										type="button"
										className={`btn btn-sm w-fit bg-indigo-400 capitalize text-black ${
											form.isSubmitting ? `loading` : ""
										}`}
										onClick={async () => {
											form.setSubmitting(true);

											if (images.length === 0) {
												setAlert(
													"Please upload some images for the item."
												);
												form.setSubmitting(false);
												return;
											}

											let {
												pricePerDay,
												pricePerMonth,
												pricePerWeek,
											} = form.values;

											if (pricePerDay === "") {
												form.setErrors({
													pricePerDay:
														"Renting For Free? That's a bit too generous. Please enter a price",
												});
												form.setSubmitting(false);
												return;
											}

											if (
												!form.values.rent?.includes(
													"week"
												)
											)
												pricePerWeek = null;
											if (
												!form.values.rent?.includes(
													"month"
												)
											)
												pricePerMonth = null;

											delete form.touched.rent;

											let newDetails =
												Object.create(null);
											for (let key of Object.keys(
												form.touched
											)) {
												newDetails[key] =
													form.values[
														key as keyof FormikTouched<Values>
													];
											}
											let imgArr = [...images];
											imgArr = await Promise.all(
												imgArr.map(async (image) => {
													if (
														typeof image ===
														"string"
													)
														return image;
													const url =
														await uploadFunc(
															image as File,
															(user as User).id,
															form.values
																.name as string
														);
													return url;
												})
											);
											try {
												const { data, error } =
													await updateListing({
														...newDetails,
														itemId: Number(
															router.query.item_id
														),
														pricePerDay,
														pricePerWeek,
														pricePerMonth,
														photos: imgArr,
													});
												if (
													error ||
													data === undefined ||
													data.updateListing ===
														undefined
												) {
													setAlert(
														error?.message || ""
													);
													form.setSubmitting(false);
													return;
												}
												form.setSubmitting(false);
												router.push(
													`/user/${(user as User).id}`
												);
												return;
											} catch (e) {
												form.setSubmitting(false);
												console.log(e);
											}
										}}
									>
										Submit
									</button>
								) : (
									<button
										type="submit"
										className={`btn btn-sm w-fit bg-indigo-400 capitalize text-black ${
											form.isSubmitting ? `loading` : ""
										}`}
									>
										Submit
									</button>
								);
							}
						}}
					</Field>
				</Form>
			</Formik>
		</Layout>
	);
}

const AddressField = (props: {
	streetName: string;
	districtName: string;
	stateName: string;
}) => {
	const [streetfield, streetmeta] = useField(props.streetName);
	const [districtfield, districtmeta] = useField(props.districtName);
	const [statefield, statemeta] = useField(props.stateName);

	return (
		<div className="flex w-full flex-col gap-1">
			<p className="font-semibold">Pick up the Item from</p>
			<div className="flex flex-col md:flex-row">
				<label htmlFor="street" className=" w-20 font-semibold">
					Street{" "}
				</label>
				<textarea
					id="street"
					{...streetfield}
					className="w-64 rounded-md border-2 border-indigo-500  px-2 font-medium"
				/>
				{streetmeta.touched && streetmeta.error ? (
					<p className="text-sm font-semibold text-red-700">
						{streetmeta.error}
					</p>
				) : (
					<></>
				)}
			</div>
			<div className="flex  flex-wrap items-center">
				<label htmlFor="state" className="w-20 font-semibold">
					State
				</label>
				<select
					{...statefield}
					id="state"
					className="h-10 w-64 rounded-md border-2 border-indigo-500 bg-white text-sm font-semibold text-black"
					defaultValue={statefield.value}
				>
					<option value="">Please select a State</option>
					{states().map((state) => (
						<option value={state} key={state}>
							{state}
						</option>
					))}
				</select>
				{statemeta.touched && statemeta.error ? (
					<p className="text-sm font-semibold text-red-700">
						{statemeta.error}
					</p>
				) : (
					<></>
				)}
			</div>
			<div className="flex flex-wrap items-center">
				<label htmlFor="district" className="w-20 font-semibold">
					District
				</label>
				{statemeta.value ? (
					<select
						{...districtfield}
						id="district"
						className="h-10 w-64 rounded-md border-2 border-indigo-500 bg-white text-sm font-semibold text-black"
					>
						<option value="">Please select a District</option>
						{districts(statemeta.value)?.map((district) => (
							<option value={district} key={district}>
								{district}
							</option>
						))}
					</select>
				) : (
					<></>
				)}
				{districtmeta.touched && districtmeta.error ? (
					<p className="text-sm font-semibold text-red-700">
						{districtmeta.error}
					</p>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

const InputField = ({
	label,
	...props
}: FieldConfig & { label: string; placeholder: string }) => {
	const [field, meta] = useField(props);
	return (
		<div className="flex w-4/5 flex-col gap-1 lg:w-1/3">
			<label htmlFor={props.name} className="font-semibold">
				{label}
			</label>
			{props.type === "textarea" ? (
				<textarea
					id={props.name}
					className="text-area resize-y rounded-md border-2 border-indigo-500 px-2 font-medium"
					{...props}
					{...field}
				/>
			) : (
				<input
					{...props}
					{...field}
					id={props.name}
					className="h-10 rounded-md border-2 border-indigo-500 px-2 font-medium "
				/>
			)}
			{meta.touched && meta.error ? (
				<p className="text-sm font-semibold text-red-700">
					{meta.error}
				</p>
			) : (
				<></>
			)}
		</div>
	);
};

const CheckElement = ({
	label,
	checkName,
	priceName,
	...props
}: { label: string; checkName: string; priceName: string } & Record<
	string,
	string
>) => {
	const [checkfield, checkmeta] = useField(checkName);
	const [pricefield, pricemeta] = useField(priceName);
	// pricefield.onChange = (e: React.ChangeEvent) => {
	// 	pricefield.value = Number(e.target.textContent)?.toLocaleString();
	// };

	return (
		<div className="flex flex-col  gap-4 lg:flex-row lg:items-center ">
			<div className="flex w-fit">
				<label htmlFor={props.id} className="w-fit font-semibold">
					{label}
				</label>
				<input
					type="checkbox"
					id={props.id}
					{...checkfield}
					value={props.id}
					checked={(checkfield?.value as string[])?.includes(
						props.id
					)}
					className="checkbox checkbox-md ml-5 border-2 border-indigo-500"
				/>
			</div>

			<div
				className={`flex items-center gap-1 ${
					checkmeta.value?.includes(props.id) ? "" : "hidden"
				}`}
			>
				<label htmlFor={`price-${props.id}`} className="font-semibold">
					₹
				</label>
				<input
					type="number"
					min={0}
					{...pricefield}
					id={`price-${props.id}`}
					className="input input-sm h-10 w-fit rounded-md border-2 border-indigo-500 bg-white font-semibold"
					placeholder="0"
				/>
				<span className="font-semibold text-black">/per day</span>
			</div>
			{pricemeta.touched && pricemeta.error ? (
				<p className="text-sm font-semibold text-red-700">
					{pricemeta.error}
				</p>
			) : (
				<></>
			)}
		</div>
	);
};

const validationSchema = Yup.object({
	name: Yup.string().required(
		"Please name your item unless you're renting out Lord Voldemort"
	),
	description: Yup.string().required(
		"Your Item is not as good as to be indescribable. Please add a description"
	),

	rent: Yup.array().of(Yup.string()),

	street: Yup.string().required(
		"Are you omnipresent? If not, please enter a street name"
	),

	state: Yup.string().required("Please select a state."),
	district: Yup.string().required("Please enter a district"),

	pricePerDay: Yup.number()
		.required(
			"We suppose you don't want to rent your item for free. Please Enter a price"
		)
		.positive("Yup, we've added a check for negative numbers")
		.integer(),
	pricePerWeek: Yup.number()
		.optional()
		.positive("Yup, we've added a check for negative numbers")
		.integer(),
	pricePerMonth: Yup.number()
		.optional()
		.positive("Yup, we've added a check for negative numbers")
		.integer(),
});

export default ListingForm;
// Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit et blanditiis in tenetur delectus autem ullam quae vitae animi quisquam voluptas rem nisi neque voluptate, ut, vero eos. Eveniet, earum.
