export interface TKParseTokenMap {}

type ParseTokenType = keyof TKParseTokenMap;

export type TKParseToken<Types extends ParseTokenType = ParseTokenType> = {
	[Type in Types]: {
		type: Type;
	} & TKParseTokenMap[Type];
}[Types];

export function parseFile() {}
