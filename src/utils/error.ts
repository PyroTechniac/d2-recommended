import { type PlatformErrorCodes } from "bungie-api-ts/user";
import { BungieError, convertToError } from ".";

const errorCodes = {
    SlowResponse: "Bungie.net was too slow to respond.",
    NotConnected: 'You may not be connected to the internet.',
    NotConnectedOrBlocked: 'You may not be connected to the internet, or an ad blocking or privacy extension may be blocking Bungie.net.',
    Difficulties: 'Bungie.net is currently experiencing difficulties.',
    NotLoggedIn: 'Please authorize D2 Recommended in order to use this app.',
    NetworkError: (status: number, statusText: string) => `Network error - ${status} ${statusText}`,
    VendorNotFound: 'Vendor data is unavailable.',
    AppNotPermitted: 'D2 Recommended does not have permission to perform this action.',
    Maintenance: 'Bungie.net servers are down for maintenance.',
    Throttled: 'Bungie.net is limiting how many requests D2 Recommended can make.',
    NoAccount: 'No Destiny account was found. Do you have the right platform selected?',
    DestinyLegacyPlatform: "Bungie's services currently have a bug that prevents D2 Recommended from loading info for your Destiny 2 account if you played Destiny 1 on a last-gen console. Bungie will fix this soon, but until then you must play Destiny 1 on a current-gen console to be able to access your info.",
    DevVersion: 'Are you running a development version of D2 Recommended? You must register your chrome extension with Bungie.net.',
    UnknownError: (message: unknown) => `Bungie.net message: ${message}`,
} as const;

export type RecommendedErrorCode = keyof typeof errorCodes;

export class RecommendedError extends Error {
    public cause?: Error;

    public constructor(public code: RecommendedErrorCode, ...args: unknown[]) {
        const message = typeof errorCodes[code] === 'string' ? errorCodes[code] : (errorCodes[code] as Function)(...args);
        super(message);
    }

    public withError(error: unknown): this {
        this.cause = convertToError(error);
        return this;
    }

    public bungieErrorCode(): PlatformErrorCodes | undefined {
        return this.cause instanceof BungieError
            ? this.cause.code
            : this.cause instanceof RecommendedError
                ? this.cause.bungieErrorCode()
                : undefined;
    }
}