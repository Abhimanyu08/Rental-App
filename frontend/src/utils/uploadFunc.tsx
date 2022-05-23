import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import app from "./initializeFirebaseApp";
import { v4 } from "uuid";
import parseImagePath from "./parseImagePath";

export async function uploadFunc(
	image: File,
	userId: number,
	listingName: string
) {
	const storage = getStorage(app);
	const storageRef = ref(
		storage,
		`images/${userId}/${listingName}/${image.name}-${v4()}`
	);
	console.log(ref);
	const uploadTask = await uploadBytes(storageRef, image);
	const url = await getDownloadURL(uploadTask.ref);
	return url;
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
	const parsedImageUrl = new URL(imageUrl);
	console.log(parsedImageUrl);
	const filePath = parseImagePath(
		decodeURIComponent(parsedImageUrl.pathname)
	);
	console.log(filePath);
	const storage = getStorage(app);
	const deleteRef = ref(storage, filePath as string);
	try {
		await deleteObject(deleteRef);
		return true;
	} catch (e) {
		return false;
	}
}

export async function deleteFolder(
	ownerId: number,
	folderName: string
): Promise<boolean> {
	const filePath = `images/${ownerId}/${folderName}/`;
	const storage = getStorage(app);
	const deleteRef = ref(storage, filePath as string);
	try {
		await deleteObject(deleteRef);
		return true;
	} catch (e) {
		return false;
	}
}
