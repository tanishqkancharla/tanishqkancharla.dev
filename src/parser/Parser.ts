import { ParseResult } from "./ParseResult";
import { ParserStream } from "./ParserStream";

export class Parser<K> {
	constructor(private parseFn: (stream: ParserStream) => ParseResult<K>) {}

	run(stream: ParserStream | string) {
		if (stream instanceof ParserStream) {
			return this.parseFn(stream);
		} else {
			return this.parseFn(new ParserStream(stream));
		}
	}

	map<T>(fn: (tokens: K) => T) {
		return new Parser((stream) => this.parseFn(stream).map(fn));
	}

	bimap<T>(successFn: (arg: K) => T, failFn: (arg: string) => string) {
		return new Parser((stream) =>
			this.parseFn(stream).bimap(successFn, failFn)
		);
	}

	chain<T>(fn: (val: K) => Parser<T>) {
		return new Parser((stream) =>
			this.parseFn(stream).chain((val, stream) => fn(val).run(stream))
		);
	}
}
