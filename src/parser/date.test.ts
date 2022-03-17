import { assert, assertEqual } from "../assertUtils";
import { dateParser } from "./date";
import { isParseSuccess } from "./parseUtils";

describe("Date", () => {
	it("works", () => {
		const result = dateParser.run("2021-07\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value, { year: 2021, month: 7, type: "date" });
	});
});
