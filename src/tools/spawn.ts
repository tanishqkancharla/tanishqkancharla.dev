import * as child_process from "child_process";

export function spawn(
	cmd: string,
	args: Array<string>,
	options?: { cwd?: string }
) {
	console.log(`+ ${cmd} ${args.join(" ")}`);

	const child = child_process.spawn(cmd, args, {
		cwd: options?.cwd,
		stdio: ["inherit", "inherit", "inherit"],
	});

	// Kill the child process when the main process exits.
	const onExit = () => child.kill();
	process.on("exit", onExit);

	const promise = new Promise<void>((resolve, reject) => {
		child.on("error", (err) => {
			process.off("exit", onExit);
			reject(err);
		});

		child.on("exit", (code, signal) => {
			process.off("exit", onExit);
			if (code !== 0) {
				reject(
					new Error(`Unexpected exit code ${code}. "${cmd} ${args.join(" ")}"`)
				);
			}
			resolve();
		});
	});

	return { kill: (exitCode: NodeJS.Signals) => child.kill(exitCode) };
}
