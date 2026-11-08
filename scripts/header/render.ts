// Manually bakes the fluted glass header. Not part of the build. See README.md.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import { AddressInfo } from "node:net";
import path from "node:path";
import { promisify } from "node:util";
import { build } from "esbuild";
import sharp from "sharp";
import { defaultWebsiteContext } from "../../src/config";
import {
	HEADER_IMAGE_HEIGHT,
	HEADER_IMAGE_WIDTH,
} from "../../src/styles/resolutions";

// The strip is never drawn narrower than 90rem (resolutions.ts), so the glass
// pattern is laid out at that width and rendered at a higher pixel ratio.
const cssWidth = 1440;
const pixelRatio = HEADER_IMAGE_WIDTH / cssWidth;
const cssHeight = HEADER_IMAGE_HEIGHT / pixelRatio;

const session = "header-render";

// Asynchronous, so this process's page server keeps answering the browser.
async function browser(...args: string[]) {
	const { stdout } = await promisify(execFile)(
		"agent-browser",
		["--session", session, "--json", ...args],
		{ maxBuffer: 256 * 1024 * 1024 }
	);
	const reply = JSON.parse(stdout);
	if (!reply.success) throw new Error(`${args[0]}: ${JSON.stringify(reply)}`);
	return reply.data;
}

async function main() {
	const { publicDir, headerImageURL } = defaultWebsiteContext;
	const source = path.resolve(process.argv[2] ?? path.join(publicDir, "mcwayfalls.JPG"));
	const output = path.join(publicDir, path.basename(headerImageURL));

	const bundle = await build({
		entryPoints: [path.join(__dirname, "page.tsx")],
		bundle: true,
		write: false,
		jsx: "automatic",
		define: { "process.env.NODE_ENV": '"production"' },
		logLevel: "warning",
	});
	const files: Record<string, [string, Buffer | string]> = {
		"/": ["text/html", '<body style="margin:0"><div id="root"></div><script src="/page.js"></script>'],
		"/page.js": ["text/javascript", bundle.outputFiles[0].text],
		"/source": ["image/jpeg", await fs.readFile(source)],
	};
	const server = http.createServer((request, response) => {
		const file = files[new URL(request.url!, "http://localhost").pathname];
		if (!file) return response.writeHead(404).end();
		response.writeHead(200, { "content-type": file[0] }).end(file[1]);
	});
	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const { port } = server.address() as AddressInfo;

	let glass: Buffer;
	try {
		const query = new URLSearchParams({
			image: "/source",
			width: String(cssWidth),
			height: String(cssHeight),
			pixelRatio: String(pixelRatio),
		});
		await browser("open", `http://127.0.0.1:${port}/?${query}`);
		await browser("wait", "--fn", "document.body.dataset.ready || document.body.dataset.error");
		const { result } = await browser(
			"eval",
			`document.body.dataset.error ?? document.querySelector("canvas").toDataURL("image/png")`
		);
		if (!result.startsWith("data:image/png")) throw new Error(`Render failed: ${result}`);
		glass = Buffer.from(result.split(",")[1], "base64");
	} finally {
		await browser("close");
		server.close();
	}

	const { width, height } = await sharp(glass).metadata();
	if (width !== HEADER_IMAGE_WIDTH || height !== HEADER_IMAGE_HEIGHT) {
		throw new Error(`Rendered ${width}×${height}, expected ${HEADER_IMAGE_WIDTH}×${HEADER_IMAGE_HEIGHT}`);
	}

	// The glass is partly transparent at its edges. On the live site it sat over
	// the cover-fitted photo, so the bake keeps that backdrop.
	await sharp(source)
		.resize(HEADER_IMAGE_WIDTH, HEADER_IMAGE_HEIGHT, { fit: "cover" })
		.composite([{ input: glass }])
		.jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
		.toFile(output);
	console.log(`Wrote ${path.relative(process.cwd(), output)} (${HEADER_IMAGE_WIDTH}×${HEADER_IMAGE_HEIGHT})`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
