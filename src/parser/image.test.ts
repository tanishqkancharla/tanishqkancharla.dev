import { isParseSuccess } from "teg-parser";
import { assert, assertEqual } from "../utils/assertUtils";
import { imageParser } from "./image";

describe("image", () => {
	it("works", () => {
		const result = imageParser.run(
			"[image:/posts/ui-as-an-api/spotify-console.png](The Spotify API Console)"
		);
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.url, "/posts/ui-as-an-api/spotify-console.png");
		assertEqual(result.value.caption, "The Spotify API Console");
	});

	it("works without caption", () => {
		const result = imageParser.run(
			"[image:/posts/ui-as-an-api/spotify-console.png]"
		);
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.url, "/posts/ui-as-an-api/spotify-console.png");
	});
});
