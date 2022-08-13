import { useEffect, useRef, useState } from "react";

type AsyncState<T> = {
	fetching: boolean;
	data?: T;
	error?: any;
};

export function useAsync<T>(fn: () => Promise<T>, dependencies: Array<any>) {
	const [state, setState] = useState<AsyncState<T>>({ fetching: true });

	// Only setState if its the current request.
	const requestCount = useRef(0);

	useEffect(() => {
		let canceled = false;
		// Set fetching state.
		if (!state.fetching) {
			setState({ ...state, fetching: true });
		}

		// Keep track of the request count so we don't setState from previous hung requests.
		requestCount.current += 1;
		const current = requestCount.current;
		fn()
			.then((data) => {
				if (requestCount.current === current) {
					if (canceled) return;
					setState({ fetching: false, data });
				}
			})
			.catch((error) => {
				if (requestCount.current === current) {
					if (canceled) return;
					setState((state) => ({ ...state, fetching: false, error }));
				}
			});
		return () => {
			canceled = true;
		};
	}, dependencies);

	return state;
}
