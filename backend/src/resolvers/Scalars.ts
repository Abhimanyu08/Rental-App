import { GraphQLScalarType } from "graphql";

export const CustomDate = new GraphQLScalarType({
	name: "Date",
	parseValue(value) {
		return new Date(value as string).toString();
	},
	serialize(value) {
		return value as Date;
	},
});
