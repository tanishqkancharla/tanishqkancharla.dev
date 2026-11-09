import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { buildResumes, readContent, contentPath, renderResumePDF } from "./draft";

const output = path.resolve(".amp/in/artifacts/resumes");
const token = randomBytes(32).toString("hex");
let saving = false;

async function main() {
	await buildResumes();
	createServer(async (request, response) => {
		const reply = (status: number, body: object) => {
			response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
			response.end(JSON.stringify(body));
		};
		try {
			const url = new URL(request.url ?? "/", "http://localhost");
			if (request.method === "GET" && url.pathname === "/api/save-token") return reply(200, { token });
			if (request.method === "POST" && url.pathname === "/api/edits") {
				// Pages receive a per-process token; cross-origin sites cannot read it.
				if (request.headers["x-resume-token"] !== token) return reply(403, { error: "Reopen the portal before saving." });
				if (saving) return reply(409, { error: "Another save is in progress. Please try again." });
				request.setEncoding("utf8");
				const chunks: string[] = [];
				let size = 0;
				for await (const chunk of request) {
					size += Buffer.byteLength(chunk);
					if (size > 65536) return reply(413, { error: "Edits are too large to save." });
					chunks.push(chunk);
				}
				let payload;
				try { payload = JSON.parse(chunks.join("")); }
				catch { return reply(400, { error: "Invalid edit data." }); }
				if (!Array.isArray(payload?.edits) || payload.edits.length > 100) return reply(400, { error: "Invalid edit data." });
				// Lock before the first read so simultaneous tabs cannot overwrite a save.
				if (saving) return reply(409, { error: "Another save is in progress. Please try again." });
				saving = true;
				try {
					const content = await readContent();
					for (const edit of payload.edits) {
						if (typeof edit?.field !== "string" || typeof edit.before !== "string" || typeof edit.value !== "string" || edit.value.length > 10000) return reply(400, { error: "Invalid edit data." });
						const keys = edit.field.split(".");
						let target: any = content;
						for (const key of keys.slice(0, -1)) {
							if (!target || typeof target !== "object" || !Object.hasOwn(target, key)) return reply(400, { error: "Unknown résumé field." });
							target = target[key];
						}
						const key = keys[keys.length - 1];
						if (!target || typeof target !== "object" || !Object.hasOwn(target, key) || typeof target[key] !== "string" || key === "url") return reply(400, { error: "Unknown résumé field." });
						if (target[key] !== edit.before) return reply(409, { error: "This text changed in another tab. Copy your edits, then refresh to merge them." });
						target[key] = edit.value;
					}
					await fs.writeFile(contentPath + ".tmp", JSON.stringify(content, null, "\t") + "\n");
					await fs.rename(contentPath + ".tmp", contentPath);
					await buildResumes(content);
					return reply(200, { saved: true });
				} finally { saving = false; }
			}
			if (request.method !== "GET" && request.method !== "HEAD") return reply(405, { error: "Method not allowed." });
			if (url.pathname.startsWith("/api/pdf/")) {
				const variant = url.pathname.slice("/api/pdf/".length);
				if (!Object.hasOwn((await readContent()).variants, variant)) return reply(404, { error: "Unknown résumé version." });
				const html = await fs.readFile(path.join(output, `tanishq-${variant}.html`), "utf8");
				const pdf = await renderResumePDF(html);
				response.writeHead(200, { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="Tanishq-Kancharla-${variant}.pdf"`, "Cache-Control": "no-store" });
				response.end(request.method === "HEAD" ? undefined : pdf);
				return;
			}
			const filename = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
			if (!/^[a-z0-9-]+\.(html|pdf|png|webp|mp4)$/.test(filename)) return reply(404, { error: "Not found." });
			let data: Buffer;
			try { data = await fs.readFile(path.join(output, filename)); }
			catch (error: any) { if (error.code === "ENOENT") return reply(404, { error: "Not found." }); throw error; }
			const types: Record<string, string> = { ".html": "text/html; charset=utf-8", ".pdf": "application/pdf", ".png": "image/png", ".webp": "image/webp", ".mp4": "video/mp4" };
			if (filename.endsWith(".html")) data = Buffer.from(data.toString().replace("</head>", `<meta name="resume-save-token" content="${token}"></head>`));
			response.writeHead(200, { "Content-Type": types[path.extname(filename)], "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
			response.end(request.method === "HEAD" ? undefined : data);
		} catch (error) {
			console.error(error);
			reply(500, { error: "Could not finish saving. Keep your edits and try again." });
		}
	}).listen(Number(process.env.PORT ?? 30871), "0.0.0.0", () => console.log("Résumé editor ready"));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
