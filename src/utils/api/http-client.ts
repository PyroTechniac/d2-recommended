import {
	type HttpClient,
	type HttpClientConfig,
	PlatformErrorCodes,
	type ServerResponse,
} from 'bungie-api-ts/destiny2';
import { convertToError, sleep } from '..';

export class HttpStatusError extends Error {
	public status: number;

	public constructor(
		response: Response,
		public responseBody?: string,
	) {
		super(responseBody ?? response.statusText);
		this.status = response.status;
	}
}

export const toHttpStatusError = async (response: Response): Promise<HttpStatusError> => {
	try {
		const responseBody = await response.text();
		return new HttpStatusError(response, responseBody);
	} catch (_e) {
		return new HttpStatusError(response);
	}
};

export class BungieError extends Error {
	public code?: PlatformErrorCodes;
	public status?: string;
	public endpoint?: string;

	public constructor(
		response: Partial<Pick<ServerResponse<unknown>, 'Message' | 'ErrorCode' | 'ErrorStatus'>>,
		request: Request,
	) {
		super(response.Message ?? 'Unknown Bungie Error');
		this.name = 'BungieError';
		this.code = response.ErrorCode;
		this.status = response.ErrorStatus;
		this.endpoint = request.url;
	}
}

export const throwHttpError = async (response: Response): Promise<void | never> => {
	if (response.status < 200 || response.status >= 400) {
		throw await toHttpStatusError(response);
	}
};

const throwBungieError = <T>(
	serverResponse: T | undefined,
	request: Request,
): T | undefined | never => {
	if (!serverResponse || typeof serverResponse !== 'object') {
		return serverResponse;
	}

	const eMessage =
		'error' in serverResponse &&
		'error_description' in serverResponse &&
		(serverResponse.error_description as string);
	if (eMessage) {
		throw new BungieError(
			{
				Message: eMessage,
				ErrorCode: PlatformErrorCodes.DestinyUnexpectedError,
				ErrorStatus: eMessage,
			},
			request,
		);
	}

	if ('ErrorCode' in serverResponse && serverResponse.ErrorCode !== PlatformErrorCodes.Success) {
		throw new BungieError(serverResponse as Partial<ServerResponse<unknown>>, request);
	}

	return serverResponse;
};

export const createFetchWithTimeout =
	(fetchFunction: typeof fetch, timeout: number): typeof fetch =>
	async (...[input, init]: Parameters<typeof fetch>) => {
		const controller = typeof AbortController === 'function' ? new AbortController() : null;
		const signal = controller?.signal;
		let timer: NodeJS.Timeout | undefined = undefined;

		if (controller) {
			timer = setTimeout(() => controller.abort(), timeout);
			if (typeof input === 'string') {
				input = new Request(input);
			}

			init = { ...init, signal };
		}

		try {
			return await fetchFunction(input, init);
		} finally {
			if (timer !== undefined) {
				clearTimeout(timer);
			}
		}
	};

export const createFetchWithNonStoppingTimeout =
	(
		fetchFunction: typeof fetch,
		timeout: number,
		onTimeout: (startTime: number, timeout: number) => void,
	): typeof fetch =>
	async (...[input, init]: Parameters<typeof fetch>) => {
		const startTime = Date.now();
		const timer = setTimeout(() => onTimeout(startTime, timeout), timeout);

		try {
			return await fetchFunction(input, init);
		} finally {
			if (timer !== undefined) {
				clearTimeout(timer);
			}
		}
	};

export const createHttpClient =
	(fetchFunction: typeof fetch, apiKey: string): HttpClient =>
	async <T>(config: HttpClientConfig) => {
		let url = config.url;
		if (config.params) {
			url = `${url}${new URLSearchParams(config.params).toString()}`;
		}

		url = `${url}?d2-recommended`;

		const fetchOptions = new Request(url, {
			method: config.method,
			body: config.body ? JSON.stringify(config.body) : undefined,
			headers: {
				'X-API-Key': apiKey,
				...(config.body ? { 'Content-Type': 'application/json' } : undefined),
			},
			credentials: 'omit',
		});
		console.log(fetchOptions);
		console.log([...fetchOptions.headers]);
		const response = await fetchFunction(fetchOptions);
		console.log(response);
		console.log([...response.headers]);
		let data: T | undefined;
		let parseError: Error | undefined;
		try {
			data = (await response.json()) as T;
		} catch (e) {
			parseError = convertToError(e);
		}

		throwBungieError(data, fetchOptions);

		await throwHttpError(response);

		if (parseError) throw parseError;

		return data!;
	};

let timesThrottled = 0;

export const responsivelyThrottleHttpClient =
	(
		httpClient: HttpClient,
		onThrottle: (timesThrottled: number, waitTime: number, url: string) => void,
	) =>
	async <T>(config: HttpClientConfig): Promise<T> => {
		if (timesThrottled > 0) {
			const waitTime = Math.min(5 * 60 * 1000, Math.pow(2, timesThrottled) * 500);
			onThrottle(timesThrottled, waitTime, config.url);
			await sleep(waitTime);
		}

		try {
			const result = await httpClient<T>(config);
			timesThrottled = Math.floor(timesThrottled / 2);

			return result;
		} catch (e) {
			if (e instanceof BungieError) {
				switch (e.code) {
					case PlatformErrorCodes.ThrottleLimitExceededMinutes:
					case PlatformErrorCodes.ThrottleLimitExceededMomentarily:
					case PlatformErrorCodes.ThrottleLimitExceededSeconds:
					case PlatformErrorCodes.DestinyThrottledByGameServer:
					case PlatformErrorCodes.PerApplicationThrottleExceeded:
					case PlatformErrorCodes.PerApplicationAnonymousThrottleExceeded:
					case PlatformErrorCodes.PerApplicationAuthenticatedThrottleExceeded:
					case PlatformErrorCodes.PerUserThrottleExceeded:
						timesThrottled++;
						break;
					default:
						break;
				}
			}

			throw e;
		}
	};
