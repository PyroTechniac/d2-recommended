export * from './api';
export * from './error';
export * from './log';

export const convertToError = (e: unknown): Error =>
	e instanceof Error ? e : new Error(JSON.stringify(e));

export const sleep = (ms: number): Promise<void> =>
	new Promise((resolve): void => {
		setTimeout(resolve, ms);
	});
