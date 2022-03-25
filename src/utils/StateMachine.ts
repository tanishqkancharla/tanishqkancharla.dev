import { mapValues } from "remeda";

export type TupleRest<T extends unknown[]> = T extends [any, ...infer U]
	? U
	: never;

export type AnyReducers<S> = { [key: string]: (state: S, ...args: any[]) => S };

export type Actions<R extends AnyReducers<any>> = {
	[K in keyof R]: { fn: K; args: TupleRest<Parameters<R[K]>> };
}[keyof R];

export type Dispatcher<R extends AnyReducers<any>> = {
	[K in keyof R]: (...args: TupleRest<Parameters<R[K]>>) => void;
};

export type EffectPlugin<S, R extends AnyReducers<S>> = (
	app: StateMachine<S, R>
) => Effect<S>;

export type Effect<S> = {
	update(prevState: S): void;
	destroy(): void;
};

export class StateMachine<S, R extends AnyReducers<S>> {
	private effects: Effect<S>[] = [];

	constructor(public state: S, private reducers: R) {}

	public plug(effect: Effect<S>): this {
		this.effects.push(effect);
		return this;
	}

	private onDispatches = new Set<(action: Actions<R>) => void>();

	// Override this function to log or pipe actions elsewhere.
	public onDispatch(fn: (action: Actions<R>) => void) {
		this.onDispatches.add(fn);
		return () => this.onDispatches.delete(fn);
	}

	public dispatchAction(action: Actions<R>) {
		this.actions.push(action);
		this.onDispatches.forEach((fn) => fn(action));
		if (!this.running) {
			this.running = true;
			this.flush();
		}
	}

	// Using a Proxy so that you can cmd-click on a dispatched action to find the reducer.
	public dispatch = (() => {
		const self = this;
		return new Proxy(
			{},
			{
				get(target, fn: any, receiver) {
					return (...args: any[]) => self.dispatchAction({ fn, args } as any);
				},
			}
		);
	})() as Dispatcher<R>;

	private running = false;
	private actions: Actions<R>[] = [];
	private flush() {
		if (this.actions.length === 0) {
			this.running = false;
			this.listeners.forEach((fn) => fn());
			return;
		}
		const action = this.actions.shift()!;
		const prevState = this.state;
		this.state = this.reducers[action.fn](prevState, ...action.args);
		for (const effect of this.effects) {
			effect.update(prevState);
		}
		this.flush();
	}

	public destroy() {
		for (const effect of this.effects) {
			effect.destroy();
		}
	}

	private listeners = new Set<() => void>();

	/**
	 * Listener is called after all dispatches are processed. Make sure you use the
	 * plugin argument if you want to compare with previous state for an effect.
	 */
	public addListener(listener: () => void) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
}

export type LiftedReducers<A, B, R extends AnyReducers<B>> = {
	[K in keyof R]: (state: A, ...args: TupleRest<Parameters<R[K]>>) => A;
};

export type Lens<A, B> = {
	get: (a: A) => B;
	set: (a: A, b: B) => A;
};

export function liftReducers<A, B, R extends AnyReducers<B>>(
	lens: Lens<A, B>,
	reducers: R
): LiftedReducers<A, B, R> {
	const newReducers: AnyReducers<A> = {};

	for (const [key, fn] of Object.entries(reducers)) {
		newReducers[key] = (state, ...args) => {
			return lens.set(state, fn(lens.get(state), ...args));
		};
	}

	return newReducers as any;
}

export function createDispatches<S, R extends AnyReducers<S>>(
	reducers: R,
	getState: () => S,
	setState: (state: S) => void
): Dispatcher<R> {
	return mapValues(reducers, (reducer) => {
		return (...args: any[]) => {
			const prevState = getState();
			const nextState = (reducer as any)(prevState, ...args);
			setState(nextState);
		};
	}) as any;
}

// export function useSelectObj<S, T>(
// 	service: { state: S; addListener: (fn: (state: S) => void) => () => void },
// 	selector: (state: S) => T,
// 	deps: any[] = []
// ) {
// 	const [state, setState] = useState(selector(service.state))
// 	// This might rerender too much... does useState do a === check?
// 	useEffect(
// 		() =>
// 			service.addListener((state) => {
// 				setState(selector(state))
// 			}),
// 		deps
// 	)
// 	return state
// }
