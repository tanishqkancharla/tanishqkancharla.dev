export type Result<T> =
	| {
			type: "success";
			value: T;
	  }
	| {
			type: "error";
			error: string;
	  };

export function success<T>(value: T): Result<T> {
	return { type: "success", value };
}

export function error<T>(error: string): Result<T> {
	return { type: "error", error };
}
