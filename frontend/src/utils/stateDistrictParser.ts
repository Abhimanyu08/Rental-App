const countryData: Record<string, string[]> = require("../../countryData.json");

export function states(): string[] {
	return Object.keys(countryData);
}

export function districts(state: string | undefined): string[] | undefined {
	if (!state) return undefined;
	return countryData[state];
}
