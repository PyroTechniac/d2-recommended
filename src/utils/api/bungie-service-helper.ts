import { type HttpClient, type HttpClientConfig } from 'bungie-api-ts/http';
import { infoLog } from '..';
import {
	createFetchWithNonStoppingTimeout,
	createHttpClient,
	responsivelyThrottleHttpClient,
} from './http-client';
import throttle from 'lodash/throttle';

const TIMEOUT = 15000;
const notifyTimeout = throttle((startTime: number, timeout: number) => {
	if (navigator.onLine && Math.abs(Date.now() - (startTime + timeout)) <= 1000) {
		infoLog('bungie api', 'Bungie API is being slow right now.');
	}
});

const logThrottle = (timesThrottled: number, waitTime: number, url: string): void =>
	infoLog(
		'bungie api',
		'Throttled',
		timesThrottled,
		'times, waiting',
		waitTime,
		'ms before calling',
		url,
	);

const errorHandledHttpClient =
	(httpClient: HttpClient): HttpClient =>
	async (config: HttpClientConfig) =>
		httpClient(config);

export const unauthenticatedHttpClient = errorHandledHttpClient(
	responsivelyThrottleHttpClient(
		createHttpClient(
			createFetchWithNonStoppingTimeout(fetch, TIMEOUT, notifyTimeout),
			import.meta.env.VITE_API_KEY,
		),
		logThrottle,
	),
);
