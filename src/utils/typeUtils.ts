export type Success<T> = Readonly<{
	type: "success";
	value: T;
}>;

export type Error = Readonly<{
	type: "error";
	error: string;
}>;

export type Result<T> = Success<T> | Error;

export function success<T>(value: T): Result<T> {
	return { type: "success", value };
}

export function error<T>(error: string): Result<T> {
	return { type: "error", error };
}

export function isSuccess<T>(result: Result<T>): result is Success<T> {
	return result.type === "success";
}

export function isError<T>(result: Result<T>): result is Error {
	return result.type === "error";
}

export function isDefined<T>(val: T): val is Exclude<T, undefined> {
	return val !== undefined;
}

export function map<T, S>(result: Result<T>, fn: (arg: T) => S): Result<S> {
	if (result.type === "error") return result;
	return success(fn(result.value));
}

export function bimap<T, S>(
	result: Result<T>,
	successFn: (arg: T) => S,
	errorFn: (arg: string) => string
): Result<S> {
	if (result.type === "error") return error(errorFn(result.error));
	return success(successFn(result.value));
}

export type Date = { year: number; month: number };

export function sortByDate<T extends { date: Date }>(items: T[]) {
	return items.sort((a, b) => {
		// sort from most recent to least recent
		if (a.date.year !== b.date.year) return b.date.year - a.date.year;
		else return b.date.month - a.date.month;
	});
}
