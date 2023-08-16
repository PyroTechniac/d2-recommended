export interface LogFunction {
	(tag: string, message: unknown, ...args: unknown[]): void;
}

export const infoLog: LogFunction = (tag: string, message: unknown, ...args: unknown[]): void =>
	console.log(`[${tag}]`, message, ...args);

export const warnLog: LogFunction = (tag: string, message: unknown, ...args: unknown[]): void =>
	console.warn(`[${tag}]`, message, ...args);

export const warnLogCollapsedStack: LogFunction = (
	tag: string,
	message: unknown,
	...args: unknown[]
): void => {
	console.groupCollapsed(`[${tag}]`, message);
	console.warn(`[${tag}]`, message, ...args);
	console.groupEnd();
};

export const errorLog: LogFunction = (tag: string, message: unknown, ...args: unknown[]): void =>
	console.error(`[${tag}]`, message, ...args);

export const timer = (tag: string): (() => void) => {
	console.time(tag);
	return () => console.timeEnd(tag);
};
