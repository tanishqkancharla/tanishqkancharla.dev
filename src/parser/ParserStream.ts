export class ParserStream {
	private index: number;
	private length: number;

	get isEmpty() {
		return this.index === this.length;
	}

	constructor(private content: string, index?: number, length?: number) {
		this.index = index || 0;
		this.length = length || content.length;
	}

	// Get the first value from the iterable.
	head() {
		if (this.length <= 0) {
			throw new TypeError("Stream was emptied");
		}
		return this.content[this.index];
	}

	// Consume the stream by moving the cursor.
	move(distance: number) {
		return new ParserStream(
			this.content,
			this.index + distance,
			this.length - distance
		);
	}
	// Same interface as Array.slice but returns a new Stream
	slice(start: number, stop: number) {
		if (stop < start) {
			throw new Error("stop < start");
		}
		if (stop && stop > this.length) {
			throw new TypeError("index out of range");
		}
		return new ParserStream(
			this.content,
			this.index + start,
			(stop || this.length) - start
		);
	}

	log() {
		const marker = " ".repeat(this.index) + "^";

		console.log(`${this.content.replaceAll("\n", "\\n")}\n${marker}\n`);
	}
}
