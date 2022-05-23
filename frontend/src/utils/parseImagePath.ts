const parseImagePath = (path: string): string | null => {
	let re = /.*o\/(images.*)/;
	let results = re.exec(path);
	if (results === null) return null;
	return results[1];
};

export default parseImagePath;
