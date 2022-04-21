import { assert, assertEqual } from "../utils/assertUtils";
import { imageParser } from "./image";
import { isParseSuccess } from "./parseUtils";

describe("image", () => {
	it("works", () => {
		const result = imageParser.run(
			"[image:/posts/ui-as-an-api/spotify-console.png](The Spotify API Console)\n"
		);
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.href, "/posts/ui-as-an-api/spotify-console.png");
		assertEqual(result.value.caption, "The Spotify API Console");
	});

	it("works without caption", () => {
		const result = imageParser.run(
			"[image:/posts/ui-as-an-api/spotify-console.png]\n"
		);
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.href, "/posts/ui-as-an-api/spotify-console.png");
	});
});
