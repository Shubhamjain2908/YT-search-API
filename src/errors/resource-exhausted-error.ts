import { CustomError } from "./custom-error";

export class ResourceExhaustedError extends CustomError {
	statusCode = 403;

	constructor() {
		super("API quota is exhausted");

		Object.setPrototypeOf(this, ResourceExhaustedError.prototype);
	}

	serializeErrors() {
		return [{ message: "API quota is exhausted" }];
	}
}
