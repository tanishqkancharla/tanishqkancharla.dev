import ParcelWatcher from "@parcel/watcher";
import fs from "fs-extra";
import path from "path";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Reconciler, { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";

type FSInstance = FSDirInstance | FSFileInstance;

class FSDirInstance {
	type = "directory" as const;
	private mounted: boolean = false;
	children: FSInstance[] = [];
	private parentDir: string | undefined = undefined;

	constructor(public name: string) {}

	appendChild(child: FSInstance) {
		this.children.push(child);

		if (this.mounted && this.parentDir) {
			const dirPath = path.join(this.parentDir, this.name);
			child.mount(dirPath);
		}
	}

	move(newName: string) {
		this.name = newName;
		if (!this.parentDir) return;
		const oldPath = path.join(this.parentDir, this.name);
		const newPath = path.join(this.parentDir, newName);
		if (this.mounted) {
			fs.moveSync(oldPath, newPath, { overwrite: true });
		}
	}

	removeChild(child: FSInstance) {
		this.children = this.children.filter((value) => value !== child);
	}

	mount(rootDir: string) {
		const dirPath = path.join(rootDir, this.name);
		fs.ensureDirSync(dirPath);

		for (const instance of this.children) {
			instance.mount(dirPath);
		}

		this.mounted = true;
		this.parentDir = rootDir;
	}

	unmount() {
		if (!this.mounted || !this.parentDir) return;
		const dirPath = path.join(this.parentDir, this.name);

		fs.rmdirSync(dirPath);
		this.mounted = false;
		this.parentDir = undefined;
	}
}

class FSTextInstance {
	type = "text" as const;
	private mounted: boolean = false;
	private parentFilePath: string | undefined = undefined;

	constructor(public value: string) {}

	mount(filePath: string) {
		fs.writeFileSync(filePath, this.value);
		this.mounted = true;
		this.parentFilePath = filePath;
	}

	setValue(value: string) {
		this.value = value;
		if (this.mounted && this.parentFilePath) {
			fs.writeFileSync(this.parentFilePath, this.value);
		}
	}
}

class FSFileInstance {
	type = "file" as const;
	private mounted: boolean = false;
	private parentDir: string | undefined = undefined;
	public contents: FSTextInstance | undefined = undefined;

	constructor(public name: string) {}

	move(newName: string) {
		this.name = newName;
		if (!this.parentDir) return;
		const oldPath = path.join(this.parentDir, this.name);
		const newPath = path.join(this.parentDir, newName);
		if (this.mounted) {
			fs.removeSync(oldPath);
			this.contents?.mount(newPath);
		}
	}

	setContents(contents: FSTextInstance) {
		this.contents = contents;
	}

	mount(parentDir: string) {
		const filePath = path.join(parentDir, this.name);
		fs.ensureFileSync(filePath);
		this.contents?.mount(filePath);

		this.mounted = true;
		this.parentDir = parentDir;
	}

	unmount() {
		if (!this.mounted || !this.parentDir) return;
		const filePath = path.join(this.parentDir, this.name);

		fs.rmSync(filePath);
		this.mounted = false;
		this.parentDir = undefined;
	}
}

type ReactFSElement = {
	directory: {
		name: string;
		children?: JSX.Element | JSX.Element[];
	};
	file: {
		name: string;
		children?: string | null;
	};
};

type Type = "directory" | "file";
type Props = { name: string };
type Container = {
	type: "root";
	dirPath: string;
	children: FSInstance[];
};
type Instance = FSInstance;
type TextInstance = FSTextInstance;

type SuspenseInstance = never;
type HydratableInstance = never;
type PublicInstance = Instance | string;
type HostContext = any;
type UpdatePayload = void;
type ChildSet = void;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = number;

function appendChild(
	parentInstance: FSInstance,
	child: FSTextInstance | FSInstance
) {
	if (parentInstance.type === "file") {
		if (child.type !== "text") {
			throw new Error(
				"Non-text contents found inside file: Can only place text contents inside files"
			);
		}
		parentInstance.setContents(child);
		return;
	}
	if (child.type === "text") {
		throw new Error(
			"Text contents found inside directory: Can only place files or directories inside directories"
		);
	}
	parentInstance.appendChild(child);
}

const hostConfig: HostConfig<
	Type,
	Props,
	Container,
	Instance,
	TextInstance,
	SuspenseInstance,
	HydratableInstance,
	PublicInstance,
	HostContext,
	UpdatePayload,
	ChildSet,
	TimeoutHandle,
	NoTimeout
> = {
	supportsMutation: true,
	supportsPersistence: false,
	supportsHydration: false,
	warnsIfNotActing: true,

	createInstance(type, { name }): Instance {
		if (type === "directory") {
			return new FSDirInstance(name);
		}

		return new FSFileInstance(name);
	},
	createTextInstance(text) {
		return new FSTextInstance(text);
	},
	commitTextUpdate(instance, oldText, newText) {
		instance.setValue(newText);
	},
	appendChildToContainer(container, child) {
		if (child.type === "text")
			throw new Error("Can't attach text as children to root directory");

		container.children.push(child);
		child.mount(container.dirPath);
	},
	appendInitialChild: appendChild,
	appendChild,
	finalizeInitialChildren() {
		return false;
	},
	removeChild(parentInstance, child) {
		if (parentInstance.type === "file" || child.type === "text") return;
		parentInstance.removeChild(child);
	},
	prepareUpdate(instance, type, oldProps, newProps) {
		// return { oldProps, newProps };
	},
	commitUpdate(instance, payload, type, prevProps, nextProps) {
		if (prevProps.name !== nextProps.name) {
			instance.move(nextProps.name);
		}
	},
	clearContainer(container) {
		container.children = [];
		fs.emptyDirSync(container.dirPath);
	},
	shouldSetTextContent(type) {
		return false;
	},
	resetTextContent(instance) {
		if (instance.type === "file") instance.contents?.setValue("");
	},
	getRootHostContext(rootContainer) {
		return rootContainer;
	},
	getChildHostContext(parentHostContext) {
		return parentHostContext;
	},
	getPublicInstance(instance) {
		if (instance.type === "text") return instance.value;
		return instance;
	},
	prepareForCommit() {
		return null;
	},

	resetAfterCommit() {},
	preparePortalMount() {},

	scheduleTimeout(fn, ms) {
		return setTimeout(fn, ms);
	},
	cancelTimeout(id) {
		clearTimeout(id);
	},
	noTimeout: -1,
	isPrimaryRenderer: false,
	getCurrentEventPriority() {
		return DefaultEventPriority;
	},
	getInstanceFromNode(node) {
		return null;
	},
	beforeActiveInstanceBlur() {},
	afterActiveInstanceBlur() {},

	prepareScopeUpdate(scopeInstance: any, instance: any) {},
	getInstanceFromScope(scopeInstance: any) {
		throw new Error("Function not implemented.");
	},
	detachDeletedInstance(node) {
		node.unmount();
	},
};

const reconciler = Reconciler(hostConfig);

type FileSystemSubscription = {
	path: string;
	callback: () => void;
};

class FileSystemWatcher {
	private subscriptions: FileSystemSubscription[] = [];
	private dirSubscription: ParcelWatcher.AsyncSubscription | undefined =
		undefined;

	constructor(public dirPath: string) {}

	callback: ParcelWatcher.SubscribeCallback = (err, events) => {
		if (err) throw err;
		for (const event of events) {
			for (const subscription of this.subscriptions) {
				if (event.path === subscription.path) subscription.callback();
			}
		}
	};

	subscribe = (relativePath: string, callback: () => void) => {
		const entityPath = path.join(this.dirPath, relativePath);
		const subscription = { path: entityPath, callback };
		this.subscriptions.push(subscription);

		return () => {
			this.subscriptions = this.subscriptions.filter(
				(value) => value !== subscription
			);
		};
	};

	mount = async () => {
		this.dirSubscription = await ParcelWatcher.subscribe(
			this.dirPath,
			this.callback
		);
	};

	unmount = async () => {
		await this.dirSubscription?.unsubscribe();
	};
}

const SourceFileSystemContext = createContext<FileSystemWatcher | undefined>(
	undefined
);

export const ReactFS = {
	/** Run this build system */
	async build(
		component: React.ReactElement,
		srcPath: string,
		buildPath: string
	) {
		const root = reconciler.createContainer(
			{
				type: "root",
				dirPath: buildPath,
				children: [],
			},
			0,
			null,
			false,
			null,
			"",
			console.error,
			null
		);
		const watcher = new FileSystemWatcher(path.resolve(srcPath));
		await watcher.mount();

		reconciler.updateContainer(
			<SourceFileSystemContext.Provider value={watcher}>
				<ErrorBoundary fallbackRender={() => null}>{component}</ErrorBoundary>
			</SourceFileSystemContext.Provider>,
			root,
			null,
			async () => {
				// Unmount after render, to only build once.
				await watcher.unmount();
			}
		);
	},

	/** Start a dev server, watching the src directory for changes */
	async dev(component: React.ReactElement, srcPath: string, buildPath: string) {
		const root = reconciler.createContainer(
			{
				type: "root",
				dirPath: buildPath,
				children: [],
			},
			0,
			null,
			false,
			null,
			"",
			console.error,
			null
		);
		const watcher = new FileSystemWatcher(path.resolve(srcPath));
		await watcher.mount();

		reconciler.updateContainer(
			<SourceFileSystemContext.Provider value={watcher}>
				{component}
			</SourceFileSystemContext.Provider>,
			root,
			null
		);

		return {
			// Unmounting the watcher will automatically unload the file.
			unmount: watcher.unmount,
		};
	},
};

export function useFile(filePath: string): string {
	const watcher = useContext(SourceFileSystemContext);
	if (!watcher) throw new Error("Expected SourceFileSystemContext");

	const absoluteFilePath = path.join(watcher.dirPath, filePath);

	const [contents, setContents] = useState(() =>
		fs.readFileSync(absoluteFilePath, "utf-8")
	);

	useEffect(() => {
		const destroy = watcher.subscribe(absoluteFilePath, () => {
			setContents(fs.readFileSync(absoluteFilePath, "utf-8"));
		});

		return destroy;
	}, [absoluteFilePath]);

	return contents;
}

type DirContents = {
	files: string[];
	dirs: string[];
};

function getDirContents(absoluteDirPath: string) {
	const files: string[] = [];
	const dirs: string[] = [];

	fs.readdirSync(absoluteDirPath).map((name) => {
		const absolutePath = path.join(absoluteDirPath, name);
		const stats = fs.statSync(absolutePath);

		if (stats.isFile()) {
			files.push(absolutePath);
		} else {
			dirs.push(absolutePath);
		}
	});

	return { files, dirs };
}

export function useDirectory(dirPath: string): DirContents {
	const watcher = useContext(SourceFileSystemContext);
	if (!watcher) throw new Error("Expected SourceFileSystemContext");

	const absoluteDirPath = path.join(watcher.dirPath, dirPath);

	const [contents, setContents] = useState(() =>
		getDirContents(absoluteDirPath)
	);

	useEffect(() => {
		const destroy = watcher.subscribe(dirPath, () => {
			setContents(getDirContents(absoluteDirPath));
		});

		return destroy;
	}, [absoluteDirPath]);

	return contents;
}

declare global {
	namespace JSX {
		interface IntrinsicElements extends ReactFSElement {}
	}
}
