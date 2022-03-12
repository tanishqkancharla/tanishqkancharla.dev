import { Result } from "../typeUtils";

export type ParserState = {
	content: string;
};

export type ParserStep<K> = (
	state: ParserState
) => Result<{ state: ParserState; token: K }>;

export interface ParseTokenMap {}

type ParseTokenType = keyof ParseTokenMap;

export type ParseToken<Types extends ParseTokenType = ParseTokenType> = {
	[Type in Types]: {
		type: Type;
	} & ParseTokenMap[Type];
}[Types];

export function parseFile() {}
