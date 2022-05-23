import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { string as ystring, object } from "yup";
import React from "react";
import InputElement from "../components/InputElement";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "../utils/initializeFirebaseApp";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

function ForgotPassword() {
	const onSubmit = async (
		values: { email: string },
		{ setSubmitting, setErrors }: FormikHelpers<{ email: string }>
	) => {
		try {
			const auth = getAuth(app);
			await sendPasswordResetEmail(auth, values.email);
			toast.success("Password reset link sent by email");
		} catch (e) {
			setErrors({ email: (e as FirebaseError).message });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<Formik
				initialValues={{ email: "" }}
				validationSchema={object({
					email: ystring()
						.email("Invalid Email Address")
						.required("Please enter an email"),
				})}
				onSubmit={onSubmit}
			>
				<Form className="flex flex-col">
					<InputElement label="Email" name="email" />
					<button
						className="btn btn-sm mt-10 self-center border-none bg-indigo-500 capitalize text-black"
						type="submit"
					>
						Submit
					</button>
				</Form>
			</Formik>
		</div>
	);
}

export default ForgotPassword;
