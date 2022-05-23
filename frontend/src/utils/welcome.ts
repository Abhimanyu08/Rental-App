import { FirebaseError } from "firebase/app";
import {
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import router from "next/router";
import { toast } from "react-toastify";
import app from "./initializeFirebaseApp";

export const registerWithEmail = async (
	email: string,
	password: string
): Promise<boolean | FirebaseError> => {
	try {
		const auth = getAuth(app);
		await createUserWithEmailAndPassword(auth, email, password);
		return true;
	} catch (e) {
		console.error(e);
		return e as FirebaseError;
	}
};

export const loginWithEmail = async (
	email: string,
	password: string
): Promise<boolean | FirebaseError> => {
	try {
		const auth = getAuth(app);
		await signInWithEmailAndPassword(auth, email, password);
		return true;
	} catch (e) {
		console.error(e);
		return e as FirebaseError;
	}
};

export const onGoogleSignin = async (): Promise<
	{ name: string; email: string; registering: boolean } | FirebaseError
> => {
	try {
		const auth = getAuth(app);
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);

		const { displayName, email, metadata } = result.user;

		if (displayName === null || email === null)
			throw new FirebaseError("error", "couldn't sign in with google");

		if (
			!metadata.creationTime ||
			Date.now() - Date.parse(metadata.creationTime as string) < 2000
		) {
			return { name: displayName, email, registering: true };
		}
		return { name: displayName, email, registering: false };
	} catch (e) {
		return e as FirebaseError;
	}
};
