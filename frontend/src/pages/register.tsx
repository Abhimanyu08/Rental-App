import { FirebaseError } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import InputElement from "../components/InputElement";
import {
	useLoginWithGoogleMutation,
	useRegisterUserMutation,
	useRegisterWithGoogleMutation,
} from "../generated/graphql";
import app from "../utils/initializeFirebaseApp";
import createUrqlClient from "../utils/UrqlClient";
import { onGoogleSignin, registerWithEmail } from "../utils/welcome";

interface Value {
	name: string;
	email: string;
	password: string;
}

const RegisterForm = () => {
	const router = useRouter();
	const [, register] = useRegisterUserMutation();
	const [, gLogin] = useLoginWithGoogleMutation();
	const [, gRegister] = useRegisterWithGoogleMutation();

	const onGSignin: React.MouseEventHandler = async (e) => {
		const resp = await onGoogleSignin();
		if (resp instanceof FirebaseError) {
			toast.error(resp.message);
			return;
		}
		let { name, email, registering } = resp;
		let user;
		if (registering) {
			user = await gRegister({
				name,
				email,
			});
		} else {
			user = await gLogin({
				name,
				email,
			});
		}

		let { data, error } = user;
		if (error) {
			toast.error(error.message);
		}
		if (data) {
			router.push("/");
		}
	};

	const onSubmit = async (
		values: Value,
		{ setSubmitting, setErrors }: FormikHelpers<Value>
	) => {
		const res = await registerWithEmail(values.email, values.password);
		if (res instanceof FirebaseError) {
			setErrors({ password: res.message });
			return;
		} //if firebase threw an error don't create a user in the database.
		const { data, error } = await register(values);

		if (error) {
			toast.error(error.message);
			return;
		}
		if (data?.registerUser?.__typename === "User") {
			router.push("/");
			setSubmitting(false);
			return;
		}
		setErrors({
			[data?.registerUser.type as string]: [data?.registerUser.message],
		});
		setSubmitting(false);
	};
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<Formik
				initialValues={{
					name: "",
					email: "",
					password: "",
				}}
				validateOnMount={true}
				validationSchema={Yup.object({
					name: Yup.string().required("Please enter a name"),
					email: Yup.string()
						.email("Invalid email address")
						.required("Please enter an email"),
					password: Yup.string().required("Please enter a password"),
				})}
				validateOnChange={false}
				onSubmit={onSubmit}
			>
				<Form className="flex w-full flex-col items-center">
					<InputElement name="name" label="Name" />
					<InputElement name="email" label="Email" />
					<InputElement name="password" label="Password" />

					<Field>
						{({
							_,
							form,
							__,
						}: {
							_: any;
							form: FormikProps<Value>;
							__: any;
						}) => (
							<button
								type="submit"
								className={`btn ${
									form.isSubmitting ? "loading" : ""
								} btn-sm mt-2 w-fit self-center border-none bg-indigo-500 capitalize text-black `}
							>
								Register
							</button>
						)}
					</Field>

					<div className="my-10 font-semibold text-indigo-500">
						Or
					</div>
					<div
						className="btn btn-sm h-fit w-fit items-center gap-1 self-center overflow-visible rounded-md border-none bg-indigo-500 p-1 capitalize  text-black"
						onClick={onGSignin}
					>
						<FcGoogle className="h-7 w-7 rounded-full bg-white " />
						<p className="">Sign In With Google</p>
					</div>
				</Form>
			</Formik>
			<div className="link mt-20 text-indigo-600">
				<Link href="/login">Already a User? Login Instead</Link>
			</div>
		</div>
	);
};

export default withUrqlClient(createUrqlClient)(RegisterForm);
