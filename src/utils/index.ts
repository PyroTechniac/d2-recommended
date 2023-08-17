export * from './api';
export * from './error';
export * from './log';

export const convertToError = (e: unknown): Error =>
	e instanceof Error ? e : new Error(JSON.stringify(e));

export const sleep = (ms: number): Promise<void> =>
	new Promise((resolve): void => {
		setTimeout(resolve, ms);
	});

export const dedupPromise = <T extends unknown[], K>(
	func: (...args: T) => Promise<K>,
): ((...args: T) => Promise<K>) => {
	let promiseCache: Promise<K> | null = null;
	return async (...args: T): Promise<K> => {
		if (promiseCache) return promiseCache;

		promiseCache = func(...args);

		try {
			return await promiseCache;
		} finally {
			promiseCache = null;
		}
	};
};
