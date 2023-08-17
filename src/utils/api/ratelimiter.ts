import noop from 'lodash/noop';

export class RateLimiterQueue {
	public queue: {
		fetcher: typeof fetch;
		request: RequestInfo | URL;
		options?: RequestInit;
		resolver: (value?: unknown) => void;
		rejecter: (value?: unknown) => void;
	}[] = [];

	public count = 0;

	public lastRequestTime = window.performance.now();

	public timer?: number;

	public constructor(
		public pattern: RegExp,
		public timeLimit: number,
	) {}

	public get canProcess(): boolean {
		const currentRequestTime = window.performance.now();
		const timeSinceLastRequest = currentRequestTime - this.lastRequestTime;
		return timeSinceLastRequest >= this.timeLimit && this.count === 0;
	}

	public matches(url: string): RegExpMatchArray | null {
		return url.match(this.pattern);
	}

	public add<T>(
		fetcher: typeof fetch,
		request: RequestInfo | URL,
		options?: RequestInit,
	): Promise<T> {
		let resolver: (value?: unknown) => void = noop;
		let rejecter: (value?: unknown) => void = noop;
		const promise = new Promise<T>((resolve, reject): void => {
			resolver = resolve as (value?: unknown) => void;
			rejecter = reject;
		});

		this.queue.push({
			fetcher,
			request,
			options,
			resolver,
			rejecter,
		});
		this.processQueue();

		return promise;
	}

	private processQueue(): void {
		if (this.queue.length) {
			if (this.canProcess) {
				const config = this.queue.shift()!;
				this.count++;
				config
					.fetcher(config.request, config.options)
					.finally(() => {
						this.count--;
						this.lastRequestTime = window.performance.now();
						this.processQueue();
					})
					.then(config.resolver, config.rejecter);
			} else {
				this.scheduleProcessing();
			}
		}
	}

	private scheduleProcessing(): void {
		if (!this.timer) {
			const nextTryIn = Math.max(
				0,
				this.timeLimit - (window.performance.now() - this.lastRequestTime),
			);

			this.timer = window.setTimeout(() => {
				this.timer = undefined;
				this.processQueue();
			}, nextTryIn);
		}
	}
}

const limiters: RateLimiterQueue[] = [];

export const addLimiter = (queue: RateLimiterQueue): void => {
	limiters.push(queue);
};

export const rateLimitedFetch =
	(fetcher: typeof fetch): typeof fetch =>
	(request: RequestInfo | URL, options?: RequestInit) => {
		const url = request instanceof Request ? request.url : request.toString();
		let limiter: RateLimiterQueue | undefined;
		for (const possibleLimiter of limiters) {
			if (possibleLimiter.matches(url)) {
				limiter = possibleLimiter;
				break;
			}
		}

		return limiter?.add(fetcher, request, options) ?? fetcher(request, options);
	};

export default rateLimitedFetch;
