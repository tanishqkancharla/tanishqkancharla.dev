{
	const fields = [...document.querySelectorAll("[data-field]")];
	const saved = new Map(fields.map((el) => [el.dataset.field, el.innerText]));
	const save = document.querySelector("#save-edits");
	const discard = document.querySelector("#discard-edits");
	const message = document.querySelector("#save-status");
	const token = document.querySelector('meta[name="resume-save-token"]')?.content;
	let saving = false;
	const changes = () => fields.filter((el) => el.innerText !== saved.get(el.dataset.field));
	const update = () => {
		const dirty = changes().length > 0;
		save.disabled = !dirty || saving || !token;
		discard.disabled = !dirty || saving;
		return dirty;
	};
	if (!token) message.textContent = "To save edits, open this résumé in the live portal.";
	document.querySelector("#download-pdf").addEventListener("click", (event) => {
		if (changes().length > 0 || saving || !token) {
			event.preventDefault();
			message.textContent = token ? "Save or discard your edits before downloading the PDF." : "Open the live portal to download a PDF.";
		}
	});
	document.querySelector("main").addEventListener("input", () => {
		if (update()) message.textContent = token ? "Unsaved edits. Shared details update every version; tailored copy applies only to this version." : "Edits are not saved. Open the live portal to save back to the source file.";
		else message.textContent = "No unsaved edits.";
	});
	// Plain clicks edit text; Ctrl/Cmd-click still opens its link.
	document.querySelector("main").addEventListener("click", (event) => {
		const link = event.target.closest("a");
		if (!link) return;
		event.preventDefault();
		if (event.ctrlKey || event.metaKey) window.open(link.href, "_blank", "noopener");
	});
	window.addEventListener("beforeunload", (event) => {
		if (changes().length > 0 || saving) {
			event.preventDefault();
			event.returnValue = "";
		}
	});
	discard.addEventListener("click", () => {
		for (const el of fields) el.textContent = saved.get(el.dataset.field);
		message.textContent = "Unsaved edits discarded.";
		update();
	});
	save.addEventListener("click", async () => {
		const edits = changes().map((el) => ({
			field: el.dataset.field,
			before: saved.get(el.dataset.field),
			value: el.innerText,
		}));
		if (!edits.length || saving) return;
		saving = true;
		for (const el of fields) el.contentEditable = "false";
		update();
		message.textContent = "Saving…";
		try {
			// A server restart must not force an open tab to lose its edits.
			const tokenResponse = await fetch("/api/save-token", { cache: "no-store" });
			if (!tokenResponse.ok) throw new Error("Could not connect to the résumé editor.");
			const current = await tokenResponse.json();
			const response = await fetch("/api/edits", {
				method: "POST",
				headers: { "Content-Type": "application/json", "X-Resume-Token": current.token },
				body: JSON.stringify({ edits }),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "Could not save.");
			for (const el of fields) saved.set(el.dataset.field, el.innerText);
			message.textContent = "Saved to resume/content.json. All HTML versions rebuilt.";
		} catch (error) {
			message.textContent = `${error.message} Your edits are still here; copy them before refreshing.`;
		} finally {
			saving = false;
			for (const el of fields) el.contentEditable = "plaintext-only";
			update();
		}
	});
}
