import { useMeQuery, User } from "../generated/graphql";
import onServer from "../utils/onSever";

export type LoggedInUser = User | null;

export const useAuth = (): { user: User | null; fetching: boolean } => {
	const [{ data, fetching, error }] = useMeQuery({
		pause: onServer(),
	});

	if (error) {
		console.error(error.message);
		return {
			user: null,
			fetching: false,
		};
	}
	return {
		user: data?.me ? data.me : null,
		fetching,
	};
};
