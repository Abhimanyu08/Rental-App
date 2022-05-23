import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import {
	useLoginUserMutation,
	useLoginWithGoogleMutation,
	useRegisterWithGoogleMutation,
} from "../generated/graphql";
import app from "../utils/initializeFirebaseApp";
import createUrqlClient from "../utils/UrqlClient";
import InputElement from "../components/InputElement";
import { loginWithEmail, onGoogleSignin } from "../utils/welcome";
import { toast, ToastContainer } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { type } from "os";

interface Value {
	email: string;
	password: string;
}
const LoginForm = () => {
	const router = useRouter();
	const [, login] = useLoginUserMutation();
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
			return;
		}
		if (data) {
			router.push("/");
			return;
		}
	};

	const onSubmit = async (
		values: Value,
		{ setSubmitting, setErrors }: FormikHelpers<Value>
	) => {
		const { data, error } = await login({ email: values.email });

		if (error) {
			setErrors({
				email: error.message,
			});
			return;
		}

		const resp = await loginWithEmail(values.email, values.password);

		if (resp instanceof FirebaseError) {
			setErrors({
				password: resp.message,
			});
			return;
		}
		if (data?.loginUser) router.push("/");
		setSubmitting(false);
	};

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<Formik
				initialValues={{
					email: "",
					password: "",
				}}
				validateOnMount={true}
				validationSchema={Yup.object({
					email: Yup.string()
						.email("Invalid emai address")
						.required("Please enter an email"),
					password: Yup.string().required("Please enter a password"),
				})}
				validateOnChange={false}
				onSubmit={onSubmit}
			>
				<Form className="flex flex-col">
					<InputElement name="email" label="Email" />

					{/* ---------------------------Password-------------------------------------------- */}

					<InputElement name="password" label="Password" />
					<Link href="/forgot_password">
						<span className="link self-end text-sm font-semibold text-indigo-500">
							Forgot Password?
						</span>
					</Link>

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
								Login
							</button>
						)}
					</Field>
					<div className="divider mt-5">Or</div>
					<div
						className="btn btn-sm h-fit w-fit  items-center gap-1 self-center overflow-visible rounded-md border-none bg-indigo-500 py-1 capitalize  text-black"
						onClick={onGSignin}
					>
						<FcGoogle className="h-7 w-7 rounded-full bg-white " />
						<p className="">Sign In With Google</p>
					</div>
				</Form>
			</Formik>
			<div className="link mt-20 text-indigo-600">
				<Link href="/register">Never been here? Register Instead</Link>
			</div>
		</div>
	);
};

export default withUrqlClient(createUrqlClient)(LoginForm);
