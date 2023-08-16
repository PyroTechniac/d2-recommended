import { type HttpClient, type HttpClientConfig } from 'bungie-api-ts/http';
import { RecommendedError, errorLog, infoLog } from '..';
import {
	BungieError,
	HttpStatusError,
	createFetchWithNonStoppingTimeout,
	createHttpClient,
	responsivelyThrottleHttpClient,
} from './http-client';
import throttle from 'lodash/throttle';
import { PlatformErrorCodes } from 'bungie-api-ts/destiny2';

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

const errorHandledHttpClient = (httpClient: HttpClient): HttpClient => async (config: HttpClientConfig) => {
	try {
		return await httpClient(config);
	} catch (e) {
		handleErrors(e);
		throw new RecommendedError('Difficulties'); // this site is not reachable.
	}
}


const handleErrors = (error: unknown): never => {
	if (error instanceof DOMException && error.name === "AbortError") {
		throw (
			navigator.onLine
				? new RecommendedError('SlowResponse')
				: new RecommendedError('NotConnected')
		)
			.withError(error);
	}

	if (error instanceof SyntaxError) {
		errorLog('bungie api', 'Error parsing Bungie.net response', error);
		throw new RecommendedError('Difficulties').withError(error);
	}

	if (error instanceof TypeError) {
		throw (
			navigator.onLine
				? new RecommendedError('NotConnectedOrBlocked')
				: new RecommendedError('NotConnected')
		).withError(error);
	}

	if (error instanceof HttpStatusError) {
		if (error.status === -1) {
			throw (
				navigator.onLine
					? new RecommendedError('NotConnectedOrBlocked')
					: new RecommendedError('NotConnected')
			).withError(error);
		}

		if (error.status === 401 || error.status === 403) {
			throw new RecommendedError('NotLoggedIn').withError(error);
		}

		if (error.status >= 502 && error.status <= 526) {
			throw new RecommendedError('Difficulties').withError(error);
		}

		throw new RecommendedError('NetworkError', error.status, error.message);
	}

	if (error instanceof BungieError) {
		switch (error.code ?? -1) {
			case PlatformErrorCodes.DestinyVendorNotFound:
				throw new RecommendedError('VendorNotFound').withError(error);
			case PlatformErrorCodes.AuthorizationCodeInvalid:
			case PlatformErrorCodes.AccessNotPermittedByApplicationScope:
				throw new RecommendedError('AppNotPermitted').withError(error);
			case PlatformErrorCodes.SystemDisabled:
				throw new RecommendedError('Maintenance').withError(error);
			case PlatformErrorCodes.ThrottleLimitExceededMinutes:
			case PlatformErrorCodes.ThrottleLimitExceededMomentarily:
			case PlatformErrorCodes.ThrottleLimitExceededSeconds:
			case PlatformErrorCodes.DestinyThrottledByGameServer:
			case PlatformErrorCodes.PerApplicationThrottleExceeded:
			case PlatformErrorCodes.PerApplicationAnonymousThrottleExceeded:
			case PlatformErrorCodes.PerApplicationAuthenticatedThrottleExceeded:
			case PlatformErrorCodes.PerUserThrottleExceeded:
				throw new RecommendedError('Throttled').withError(error);
			case PlatformErrorCodes.AccessTokenHasExpired:
			case PlatformErrorCodes.WebAuthRequired:
			case PlatformErrorCodes.WebAuthModuleAsyncFailed:
				throw new RecommendedError('NotLoggedIn').withError(error);
			case PlatformErrorCodes.DestinyAccountNotFound:
				if (error.endpoint?.includes('/Account/') && !error.endpoint.includes('/Character/')) {
					throw new RecommendedError('NoAccount').withError(error);
				} else {
					throw new RecommendedError('Difficulties').withError(error);
				}
			case PlatformErrorCodes.DestinyLegacyPlatformInaccessible:
				throw new RecommendedError('DestinyLegacyPlatform').withError(error);
			case PlatformErrorCodes.ApiInvalidOrExpiredKey:
			case PlatformErrorCodes.ApiKeyMissingFromRequest:
			case PlatformErrorCodes.OriginHeaderDoesNotMatchKey:
				if (__D2_RECOMMENDED_FLAVOR__ === 'dev') {
					throw new RecommendedError('DevVersion').withError(error);
				} else {
					throw new RecommendedError('Difficulties').withError(error);
				}
			case PlatformErrorCodes.DestinyUnexpectedError:
				throw new RecommendedError('Difficulties').withError(error);
			default:
				throw new RecommendedError('UnknownError', error.message).withError(error);
		}
	}

	errorLog('bungie api', 'No response data:', error);
	throw new RecommendedError('Difficulties').withError(error);
}

export const unauthenticatedHttpClient = errorHandledHttpClient(
	responsivelyThrottleHttpClient(
		createHttpClient(
			createFetchWithNonStoppingTimeout(fetch, TIMEOUT, notifyTimeout),
			import.meta.env.VITE_API_KEY,
		),
		logThrottle,
	),
);
